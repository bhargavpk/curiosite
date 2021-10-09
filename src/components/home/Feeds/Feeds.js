import { React, useState } from "react";
import { useSelector } from "react-redux";
import { Redirect } from 'react-router-dom'
import Cookies from "universal-cookie";
import InfiniteScroll from "react-infinite-scroller";
import Post from "./Post";

import Loader from "react-loader-spinner";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "2px 4px",
    display: "column",
    alignItems: "center",
    maxWidth: 4000,
    marginLeft: theme.spacing(1),
  },
}));

export default function Feeds(props) {
  const [isAuth, setAuth] = useState(true)
  const [feedState, modifyFeedState] = useState({
    feedList: [],
    skipPage: 0,
    tagsQuestionListSaturated: false,
    totalQuestionListSaturated: false,
    feedFetchDateTime: new Date().getTime(),
  });
  const feed = useSelector((state) => state.feed);
  //Add loading state


  const createFollowsFeed = async () => {
    const idToken = new Cookies().get("idToken")
    const fetchUri =
      "/follows_questions?limit=5&skip=" +
      feedState.skipPage +
      "&date=" +
      feedState.feedFetchDateTime;
    const res = await fetch(fetchUri, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + idToken,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        tags: [],
        tagsQuestionListSaturated: feedState.tagsQuestionListSaturated,
      }),
    });
    const data = await res.json();
    if (!data.error) {
      const newFeedState = { ...feedState };
      newFeedState.tagsQuestionListSaturated = data.tagsQuestionListSaturated;
      newFeedState.totalQuestionListSaturated = data.totalQuestionListSaturated;
      if (data.questionList.length !== 0)
        newFeedState.feedFetchDateTime =
          data.questionList[data.questionList.length - 1].creationTime;
      newFeedState.feedList = newFeedState.feedList.concat(data.questionList);
      modifyFeedState(newFeedState);
    } else {
      //Handle error
      //If unauthenticated redirect to login page
      if(data.error === 'Please authenticate!')
        setAuth(false)
    }
  };

  const createTagFeed = async (tag) => {
    const idToken = new Cookies().get("idToken")
    const fetchUri =
      "/tag_questions?limit=5&skip=" +
      feedState.skipPage +
      "&date=" +
      feedState.feedFetchDateTime;
    const res = await fetch(fetchUri, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + idToken,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        tags: [tag]
      }),
    });
    const data = await res.json();
    if (!data.error) {
      const newFeedState = { ...feedState };
      newFeedState.totalQuestionListSaturated = data.questionListSaturated;
      if (data.questionList.length !== 0)
        newFeedState.feedFetchDateTime =
          data.questionList[data.questionList.length - 1].creationTime;
      newFeedState.feedList = newFeedState.feedList.concat(data.questionList);
      modifyFeedState(newFeedState);
    } else {
      //Handle error
      //If unauthenticated redirect to login page
      if(data.error === 'Please authenticate')
        setAuth(false)
    }
  }

  const createFeed = () => {
    if(props.page === "tag")
        createTagFeed(props.tag)
    else
        createFollowsFeed();
  };

  const classes = useStyles();
  const loader = (
    <div className="loader" style={{
        width: "100%",
        textAlign: "center"
    }}>
      <Button variant="primary" style={{
          display: "inline-block"
      }} disabled>
        <Loader
        type="Puff"
        height={40}
        width={40}
        color="#1D92FF"
        />
      </Button>
    </div>
  );

  return (
    isAuth===false?<Redirect to="/"/>:
    <div className={classes.root}>
      <InfiniteScroll
        pageStart={0}
        loadMore={createFeed}
        hasMore={!feedState.totalQuestionListSaturated}
        loader={loader}
        threshold={0}
      >
        <div>
          {feedState.feedList.map((question, index) => {
            return <Post key={index} questionData={question} />;
          })}
        </div>
      </InfiniteScroll>
    </div>
  );
}
