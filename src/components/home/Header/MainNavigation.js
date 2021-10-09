import React from "react";
import { Route, BrowserRouter as Router, Switch, Redirect } from "react-router-dom";


// import Home from '../../../pages/Home';
import Layout from "./Layout";
import Profile from "./Profile";
import Create from "./Create";
import LandingPage from "./LandingPage";
import SingleQuestion from "../Feeds/SingleQuestion";

export default function MainNavigation() {
  return (
    <Router basename="curiosite">
      <Switch>
        <Layout>
          <Route path="/" exact>
            <LandingPage page={"home"} />
          </Route>

          <Route path="/tag_questions/:tag">
            <LandingPage page={"tag"} />
          </Route>

          <Route path="/profile">
            <Profile/>
          </Route>

          <Route path="/create_post">
            <Create/>
          </Route>
          <Route component={SingleQuestion} path="/question/:id" exact />
          <Route path="*">
            <Redirect to="/"/>
          </Route>
        </Layout>
      </Switch>
    </Router>
  );
}
