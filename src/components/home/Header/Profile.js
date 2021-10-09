import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { Redirect } from 'react-router-dom'
import Cookies from 'universal-cookie'
import Card from "@mui/material/Card";
import { Container, Grid, Paper } from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Loader from "react-loader-spinner";

import { patchTags } from '../../../actions/userSessionActions'

import "./Profile.css";


const Profile = () => {

  const dispatch = useDispatch()
  const user = useSelector(state => state.user)
  const totalTags = useSelector(state => state.tags)
  const name = user.firstName + ' ' + user.lastName
  const email = user.email
  const [isAuth, setAuth] = useState(true)
  const [tags, setTags] = useState([]);
  const [allTags, setAllTags] = useState([])
  const [loadingStatus, setLoadingStatus] = useState(false);
  const [message, setMessage] = useState('')

  useEffect(() => {
        if(allTags.length === 0 && tags.length === 0)
        {
            const initAllTags = []
            totalTags.forEach(tag => {
                initAllTags.push(tag._id)
            });
            const newAllTags = initAllTags.filter(tag => user.tags.indexOf(tag) === -1)
            setAllTags(newAllTags)
            setTags(user.tags)
        }
    }, [allTags])

    const submitTags = async tags => {
        const idToken = (new Cookies()).get('idToken')
        const res = await fetch('/add_tags', {
            method: 'PATCH',
            headers: {
                'Authorization': 'Bearer '+idToken,
                'Content-type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                tags
            })
        })
        const data = await res.json()
        // Handle error
        if(!data.error)
        {
            dispatch(patchTags(tags))
            setMessage('Success')
        }
        else if(data.error !== 'Please authenticate')
        {
            setMessage('Failure')
        }
        else
            setAuth(false)
        setLoadingStatus(false)
    }

    const handleSubmit = () => {
        setLoadingStatus(true)
        submitTags(tags)
    }

  const removeTags = (indexToRemove) => {
    const tag = tags[indexToRemove]
    setTags([...tags.filter((_, index) => index !== indexToRemove)]);
    const newAllTags = allTags
    newAllTags.push(tag)
    setAllTags(newAllTags)
  };

  const addTags = (tag) => {
      const indexToRemove = allTags.indexOf(tag)
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setAllTags([...allTags.filter((_, index) => index !== indexToRemove)])
  };

  return (
    isAuth===false?<Redirect path="/"/>:
    <Container>
      <Paper elevation={15} sx={{ minHeight: 750 }}>
        <Container>
          <TextField
            label="Name"
            defaultValue={`${name}`}
            InputProps={{
              readOnly: true,
            }}
            fullWidth={true}
            sx={{ marginBottom: 5, marginTop: 5 }}
          />
          <TextField
            label="Email"
            defaultValue={`${email}`}
            InputProps={{
              readOnly: true,
            }}
            fullWidth={true}
          />

          <Grid container spacing={2}>
            <Grid item md={6} sm={12}>
              <Typography variant="h5" sx={{ marginTop: 2, marginLeft: 2 }}>
                Subscribed tags
              </Typography>
              <Card sx={{ minHeight: 400, marginTop: 2, minWidth: 300 }}>
                <ul id="tags">
                  {tags.map((tag, index) => (
                    <li key={index} className="tag">
                      <span className="tag-title">{tag}</span>
                      <span
                        className="tag-close-icon"
                        onClick={() => removeTags(index)}
                      >
                        x
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            </Grid>

            <Grid item md={6} sm={12}>
              <Typography variant="h5" sx={{ marginTop: 2, marginLeft: 2 }}>
                Other tags
              </Typography>
              <Card sx={{ minHeight: 400, marginTop: 2 }}>
                <ul id="tags">
                  {allTags.map((tag, index) => (
                    <li key={index} className="tag">
                      <span
                        className="tag-title"
                        onClick={(e) => addTags(e.target.innerText)}
                      >
                        {tag}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            </Grid>
            <div>
            <div
            style={{
                color: message === "Success" ? "green" : "red",
                paddingBottom: "5px",
                paddingLeft: "3em"
            }}
            >
            {message === "Success"
            ? "Tags subsribed!"
            : message === "Failure"
            ? "Tags not added. Please retry later!"
            : message}
            </div>
            {
                loadingStatus === false?
                <Button variant="contained" color="success" sx={{ marginLeft: 3 }} onClick={handleSubmit}>
                Subscribe Tags
                </Button>:
                <Loader
                    type="Oval"
                    color="#00BFFF"
                    height={45}
                    width={45}
                    visible={true}
                />
            }
            </div>
          </Grid>
        </Container>
      </Paper>
    </Container>
  );
};

export default Profile;
