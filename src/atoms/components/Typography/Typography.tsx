import React, { ReactElement, ReactText } from 'react'
import tw from 'tailwind-styled-components'
import { assert, isDefined } from '@atoms/helpers'
import { useAppContext } from '@atoms/hooks'
import { IReactComponentProps } from '@atoms/metadata'

export interface ITextProps extends IReactComponentProps {
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
  const { t } = useAppContext()

  assert(isReactText(children), 'Assertion Failed: tried to translate something that is not text or number.')

  return React.createElement(isDefined(as) ? as : 'span', { className }, [t(children.toString())])
}

export const Words = tw<ITextProps>(TranslatedText)``
