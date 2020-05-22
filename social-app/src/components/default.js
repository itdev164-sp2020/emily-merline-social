import React, { useState } from "react"
import { useQuery, useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'

const GET_POSTS = gql `
query getPosts {
    posts {
      user {
        name
      }
      title
      created_at
      updated_at
      content
      id
    }
  }
`  

const SET_POST = gql `
mutation createPost($title: String!, $content: String!) {
    insert_posts(
        objects: {
            content: $content, 
            title: $title
        }
        ) {
        affected_rows
    }
  }
`  

const Post = ({post}) => {
    return (
        <div>
        <h3>
            {post.title} by {post.user.name}
            </h3>
        <div>{post.content}</div>
        </div>
    )
}

const PostEditor = () => {
    const [post, setPost] = useState({title: '', content: ''})
    const [createPost, {data}] = useMutation(SET_POST)
    const handleChange = e => {
        setPost({
            ...post,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = e => {
        e.preventDefault()
        createPost( { variables: { title: post.title, content: post.content }})
        setPost({ title: '', content: ''})
        
    }
    return (
        <form onSubmit={handleSubmit}>
            <p><label htmlFor="title">Title</label>
            <input 
            type="text"
            onChange={handleChange} 
            name="title" 
            id="title" 
            value={post.title}
            placeholder="Post Title"/>
            </p><p>
            <label htmlFor="content">Content</label>
            <input 
            type="text"
            onChange={handleChange}  
            name="content" 
            id="content" 
            value={post.content}
            placeholder="Write some stuff!"/>
            </p>
            <button type="submit">Create</button>
        </form>
    )
}
export default () => {
    const { loading, error, data } = useQuery(GET_POSTS, {
        pollInterval: 2000
    })
    if(loading)
        return <span>loading...</span>
    if(error)
        return <pre>{JSON.stringify(error)}</pre>
    return (
        <div>
            <PostEditor />
            {data.posts.map(p =>(<Post post={p} key={p.id}/>))}
        </div>
    )
} 
