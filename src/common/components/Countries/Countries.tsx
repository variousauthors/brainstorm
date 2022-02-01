import React from 'react'
import { useQuery, gql } from '@apollo/client'
import { ESource } from '@atoms/_entry'
import { assert, isDefined } from '@atoms/helpers'
import { Words } from '@atoms/components'

export interface ICountriesProps {
  source: ESource
}

const apiServerV2 = gql`
  query countries {
    countries {
      countryId
      code
    }
  }
`

const agencyApi = gql`
  query getCountryList {
    getCountryList {
      countryId
      code
    }
  }
`

interface ICountry {
  countryId: number
  code: string
}

export function Countries ({ source }: ICountriesProps): JSX.Element {
  const QUERY = source === ESource.AGENCY_API ? agencyApi : apiServerV2

  const { loading, error, data } = useQuery<{ countries: ICountry[], getCountryList: ICountry[] }>(QUERY, {
    context: {
      source,
    },
  })

  if (loading) return <p>Loading...</p>
  if (isDefined(error)) return <p role='alert'>Error :(</p>

  assert(isDefined(data), 'Assertion failed: fetched data was undefined')

  const countries = isDefined(data.countries) ? data.countries : data.getCountryList

  return (
    <>
      {countries.map(({ countryId, code }) => (
        <div key={countryId}>
          <h1><Words>hello there</Words></h1>
          <p>
            {countryId}: {code}
          </p>
        </div>
      ))}
    </>
  )
}