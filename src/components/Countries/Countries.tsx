import React from "react";
import { useQuery, gql } from "@apollo/client"

const QUERY = gql`
  query countries {
    countries {
      countryId
      code
    }
  }
`

export function Countries () {
  const { loading, error, data } = useQuery(QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p role='alert'>Error :(</p>;

  return data.countries.map(({ countryId, code }: any) => (
    <div key={countryId}>
      <h1>hello there</h1>
      <p>
        {countryId}: {code}
      </p>
    </div>
  ));
}