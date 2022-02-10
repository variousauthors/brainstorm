import * as React from 'react'

import { immutablySet } from '@common/helpers'
import { isEmpty, head, uniqBy, isNil, uniq, assert, isDefined } from '@atoms/helpers'
import { LayeredMenu } from '@common/components'
import { ISelectOption } from '@atoms/metadata'

import { createMenuItemsFromNestedOptions, isDescendentOf, isDescendentOfSome, isLeaf, NestedMultiSelectOptions, sortNestedOptionsCourseCategoryRootPrograms, toSelectOption } from './helpers'
import { useNestedSetModelByTaxonomy, ICourseCategory, useQueryCourseCategories } from './hooks'

export interface IMultiSelectTaxonomyData {
  taxonomyId: number,
  selectedContentIds: number[],

  /** passing "restricted to content ids" allows you
   * to restrict which elements in a taxonomy will appear.
   * Given some ids, an element will appear if:
   *
   * it has the correct taxonomyId
   * AND
   * it matches one of the specified content ids
   * OR
   * it is a descendant of one an element with one of the specified content ids
   */
  restrictedToContentIds?: number[],
  placeholder?: string
}

export interface IMultiSelectCourseCategoryByTaxonomyProps {
  taxonomiesData: IMultiSelectTaxonomyData[]
  onChange: (taxonomiesData: IMultiSelectTaxonomyData[]) => void
}

