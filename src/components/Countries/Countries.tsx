import { useQuery, gql } from "@apollo/client"

const QUERY = gql`
  query {
    countries {
      countryId
      code
    }
  }
`

export function Countries () {
  const { loading, error, data } = useQuery(QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.countries.map(({ countryId, code }: any) => (
    <div key={countryId}>
      <p>
        {countryId}: {code}
      </p>
    </div>
  ));
}