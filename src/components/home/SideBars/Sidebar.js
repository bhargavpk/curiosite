import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { setStaticTags } from '../../../actions/tagAction'
import Cookies from 'universal-cookie'
import"./Sidebar.css";
import { Link } from "react-router-dom";
import { Divider } from '@material-ui/core';
import Widgets from '../Widgets/Widgets';
import Hidden from '@material-ui/core/Hidden';

function Sidebar() {

        const [tagList, modifyTagList] = useState([])
        const stateTags = useSelector(state => state.tags)
        const dispatch = useDispatch()
        //Add loading state

        const loadTags = async () => {
            if(tagList.length === 0)
            {
                if(stateTags && stateTags.length !== 0)
                    modifyTagList([...stateTags])
                else
                {
                    const fetchTags = async () => {
                        const idToken = (new Cookies()).get('idToken')
                        const res = await fetch('/all_tags', {
                                method: 'GET',
                                headers: {
                                        'Content-Type': 'application/json',
                                        'Authorization': 'Bearer ' + idToken
                                }
                        })
                        const data = await res.json()
                        if(data.tagList)
                        {
                            const newTagList = data.tagList
                            dispatch(setStaticTags(newTagList))
                            modifyTagList(newTagList)
                        }
                    }
                    fetchTags()
                }
            }
        }

        useEffect(() => {
                loadTags()
        })

        const recentItem = (topic) => (
                <Link to={{
                    pathname: `/tag_questions/${topic}`
                }}>
                    <div className="sidebar__recentitem">
                        <span className="sidebar__hash">#</span>
                        <p>{topic}</p>
                    </div>
                </Link>
        )
        return (
                <Hidden xsDown>
                <div className="Sidebar">
                
                <div className="sidebar__button" >
                        <Widgets/>
                </div>
                
                
                
                <div className="sidebar__button">
                        <div style={{color:"#c21808",fontSize:"20px",fontFamily:"inherit",textAlign:"center",textDecoration:"bold"}}>Tags</div>
                        <Divider/>
                        {
                                tagList.map(tag => (
                                        recentItem(tag._id)
                                ))
                        }
                        
                </div>
                
                </div>
                </Hidden>
        )
}

export default Sidebar