import React from "react";
import { useQuery, gql } from "@apollo/client"
import { ESource, isDefined } from "../../helpers";
import { useAppContext } from "../Brainstorm";

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

export function Countries ({ source }: ICountriesProps): JSX.Element {
  const bob = useAppContext()
  const QUERY = source === ESource.AGENCY_API ? agencyApi : apiServerV2

  const { loading, error, data } = useQuery(QUERY, {
    context: {
      source,
    }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p role='alert'>Error :(</p>;

  const countries = isDefined(data.countries) ? data.countries : data.getCountryList

  return countries.map(({ countryId, code }: any) => (
    <div key={countryId}>
      <h1>{bob.t('hello there')}</h1>
      <p>
        {countryId}: {code}
      </p>
    </div>
  ));
}