import React from "react";
import { PropsWithChildren } from "react";
import { ApolloProvider } from "./ApolloProvider";

export function Brainstorm ({ children }: PropsWithChildren<{}>) {
  return (
    <ApolloProvider>
      {children}
    </ApolloProvider>
  )
}