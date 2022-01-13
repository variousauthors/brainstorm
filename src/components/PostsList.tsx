import React,{FC} from 'react'
import { Button } from './Button'

interface IPost {
  slug: string
  title: string
}

interface IPostsListProps {
  posts: IPost[]
  onClick: (slug: string) => void
}

export function PostsList({ posts, onClick }: IPostsListProps) {
  return (
    <div>
      <h1>Posts List Bar</h1>
      <Button />
      <ul>
        {posts.map(post => (
          <li key={post.slug}>
            <button onClick={() => onClick(post.slug)}>{post.title}</button>
          </li>
        ))}
      </ul>
    </div>
  )
}