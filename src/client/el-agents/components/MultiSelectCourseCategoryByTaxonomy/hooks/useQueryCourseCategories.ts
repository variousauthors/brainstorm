import { useMemo } from 'react'
import { isDefined, isNil, safelyCallEffect } from '@atoms/helpers'
import { useQuery } from '@atoms/hooks'
import { ESource } from '@atoms/_entry'
import gql from 'graphql-tag'
import { makeMock } from '@common/helpers'

export interface ICourseCategory {
  id: number
  contentId: number
  taxonomyId: number
  name: string
  children?: ICourseCategory[]
  left: number
  right: number
  depth: number
}

interface ICourseCategoryContentResponse {
  offeringCourseCategoryContentId: number
  codeName: string
}

export interface ICourseCategoryResponse {
  offeringCourseCategoryId: number
  offeringCourseCategoryContentId: number
  offeringCourseCategoryTaxonomyId: number

  /** @deprecated (2020-09-14) this field is here to support older components */
  codeName: string
  children?: ICourseCategoryResponse[]
  left: number
  right: number
  depth: number
  offeringCourseCategoryContent: ICourseCategoryContentResponse
}

export interface IResponse {
  offeringCourseCategories: Array<ICourseCategoryResponse>
}

const COURSE_CATEGORY_BY_TAXONOMY_QUERY = gql`
  query offeringCourseCategoriesByTaxonomy($offeringCourseCategoryTaxonomyId: Int, $parentOfferingCourseCategoryIds: [Int]) {
    offeringCourseCategories(offeringCourseCategoryTaxonomyId: $offeringCourseCategoryTaxonomyId, parentOfferingCourseCategoryIds: $parentOfferingCourseCategoryIds) {
      offeringCourseCategoryId
      offeringCourseCategoryContentId,
      offeringCourseCategoryTaxonomyId,
      left
      right
      depth
      codeName
      offeringCourseCategoryContent {
        offeringCourseCategoryContentId,
        codeName
      }
    }
  }
`

export interface ICourseCategoriesQueryProps {
  children: (courseCategories: Array<ICourseCategory>) => JSX.Element
}

interface ICourseCategoriesByTaxonomyVariables {
  offeringCourseCategoryTaxonomyId?: number
  parentOfferingCourseCategoryIds?: number[]
}

interface IOptions {
  skip?: boolean
  onCompleted?: (courseCategories: ICourseCategory[]) => void
}

export function useQueryCourseCategoriesByTaxonomy (params?: ICourseCategoriesByTaxonomyVariables, options?: IOptions) {
  const { data, error, loading } = useQuery<IResponse, ICourseCategoriesByTaxonomyVariables>(COURSE_CATEGORY_BY_TAXONOMY_QUERY, ESource.API_SERVER_V2, {
    variables: {
      offeringCourseCategoryTaxonomyId: params?.offeringCourseCategoryTaxonomyId,
      parentOfferingCourseCategoryIds:  params?.parentOfferingCourseCategoryIds,
    },
    skip: options?.skip,
    onCompleted: (data) => {
      const onCompleted = options?.onCompleted

      safelyCallEffect(onCompleted, data.offeringCourseCategories.map(toCourseCategory))
    },
  })

  return useMemo(() => {
    if (isDefined(error)) {
      throw new Error(error.message)
    }

    if (isNil(data) || loading) {
      return []
    }

    return data.offeringCourseCategories.map(toCourseCategory)
  }, [data?.offeringCourseCategories, error, loading])
}

/** older components used a query called "courseCategories" which was not by taxonomy
 * but this ie equivalent to just not passing in any taxonomies */
export const useQueryCourseCategories = useQueryCourseCategoriesByTaxonomy

function toCourseCategory(courseCategory: ICourseCategoryResponse): ICourseCategory {
  return {
    id: courseCategory.offeringCourseCategoryId,
    contentId: courseCategory.offeringCourseCategoryContentId,
    taxonomyId: courseCategory.offeringCourseCategoryTaxonomyId,
    name: courseCategory.offeringCourseCategoryContent.codeName,
    left: courseCategory.left,
    right: courseCategory.right,
    depth: courseCategory.depth,
  }
}

export const mock = makeMock<IResponse, {
  offeringCourseCategoryTaxonomyId: number,
  parentOfferingCourseCategoryIds: number[],
}>(
  'offeringCourseCategoriesByTaxonomy',
  {
    offeringCourseCategories: [],
  },
)
