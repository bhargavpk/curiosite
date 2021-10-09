import React, {useState, useEffect} from 'react';
import './Widgets.css';
import { Link } from "react-router-dom";
import Cookies from 'universal-cookie'
import { Divider } from '@material-ui/core';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

function Widgets() {

        const [trendingList, modifyTrendingList] = useState([])

        useEffect(() => {
                if(trendingList.length === 0)
                {
                        const idToken = (new Cookies()).get('idToken')
                        const fetchTrendingList = async () => {
                                const res = await fetch('https://xha59eviig.execute-api.ap-south-1.amazonaws.com/prod/trending_questions', {
                                        method: 'GET',
                                        headers: {
                                                'Content-Type': 'applicaion/json',
                                                'Authorization': 'Bearer ' + idToken
                                        }
                                })
                                const data = await res.json()
                                if(!data.error)
                                {
                                        const newTrendingList = trendingList.concat(data.questionList)
                                        modifyTrendingList(newTrendingList)
                                }
                        }
                        fetchTrendingList()
                }
        })

        const newsArticle = (question,subtitle) => {
            const newTo = {
                pathname: `/question/${question._id}`,
                state: {
                  AuthorEmail: question.author.email,
                  content: question.content,
                  tags: question.tags,
                  name: question.author.firstName + ' ' + question.author.lastName
                },
              };
                return  <Link to={newTo}>
                            <div className="widgets__Article">
                                <div className="widgets__Articleleft">
                                    <FiberManualRecordIcon/>
                                </div>
                                <div className="widgets__Articleright">
                                    <h4>{question.content}</h4>
                                    <p>{subtitle}</p>
                                </div>
                            </div>
                        </Link>
        };

return (
        <div className="Widgets">
            <div className="Widgets__header">
            <div style={{color:"#c21808",fontSize:"20px",fontFamily:"inherit",textAlign:"center",textDecoration:"bold"}}>Trending</div>
                <Divider/>
            </div>
            {
                    trendingList.map((question, index) => {
                        const totalReactions = question.bloomIndexSum
                        return newsArticle(question, `${totalReactions} Reaction${totalReactions===1?'':'s'}`)
                    })
            }
        </div>
    )
}

export default Widgets