export function MultiSelectCourseCategoryByTaxonomy (props: IMultiSelectCourseCategoryByTaxonomyProps) {
  const courseCategories = useQueryCourseCategories()

  const { taxonomiesData } = props
  const taxonomicalRules = taxonomiesData.map((taxonomyData) => {
    return {
      is: (category: ICourseCategory) => {
        if (isNil(taxonomyData.restrictedToContentIds)) {
          return category.taxonomyId === taxonomyData.taxonomyId
        }

        // if there are parent content ids
        const preselectedCategories = courseCategories.filter((category) => taxonomyData.restrictedToContentIds?.includes(category.contentId))

        return category.taxonomyId === taxonomyData.taxonomyId
          && (isDescendentOfSome(category, preselectedCategories) || taxonomyData.restrictedToContentIds.includes(category.contentId))
      },
      isSelected: (category: ICourseCategory) => taxonomyData.selectedContentIds.includes(category.contentId),
    }
  })

  const { taxonomies, selectedByTaxonomy, handleChange } = useNestedSetModelByTaxonomy(courseCategories, taxonomicalRules, {
    onChange: (...selectedByTaxonomy) => {
      // map it back to taxonomies data
      props.onChange(
        selectedByTaxonomy.map((change, index) => {
          const taxonomyData = taxonomiesData[index]
          assert(isDefined(taxonomyData))

          return {
            ...taxonomyData,
            selectedContentIds: uniq(change.map((category) => category.contentId)),
          }
        }),
      )
    },
  })

  const layeredMenus = selectedByTaxonomy.map((selectedCourseCategories, index) => {
    const taxonomyData = props.taxonomiesData[index]
    assert(isDefined(taxonomyData))

    const courseCategories = taxonomies[index]
    assert(isDefined(courseCategories))

    const selectedCategoriesFromPrevious = selectedByTaxonomy.slice(index - 1, index).flat()
    const selectedAncestors = selectedCategoriesFromPrevious
      .filter((category) => isLeaf(category, selectedCategoriesFromPrevious))

    const selectedCategoriesToShow = selectedCourseCategories
      .filter((category) => isLeaf(category, selectedCourseCategories))

    if (index > 0 && isEmpty(selectedAncestors)) {
      return (
        <LayeredMenu
          key={index}
          menu={[]}
          selectedItems={[]}
          onChange={() => {
            //
          }}
          placeholder={isNil(taxonomyData.placeholder) ? '' : taxonomyData.placeholder}
        />
      )
    }

    /**
     * @HACK a pragmatic hack to handle menu item generation for multiple ancestors.
     * Multiple ancestors result in multiple subtree, which we then need to merge together to avoid showing duplicates.
     * The technically perfect solution is to do the actual merge. Turn each tree into menues, then merge the menues.
     * However, this technically-perfect solution is an over-kill for the busines rules.
     *
     * The business use case at the time of writing is for user to search for higher ed courses.
     * The higher ed courses are all under the depth 1 node, HIGHER_EDUCATION.
     * Under this HIGHER_EDUCATION node, is the taxonomy=1 nodes that represent the course type, such as certificate, diploma, and post-grad.
     * As a business rule, all these nodes have the same sub-nodes, same course programs such as engineering, business, etc...
     * Which means, there is no need to merge under this assumption, as the subtree of all these are identical.
     * We can simply take one of them.
     *
     * @whenToFindNewSolution
     * Most likely never. It's only practical for people to be selecting groups that share identical children.
     * There is almost no practical sense to have a "nested select" that start to diverge in the sub-trees.
     */
    const representingAncestor = head(selectedAncestors) as ICourseCategory

    const courseCategoriesToShow = courseCategories
      .filter((category) => index === 0 || isDescendentOf(category, representingAncestor))
      .filter((category) => isNil(selectedCategoriesToShow.find((selectedCategory) => selectedCategory.contentId === category.contentId)))

    const nestedOptions = NestedMultiSelectOptions.fromLeftRightTreeStructure(uniqByContentId(courseCategoriesToShow))

    const nestedOptionsItems = nestedOptions.getOptions()
    const sortedNestedOptionsItems = taxonomyData.taxonomyId === 2 ? sortNestedOptionsCourseCategoryRootPrograms(nestedOptionsItems) : nestedOptionsItems
    const menuItems = createMenuItemsFromNestedOptions(sortedNestedOptionsItems)

    // map them in
    const selectedItems = uniqByContentId(selectedCategoriesToShow).map(toSelectOption)

    return (
      <LayeredMenu
        key={index}
        menu={menuItems}
        selectedItems={selectedItems}
        onChange={(selectedOptions) => {
          // map them out
          const selectedCourseCategories = toSelectedCategories(selectedOptions)

          handleChange(
            ...immutablySet(selectedByTaxonomy, index, selectedCourseCategories),
          )
        }}
        placeholder={isNil(taxonomyData.placeholder) ? '' : taxonomyData.placeholder}
      />
    )

    function toSelectedCategories (selectedOptions: ISelectOption[]) {
      assert(isDefined(courseCategories))
      const selectedCourseCategories = courseCategories.filter((category) => selectedOptions.find((option) => category.id === option.value))
      return selectedCourseCategories
    }
  })

  return (
    <>
      {isEmpty(courseCategories) ? <div role='progressbar'>Loading...</div> : layeredMenus}
    </>
  )
}

function uniqByContentId (courseCategories: ICourseCategory[]) {
  return uniqBy(courseCategories, (category) => category.contentId)
}

/**********************************
 * Archive Start
 *********************************/
/**
 * The initial implementation included an "explodeCourseCategories" step in the `toSelectedCategories` function.
 * This turned out to be undesireable as we only care about the leaf node of each taxonomy.
 *
 * Motivation:
 * bug - where search, when including a higherEd->PhD filter, would include everything from higher ed, instead of just PhD.
 * This was caused by this explode step including the higherEd content id.
 * The offeringSearch api uses "OR relationship" to join multiple contents of the same taxonomy.
 * These two had bad interaction.
 *
 * Notes:
 * We don't need the path. It's all okay if a node happens to be out-of-place (orphaned/without parent).
 * This is no logically perfect, but it is fine pragmatically.
 *
 */

/** expands an array of categories to include all the categories above those categories in the tree */
// function explodeCourseCategories (categories: ICourseCategory[], allCategories: ICourseCategory[]) {
//   return categories
//     .reduce((exploded, type) => {
//       const path = getPath(type, allCategories)

//       return uniq(exploded.concat(path))
//     }, [] as ICourseCategory[])
// }
/**********************************
 * Archive End
 *********************************/
