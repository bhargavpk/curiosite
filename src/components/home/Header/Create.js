import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Redirect } from 'react-router-dom'
import Loader from "react-loader-spinner";
import Cookies from "universal-cookie";
import Card from "@mui/material/Card";

import {
  Typography,
  Paper,
  Grid,
  Button,
  CssBaseline,
  TextField,
} from "@material-ui/core";

import "./Create.css";
import { useHistory } from "react-router";
import { Container } from "@mui/material";

const Create = () => {
  const history = useHistory();

  const newUser = useSelector((state) => state.user);
  const totalTags = useSelector(state => {
        const newTotalTags = []
        state.tags.forEach(tag => {
            newTotalTags.push(tag._id)
        });
        return newTotalTags
  })
  const [isAuth, setAuth] = useState(true)
  const [user, setUser] = useState({});
  const [query, setquery] = useState("");
  const [result, setResult] = useState({ Finalquery: "", Finaltags: [] });
  const [allTags, setAllTags] = useState([])
  const [tags, setTags] = useState([]);
  const [loadingQuestion, setLoader] = useState(false);
  const [status, setStatus] = useState("");

  const removeAllTags = () => {
    setTags([]);
    setAllTags(totalTags)
  };

  const makeRequest = async () => {
    // Make request to backend
    const cookies = new Cookies();
    const token = cookies.get("idToken");
    const res = await fetch("https://xha59eviig.execute-api.ap-south-1.amazonaws.com/prod/question", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        question: query,
        email: user.email,
        tags,
      }),
    });
    const data = await res.json();
    if(data.error === 'Please authenticate')
        setAuth(false)
    else
    {
        setTimeout(() => {
            setResult((preState) => ({
              ...preState,
              Finalquery: query,
              Finaltags: tags,
            }));
            removeAllTags();
            setquery("");
          }, 0);
            setTimeout(() => {
              if (data.error === undefined)
              {
                  setLoader(false);
                  setStatus("Success");
              }
              else
                  setStatus("Failure");
            }, 0);
    }
  };

  useEffect(() => {
      if(allTags.length === 0 && tags.length === 0)
      {
        const newAllTags = [...totalTags]
        setAllTags(newAllTags)
      }
  }, [allTags])

  useEffect(() => {
    if (user !== {}) {
      setUser(newUser);
    }
    if (status !== "") {
      setTimeout(() => {
        setStatus("");
      }, 2500);
    }
  }, [user, result, history]);

  const handleSubmit = (e) => {
    if (query === "") return;
    e.preventDefault();
    setLoader(true);
    makeRequest();
  };

  const handleQuery = (e) => {
    setquery(e.target.value);
  };

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
          <CssBaseline />

          <Typography variant="h4" align="center" component="h1" gutterBottom>
            Have a question?
          </Typography>
          <Typography variant="h5" align="center" component="h2" gutterBottom>
            Raise your query
          </Typography>
          <Typography paragraph align="center">
            Add tags to your question for better reach
          </Typography>

          <Paper style={{ padding: 16 }}>
            <form>
              <Grid container alignItems="flex-start" spacing={2}>
                <Grid item sm={12} xs={12}>
                  <TextField
                    required
                    error={query === ""}
                    helperText={query === "" ? "Cannot be left empty!" : " "}
                    label="Note"
                    type="text"
                    value={query}
                    onChange={handleQuery}
                    fullWidth
                    autoFocus
                    multiline
                    placeholder="Ask Your Question Here"
                  />
                </Grid>

                <Grid item xs={12} style={{ marginTop: 36 }}>
                  <Grid container spacing={2}>
                    <Grid item md={6} sm={12}>
                      <Typography
                        variant="h5"
                        sx={{ marginTop: 2, marginLeft: 2 }}
                      >
                        Question tags
                      </Typography>
                      <Card
                        sx={{ minHeight: 400, marginTop: 2, minWidth: 300 }}
                      >
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
                      <Typography
                        variant="h5"
                        sx={{ marginTop: 2, marginLeft: 2 }}
                      >
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
                  </Grid>
                </Grid>

                <Grid item style={{ marginTop: 10 }}>
                  <div
                    style={{
                      color: status == "Success" ? "green" : "red",
                      paddingBottom: "5px",
                    }}
                  >
                    {status === "Success"
                      ? "Question posted successfully!"
                      : status === "Failure"
                      ? "Question not posted. Please retry later!"
                      : status}
                  </div>
                  {loadingQuestion === false ? (
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      fullWidth
                      onClick={handleSubmit}
                    >
                      Submit
                    </Button>
                  ) : (
                    <Loader
                      type="Oval"
                      color="#00BFFF"
                      height={45}
                      width={45}
                      visible={true}
                    />
                  )}
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Container>
      </Paper>
    </Container>
  );
};

export default Create;
