import React from 'react'
import { IReactComponentProps } from '@atoms/metadata'
import { useQueryAgencyCompany } from './useQueryAgencyCompany'
import { Words } from '@atoms/components'

export interface IAgencyCompanyInfoProps extends IReactComponentProps {

}

export function AgencyCompanyInfo (_props: IAgencyCompanyInfoProps) {
  const { agencyCompany } = useQueryAgencyCompany()

  const agencyCompanyRecruitingCountries = agencyCompany?.agencyCompanyRecruitingCountries
    .map((country) => (<div key={country.countryId}>{country.countryId}</div>))

  return (
    <div>
      <Words as='h1'>Agency Company Recruiting Countries</Words>
      {agencyCompanyRecruitingCountries}
    </div>
  )
}
