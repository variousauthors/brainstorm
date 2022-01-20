import {
  ApolloClient,
  ApolloLink,
  FetchResult,
  from,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
  Observable,
  Operation,
} from "@apollo/client";
import { isDefined } from "./safeNavigation";

class MissingSourceLink extends ApolloLink {
  request(operation: Operation): Observable<FetchResult> | null {
    throw new TypeError(`operation "${operation.operationName}" specified an unknown source: ${operation.getContext().source}`)
  }
}

export const enum ESource {
  AGENCY_API,
  API_SERVER_V2,
}

function isApiServerV2 (source: ESource): source is ESource.API_SERVER_V2 {
  return source === ESource.API_SERVER_V2
}

function isAgencyApi (source: ESource): source is ESource.AGENCY_API {
  return source === ESource.AGENCY_API
}

interface IOptions {
  fetch?: (input: RequestInfo, init?: RequestInit | undefined) => Promise<Response>
}

let _client: ApolloClient<NormalizedCacheObject> | undefined

export function _dangerouslyBuildApolloClient ({ fetch }: IOptions): ApolloClient<NormalizedCacheObject> {
  if (isDefined(_client)) {
    return _client
  }

  const brainstormLink = new ApolloLink((operation, forward) => {
    const source = operation.getContext().source

    if (!isDefined(source)) {
      throw new TypeError(`${operation.operationName} did not specify a source.`)
    }

    return forward(operation)
  }).split(
    (operation) => isAgencyApi(operation.getContext().source),
    new HttpLink({ uri: 'http://localhost:3000/graphql', fetch }),
    new ApolloLink((operation, forward) => forward(operation))
      .split(
        (operation) => isApiServerV2(operation.getContext().source),
        new HttpLink({ uri: 'http://localhost:5000/graphql', fetch }),
        new MissingSourceLink(),
      )
  )

  _client = new ApolloClient({
    link: from([brainstormLink]),
    cache: new InMemoryCache(),
  });

  return _client
}
