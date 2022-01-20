import React, { ReactElement, ReactText, PropsWithChildren } from 'react'
import tw from 'tailwind-styled-components';
import { useAppContext } from '../Brainstorm';
import { assert } from '../../helpers/assert';

export interface ITextProps extends PropsWithChildren<{}> {
  className?: string
}

function isReactText (obj: any): obj is ReactText {
  return typeof obj === 'string' || typeof obj === 'number'
}

/** 
 * @TODO need to ad an `as` property that takes an html element name, like span or h1 
 * the default is just div but sometimes you need a text element to be an h1
*/
function TranslatedText ({ children, className }: ITextProps): ReactElement<any, any> | null {
  const { t } = useAppContext()

  assert(isReactText(children), `Assertion Failed: tried to translate something that is not text or number.\nReceived: ${children}`)

  return (
    <div className={className}>{t(children.toString())}</div>
  )
}

export const Text = tw<ITextProps>(TranslatedText)``;
