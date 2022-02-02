import { isNil, reverse } from '@atoms/helpers'
import { INode, isDescendentOfSome } from '../helpers'
import { compact } from 'lodash'

interface ITaxonomicalRule<T extends INode> {
  is: (node: T) => boolean
  isSelected: (node: T) => boolean
}

/** the general strategy here is:
 *
 * stratify the selected nodes by depth [[a], [b, B], [c, C]]
 * rectify them so that all selected nodes have selected parents [[a], [b], [c]]
 * partition the resulting list of nodes by taxonomy [[a, b], [c]]
 **/
export function useNestedSetModelByTaxonomy <T extends INode>(nodes: T[], taxonomicalRules: ITaxonomicalRule<T>[], options: { onChange: (...args: T[][]) => void }) {
  const selectedNodes = nodes.filter((node) => taxonomicalRules.find(({ is }) => is(node))?.isSelected(node))
  const stratifiedSelection = stratify(selectedNodes)
  const rectifiedSelection = rectify(stratifiedSelection)

  const taxonomies = partition(nodes)
  const selectedByTaxonomy = partition(rectifiedSelection)

  const handleChange = (...partitionedSelectedNodes: T[][]) => {
    const selectedNodes = partitionedSelectedNodes.flat()
    const stratifiedSelection = stratify(selectedNodes)
    const rectifiedSelection = rectify(stratifiedSelection)
    const partitionedSelection = partition(rectifiedSelection)

    options.onChange(...partitionedSelection)
  }

  return {
    taxonomies,
    selectedByTaxonomy,
    handleChange,
  }

  /** partition the nodes by taxonomy, creating strata which may contain
   * elements from different taxonomies.
   **/
  function stratify (nodes: T[]) {
    const partitionField = 'taxonomyId'

    const result = nodes.reduce((acc, node) => {
      if (isNil(acc[node[partitionField]])) {
        acc[node[partitionField]] = []
      }

      acc[node[partitionField]]?.push(node)

      return acc
    }, [] as T[][])

    return compact(result)

    /**********************************
     * Archive Start
     *********************************/
    /**
     * The initial implementation included a "perfect chain" step.
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
     */
    /** have to backfill since there might be empty elements
     * and javascript arrays are _IDIOTS_
     *
     * ```
     * const a = []
     * a[4] = 'hello'
     * a.reduce((result, el) => result.concat(el), [])
     * // => ['hello'] >o<//
     * ```
     */
    // for (let i = 0; i < result.length; i++) {
    //   if (isNil(result[i])) {
    //     result[i] = []
    //   }
    // }

    /**********************************
     * Archive End
     *********************************/
  }

  /** given stratified nodes we can now reduce them into a flat array
   * in which every node is guaranteed to be part of a path back to
   * one of the root nodes.
   *
   * suppose we have taxonomical data like [a, A], [b, B], [c, C]
   *
   * and the selected elements have been stratified like
   *
   * [[a], [b, B], [c, C]]
   *
   * notice that A is missing so B and C should not be there.
   *
   * reverse
   * [[c, C], [b, B], [a]]
   *
   * reduce
   * [c, C] // so far so good
   *
   * [c, C, b, B] // this is fine, all elements have parents
   *
   * [c, C, b, B, a] // now we have to filter based on a
   *
   * [c, b, a] // result
   *
   **/
  function rectify (strata: T[][]) {
    return reverse(strata).reduce((acc, selected, index) => {
      // the first element is always already rectified
      // since at this point there are no parent/child relationships
      if (index === 0) {
        return selected
      }
      // each node so far must be a descendent of some
      // node from each new strata

      return acc
        .filter((node) => isDescendentOfSome(node, selected))
        .concat(selected)
    }, [] as T[])
  }

  /** partition the given array of nodes by their taxonomy */
  function partition (nodes: T[]) {
    return taxonomicalRules.map(({ is }) => {
      return nodes.filter(is)
    })
  }
}
