import {
  ApolloClient,
  ApolloLink,
  FetchResult,
  from,
  HttpLink,
  HttpOptions,
  InMemoryCache,
  NormalizedCacheObject,
  Observable,
  Operation,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { assert, isDefined, buildTypeGuard } from '@atoms/helpers'

class MissingSourceLink extends ApolloLink {
  request(operation: Operation): Observable<FetchResult> {
    throw new TypeError(`operation "${operation.operationName}" specified an unknown source`)
  }
}

function EdvisorHttpLink (options: HttpOptions & { apiKey: string }) {
  const authLink = setContext((_, { headers }: { headers: { authorization: string } }) => {
    const apiKey = options.apiKey

    return {
      headers: {
        ...headers,
        authorization: `Bearer ${apiKey}`,
      },
    }
  })

  return authLink.concat(new HttpLink(options))
}

export const enum ESource {
  AGENCY_API = 'AGENCY_API',
  API_SERVER_V2 = 'API_SERVER_V2',
}

const isBrainstormContext = buildTypeGuard({
  source: isESource,
})

function checkSource (operation: Operation, source: ESource): boolean {
  const context = operation.getContext()
  assert(isBrainstormContext(context), `operation ${operation.operationName} did not specify a source.`)

  return context.source === source
}

function isESource (obj: unknown): obj is ESource {
  switch (obj) {
    case ESource.AGENCY_API: return true
    case ESource.API_SERVER_V2: return true
    default: return false
  }
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
    const context = operation.getContext()
    assert(isBrainstormContext(context), `operation ${operation.operationName} did not specify a source.`)

    return forward(operation)
  }).split(
    (operation) => checkSource(operation, ESource.AGENCY_API),
    EdvisorHttpLink({ apiKey: '', uri: 'http://localhost:3000/graphql', fetch }),
    new ApolloLink((operation, forward) => forward(operation))
      .split(
        (operation) => checkSource(operation, ESource.API_SERVER_V2),
        EdvisorHttpLink({ apiKey: 'private_companyId_17', uri: 'http://localhost:5000/graphql', fetch }),
        new MissingSourceLink(),
      ),
  )

  _client = new ApolloClient({
    link: from([brainstormLink]),
    cache: new InMemoryCache(),
  })

  return _client
}
