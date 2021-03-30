import React from 'react';
import { BrowserRouter as Router,  Route, Redirect } from 'react-router-dom';
//import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

//import LoginForm from './components/LoginForm/LoginForm';
import NavBar from './components/NavBar/NavBar';
import InferenceUI from './components/InferenceUI/InferenceUI';
//import LabelingUI from './components/LabelingUI/LabelingUI';

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.css';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.setLogin = this.setLogin.bind(this);
    this.state = {
      // [WARNING] I've changed this just to ease Paula's introductory assignment.
      // DO NOT go live without changing this back.
      isLoggedIn: true
    }
  }

  PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
      this.state.isLoggedIn === true
        ? <Component {...props} />
        : <Redirect to='/login' />
    )} />
  )

  setLogin() {
    this.setState({
      isLoggedIn: true
    });
  }

  resetLogin() {
    this.setState({
      isLoggedIn: false
    });
  }

  render() {
    return(
      <Router basename="">
        <div className="App">
          <NavBar logout={this.resetLogin}/>
          <InferenceUI/>
          {/*
          <Switch>
            <Route exact path="/" component={()=>{return(<Redirect to="/inferencia"/>)}}/>
            <Route 
              path="/login"
              render={()=>{return(<LoginForm action={this.setLogin} />)}}
            />
            <Route exact path="/logout" component={()=>{this.resetLogin(); return(<Redirect to="/"/>)}}/>
            <this.PrivateRoute path="/inferencia" component={InferenceUI} />
            <this.PrivateRoute path="/etiquetado" component={LabelingUI} />
          </Switch>
          */}
        </div>
      </Router>
    );
  }
}
export default App;
