import React,{useState,useEffect} from 'react';
import { Link } from 'react-router-dom'
import Cookies from 'universal-cookie'
import "./SearchBar.css";

import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: "2px 4px",
    display: "flex",
    alignItems: "center",
    maxWidth: 4000
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1
  },
  iconButton: {
    padding: 10
  },

}));


export default function SearchBar(props) {
    const classes = useStyles();

  const [question, setQuestion] = useState({})


    const fetchQuestion = async () => {
        const cookies = new Cookies()
        const idToken = cookies.get('idToken')
        const res = await fetch('https://xha59eviig.execute-api.ap-south-1.amazonaws.com/prod/unanswered_question', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer '+idToken,
                'Content-type': 'application/json',
                'Accept': 'application/json'
            }
        })
        const data = await res.json()
        // Handle error
        if(!data.error && data.question)
            setQuestion(data.question)
    }

    useEffect(() => {
        if(JSON.stringify(question) === JSON.stringify({}))
            fetchQuestion()
    })

  return (
    <Grid container xs={12} justify="space-around"
    style={{ minHeight: '20vh', maxWidth: '100%' }} >
    
      <Grid item md={3} alignItems="center" >
        {
            JSON.stringify(question) !== JSON.stringify({})?
            <Link to={{
                pathname: `/question/${question._id}`,
                state: {
                    AuthorEmail: question.author.email,
                    content: question.content,
                    tags: question.tags,
                    name: question.author.firstName + ' ' + question.author.lastName
                }
            }}>
                <Button
                variant="contained"
                size="large"
                color="default"
                className={classes.margin}
                
                >
                    Random question
                </Button>
            </Link>:
            <div />
        }
      </Grid>
    </Grid>
  );
}

