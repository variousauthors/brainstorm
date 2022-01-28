import React, { ReactElement, ReactText, PropsWithChildren } from 'react'
import tw from 'tailwind-styled-components'
import { useAppContext } from '../Brainstorm'
import { assert, isDefined } from '../../helpers'

export interface ITextProps extends PropsWithChildren<unknown> {
  className?: string
  as?: string
}

function isReactText (obj: unknown): obj is ReactText {
  return typeof obj === 'string' || typeof obj === 'number'
}

/**
 * @TODO need to ad an `as` property that takes an html element name, like span or h1
 * the default is just div but sometimes you need a text element to be an h1
*/
function TranslatedText ({ children, className, as }: ITextProps): ReactElement {
  console.log('TranslatedText', children?.toString())
  const { t } = useAppContext()

  assert(isReactText(children), 'Assertion Failed: tried to translate something that is not text or number.')

  return React.createElement(isDefined(as) ? as : 'span', { className }, [t(children.toString())])
}

export const Text = tw<ITextProps>(TranslatedText)``
