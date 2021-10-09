import { Grid } from '@material-ui/core'
import React from 'react'

import './login.css'





export default function LoginPrompt() {
        
        return (
                <Grid container xs={12} sm={12} className="mainBody">
                        <div className="container">
                                <div className="form-box">
                                        <div className="header-form">
                                                <h4 className="text-primary text-center"><i className="fa fa-user-circle" style={{ fontSize: "110px", color: "white" }}></i></h4>
                                                <div className="image">
                                                </div>
                                        </div>
                                        <div className="body-form">
                                                <form>

                                                        <div className="input-group mb-3">
                                                                <div className="input-group-prepend">
                                                                        <span style={{ fontSize: "70px", color: "#c21808", letterSpacing: "1px" }}> Curiosite </span>
                                                                </div>

                                                                <div id="login-motto">
                                                                        <b>To Ask. To Answer.</b>
                                                                </div>

                                                        </div>

                                                        <div id="warning-motto">
                                                                <b style={{ color: "#c21808" }}>Please use Institute E-mail to Login</b>
                                                        </div>
                                                        <div id="login-button-section">

                                                        </div>
                                                </form>

                                        </div>
                                </div>
                        </div>

                </Grid>

        )
}
