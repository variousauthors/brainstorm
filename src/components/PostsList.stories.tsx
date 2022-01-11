import React,{FC} from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'
import { useState } from 'react'
import { PostsList as Base } from '@brainstorm'

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: 'PostsList',
  component: Base,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
  },
} as ComponentMeta<typeof Base>

interface IStoryProps {

}

type Story<T> = ComponentStory<(props: T) => null> 

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
export const PostsList: Story<IStoryProps> = () => {
  const [currentPost, setCurrentPost] = useState('')

  return (
    <>
      <div>Current Post: {currentPost}</div>
      <Base
        posts={[
          { title: 'FIRST POST', slug: 'first-post' },
          { title: 'SECOND POST', slug: 'second-post' },
        ]}
        onClick={setCurrentPost}
      />
    </>
  )
}