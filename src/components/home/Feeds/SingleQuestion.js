import React, {useEffect, useState, useRef} from "react";
import { useSelector } from 'react-redux'
import { useParams, Redirect } from 'react-router-dom'
import Cookies from 'universal-cookie'
import Card from "@mui/material/Card";
import { Container, Grid, Paper, TextareaAutosize } from "@mui/material";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faChevronUp, faChevronDown } from '@fortawesome/fontawesome-free-solid'
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import './Post.css'
import './SingleQuestion.css'

const SingleQuestion = (props) => {
  const { AuthorEmail, content, name, tags, questionData } =
    props.location.state;
    const user = useSelector(state => state.user)

  const { id } = useParams()
  const [isAuth, setAuth] = useState(true)
  const [answers, setAnswers] = useState([])
  const [initRequest, setRequestStatus] = useState(false)
  const [upvotedAns, setUpvotedAns] = useState([])
  const [downvotedAns, setDownvotedAns] = useState([])
  const [originallyUpvoted, setOriginallyUpvoted] = useState([])
  const [originallyDownvoted, setOriginallyDownvoted] = useState([])
  const textInput = useRef(null)

  const requestAnswers = async () => {

    const idToken = (new Cookies()).get('idToken')
    const questionId = id
    const res = await fetch('/question_answers?id='+questionId, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer '+idToken,
            'Content-type': 'application/json',
            'Accept': 'application/json'
        }
    })
    const data = await res.json()
    // Handle errors
    if(!data.error)
    {
        const newAnswers = []
        data.answers.forEach(answer => {
            const ans = {
                author: answer.author.email,
                content: answer.content,
                id: answer._id,
                upvotes: answer.upvotes,
                downvotes: answer.downvotes
            }
            newAnswers.push(ans)
        });
        setAnswers(newAnswers)
        setUpvotedAns(data.answersUpvoted)
        setOriginallyUpvoted(data.answersUpvoted)
        setOriginallyDownvoted(data.answersDownvoted)
        setDownvotedAns(data.answersDownvoted)
        setRequestStatus(true)
    }
    else
    {
        if(data.error === 'Please authenticate!')
            setAuth(false)
    }
  }

  const submitVotes = async (upvoteId, downvoteId) => {
    const idToken = (new Cookies()).get('idToken')
      if(upvoteId !== "")
      {
        const res = await fetch('/upvote', {
            method: 'PATCH',
            headers: {
                'Authorization': 'Bearer '+idToken,
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                email: user.email,
                answers: [upvoteId]
            })
        })
        const data = await res.json()
        if(data.error === 'Please authenticate!')
            setAuth(false)
      }
      if(downvoteId !== "")
      {
        const res = await fetch('/downvote', {
            method: 'PATCH',
            headers: {
                'Authorization': 'Bearer '+idToken,
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                email: user.email,
                answers: [downvoteId]
            })
        })
        const data = await res.json()
        if(data.error === 'Please authenticate!')
            setAuth(false)
      }
      // Handle errors
  }

  useEffect(() => {
      if(initRequest === false)
      {
        requestAnswers()
      }
  }, [initRequest])

  const submitAnswer = async content => {
    const idToken = (new Cookies()).get('idToken')
      const res = await fetch('/answer', {
          method: 'POST',
          headers: {
              'Authorization': 'Bearer '+idToken,
              'Content-type': 'application/json',
              'Accept': 'application/json'
          },
          body: JSON.stringify({
              email: user.email,
              question: id,
              answer: content
          })
      })
      const data = await res.json()
      if(!data.error)
      {
        const newAnswers = [...answers]
        newAnswers.push({
            author: user.email,
            content,
            id: data.answer._id,
            upvotes: [],
            downvotes: []
        })
        setAnswers(newAnswers)
      }
      else
      {
          if(data.error === 'Please authenticate!')
            setAuth(false)
      }
      // Handle error
      
  }

  const handleSubmit = () => {
      const content = textInput.current.value
      if(content === "")
        return
      submitAnswer(content)
  }

  const newUpvote = async answerId => {
    await submitVotes(answerId, "")
    const upvoteArr = [...upvotedAns]
    const downvoteArr = [...downvotedAns]
    const idIndex = upvoteArr.indexOf(answerId)
    if(idIndex === -1)
        upvoteArr.push(answerId)
    const downvoteIndex = downvoteArr.indexOf(answerId)
    if(downvoteIndex !== -1)
        downvoteArr.splice(downvoteIndex, 1)
    setUpvotedAns(upvoteArr)
    setDownvotedAns(downvoteArr)
  }

  const newDownvote = async answerId => {
    await submitVotes("", answerId)
    const upvoteArr = [...upvotedAns]
    const downvoteArr = [...downvotedAns]
    const idIndex = upvoteArr.indexOf(answerId)
    if(idIndex !== -1)
        upvoteArr.splice(idIndex, 1)
    const downvoteIndex = downvoteArr.indexOf(answerId)
    if(downvoteIndex === -1)
        downvoteArr.push(answerId)
    setUpvotedAns(upvoteArr)
    setDownvotedAns(downvoteArr)
  }

  return (
    isAuth===false?<Redirect to="/"/>:
    <Container>
      <Grid>
        <Grid item>
          <Card sx={{ minWidth: 650 }}>
            <CardContent>
            <Typography
                sx={{ fontSize: 15 }}
                color="text.primary"
              >
                <b>{name}</b>
              </Typography>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                <b>{AuthorEmail}</b>
              </Typography>

              <Typography variant="h5">{content}</Typography>
              <br />
              <Typography variant="body2">{}</Typography>
              <div className="post__tags">
                {
                    tags.map((tag, index) => (
                        <div className="tag-ele" key={index}>
                            {tag}
                        </div>
                    ))
                }
            </div>
            </CardContent>
          </Card>
        </Grid>
        

        <Grid xs={12} sx={{ minWidth: 635, marginTop: 5 }}>
          {answers.map((ans) => {
              const upvoteStatus = upvotedAns.indexOf(ans.id)===-1?0:1
              const downvoteStatus = downvotedAns.indexOf(ans.id)===-1?0:1
              const originallyUpvotedStatus = originallyUpvoted.indexOf(ans.id)===-1?0:1
              const originallyDownvotedStatus = originallyDownvoted.indexOf(ans.id)===-1?0:1
              const originalScore = ans.upvotes.length - ans.downvotes.length
              const scoreWithoutUser = originalScore - (originallyUpvotedStatus-originallyDownvotedStatus)
              const score = scoreWithoutUser + upvoteStatus - downvoteStatus
              return <Card style={{ marginBottom: 15 }}>
                    <div className="answer-container">
                            <div className="vote-container">
                                <FontAwesomeIcon className="vote-icon" icon={faChevronUp} size="2x" onClick={()=>{newUpvote(ans.id)}} cursor="pointer"
                                    color={upvoteStatus === 0?"black":"orange"} 
                                />
                                <div className="vote-count-container">{score}</div>
                                <FontAwesomeIcon className="vote-icon" icon={faChevronDown} size="2x" onClick={()=>{newDownvote(ans.id)}} cursor="pointer"
                                    color={downvoteStatus === 0?"black":"orange"}
                                />
                            </div>

                            <CardContent sx={{ minHeight: 50 }}>
                                <Typography
                                sx={{ fontSize: 14 }}
                                color="text.secondary"
                                gutterBottom
                                >
                                <b>{ans.author}</b>
                                </Typography>

                                <Typography
                                sx={{
                                    fontSize: 18,
                                    display: "inline-block",
                                }}
                                color="text.primary"
                                >
                                {ans.content}
                                </Typography>
                            </CardContent>
                        </div>
                    </Card>

          })}
        </Grid>

        <Grid item>
          <Typography variant="h5" style={{ marginBottom: 5 }}>
            Want to answer?
          </Typography>
          <Card style={{ marginBottom: 15 }} sx={{ minWidth: 650 }}>
            <CardContent sx={{ minHeight: 50 }}>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
              </Typography>

              <TextareaAutosize
              ref={textInput}
                style={{
                  maxWidth: 600,
                  minWidth: 600,
                  maxHeight: 300,
                  minHeight: 300,
                  overflow: "auto",
                }}
              />
            </CardContent>
            <div style={{ marginBottom: 4 }}>
              <Button
                style={{
                  textDecoration: "none",
                  marginLeft: 5,
                  marginRight: 5,
                }}
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Submit
              </Button>
            </div>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default SingleQuestion;
