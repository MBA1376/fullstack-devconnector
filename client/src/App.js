import React, { Component } from 'react';
import {BrowserRouter as Router , Route , Switch} from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import {setCurrentUser, logoutUser} from './actions/authActions';
import { Provider } from 'react-redux';
import store from'./store';

import PrivateRoute from './components/common/PrivateRoute';

import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/create-profile/CreateProfile';
import EditProfile from './components/edit-profile/EditProfile';
import AddExperience from './components/add-credentials/AddExperience';
import AddEducation from './components/add-credentials/AddEducation';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import NotFound from './components/not-found/NotFound';
import Posts from './components/posts/Posts';

import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Footer from './components/layout/Footer';
import './App.css';
import { clearCurrentProfile } from './actions/profileActions';



//check for token
if(localStorage.jwtToken) {
  //set authToken header auth
  setAuthToken(localStorage.jwtToken);
  //decode the token and get the info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  //set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  //check for expired token
  const currentTime = Date.now()/1000;
  if(decoded.exp < currentTime) {
    //logout user
    store.dispatch(logoutUser());
    
    //TODO: clear current profile
    store.dispatch(clearCurrentProfile());
    
    //redirect to login
    window.location.href = '/login';
  }

}

/**put our Private routes in Switch to dont have problem */
class App extends Component {
  render() {
    return (
      <Provider store={store}>
          <Router>
            <div className="App">
              <Navbar />
              <Route exact path="/" component = {Landing}/>
              <div className="container">
                <Route exact path="/register" component={Register}/>
                <Route exact path="/login" component={Login}/>
                <Route exact path="/profile/:handle" component={Profile}/>
                
                <Switch>
                  <PrivateRoute exact path="/dashboard" component={Dashboard}/>
                </Switch>
                <Switch>
                  <PrivateRoute exact path="/create-profile" component={CreateProfile} />
                </Switch>
                <Switch>
                  <PrivateRoute exact path="/edit-profile" component={EditProfile} />
                </Switch>
                <Switch>
                  <PrivateRoute exact path="/add-experience" component={AddExperience} />
                </Switch>
                <Switch>
                  <PrivateRoute exact path="/add-education" component={AddEducation} />
                </Switch>
                <Switch>
                  <PrivateRoute exact path="/profiles" component={Profiles} />
                </Switch>
                <Switch>
                  <PrivateRoute exact path="/feed" component={Posts} />
                </Switch>
                <Route exact path="/not-found" component={NotFound}/>
              </div>
              <Footer />
            </div>
          </Router>
      </Provider>
    );
  }
}

export default App;
