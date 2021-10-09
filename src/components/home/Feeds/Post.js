import { Avatar } from "@material-ui/core";
import React, { forwardRef } from "react";
import InputOption from "./InputOption";
import { Link } from "react-router-dom";
import getDateTime from '../../../util/timeFormat'

const Post = ({ questionData }) => {
  const AuthorEmail = questionData.author.email;
  const { content, tags } = questionData;
  const name = `${questionData.author.firstName}  ${questionData.author.lastName}`;
  const creationTime = questionData.createdAt

  const id = questionData._id;

  const newTo = {
    pathname: `/question/${id}`,
    state: {
      AuthorEmail: AuthorEmail,
      content: content,
      tags: tags,
      name: name,
      questionData: questionData,
    },
  };
  return (
    <Link to={newTo}>
      <div className="Post">
        <div className="post__header">
          <Avatar />
          <div className="post__info">
            <h2>{name}</h2>
            <p>{AuthorEmail}</p>
            <p><b>{getDateTime(creationTime)}</b></p>
          </div>
        </div>
        <div className="post__body">
          {/* <p>{message}</p> */}
          <p>{content}</p>
        </div>
        <div className="post__tags">
          {
              tags.map((tag, index) => (
                  <div className="tag-ele" key={index}>{tag}</div>
              ))
          }
        </div>
      </div>
    </Link>
  );
};
export default Post;
