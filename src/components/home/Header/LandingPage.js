import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import './LandingPage.css';
import Sidebar from '../SideBars/Sidebar.js';
import Grid from "@material-ui/core/Grid";
import SearchBar from '../SearchBar/SearchBar.js';
import Feeds from '../Feeds/Feeds';

export default function LandingPage(props){

    const { tag } = useParams()
    const [tagState, setTag] = useState(undefined)
    useEffect(() => { setTag(tag) }, [tagState])
    
    return(
        <div className="main" >
             <Grid container >
                                <Grid item xs={0} sm={2} >
                                        <Sidebar />
                                </Grid>

                                <Grid item xs={12} sm={10}>
                                        <div className="main_body" >
                                                <SearchBar style={{minheight:"15vh"}}
                                                />       
                                        </div>
                                        <Feeds
                                        page={props.page}
                                        tag={tag}
                                        key={props.page+tag}
                                        />
                                    
                                </Grid>

                        </Grid>
        </div>
    )
};