import gql from 'graphql-tag'
import { isDefined } from '@atoms/helpers'
import { useQuery } from '@atoms/hooks'
import { ESource } from '@atoms/_entry'

const QUERY = gql`
  query get {
    agencyCompany {
      onboardingStatus
      agencyCompanyOfferedCourseCategories {
        offeringCourseCategoryId
        estimatedAnnualStudents
      }
      agencyCompanyRecruitingCountries {
        countryId
      }
      agencyCompanySendingCountries {
        countryId
      }
    }
  }
`
interface IAgencyCompanyResponse {
  agencyCompany: {
    agencyCompanyRecruitingCountries: {
      countryId: number
    }[]
    agencyCompanySendingCountries: {
      countryId: number
    }[]
  }
}

export function useQueryAgencyCompany() {
  const { data, error, loading, refetch } = useQuery<IAgencyCompanyResponse>(QUERY, ESource.API_SERVER_V2)

  if (isDefined(error)) {
    throw new Error(error.message)
  }

  return {
    agencyCompany: isDefined(data) ? data.agencyCompany : undefined,
    loading,
    refetch,
  }
}
