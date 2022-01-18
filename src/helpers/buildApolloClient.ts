import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "@apollo/client";
import { isDefined } from "./safeNavigation";

interface IOptions {
  fetch?: (input: RequestInfo, init?: RequestInit | undefined) => Promise<Response>
}

let _client: ApolloClient<NormalizedCacheObject> | undefined

export function _dangerouslyBuildApolloClient ({ fetch }: IOptions): ApolloClient<NormalizedCacheObject> {
  if (isDefined(_client)) {
    return _client
  }

  _client = new ApolloClient({
    link: new HttpLink({ uri: 'http://localhost:5000/graphql', fetch }),
    cache: new InMemoryCache(),
  });

  return _client
}