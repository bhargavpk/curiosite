import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider } from "react-redux";

import HomeMain from "./pages/HomeMain";
import "./App.css";

import { store } from "./store";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Route component={HomeMain} path="/"/>
      </Router>
    </Provider>
  );
}

export default App;
