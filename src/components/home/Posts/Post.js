import { Avatar } from '@material-ui/core';
import React ,{forwardRef}from 'react'
import "./Post.css";

const Post = forwardRef(({name,description,message,photoUrl},ref) => {
    return (
        <div ref={ref}className="Post">
            <div className="post__header">
                <Avatar/>
                <div className="post__info">
                    <h2>{name}</h2>
                    <p>{description}</p>
                </div>
            </div>
            <div className="post__body">
                <p>{message}</p>
            </div>
        </div>
    )
}
)
export default Post