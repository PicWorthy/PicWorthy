import React, { Component } from 'react';
import NavbarComp from './components/navbar.jsx';
import { Navbar } from 'react-bootstrap';
import { Route, Switch } from 'react-router-dom';
import axios from 'axios';
import Login from './components/login.jsx';
import Signup from './components/signup.jsx';
import Landing from './components/landing.jsx'
import Locations from './components/locations.jsx';
import Upload from './components/upload.jsx';
import Footer from './components/footer.jsx';

export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      userPromise: axios.get('/api/user'),

      userData: {
        firstName: '',
        lastName: '',
        username: '',
        user_id: '',
        likes: [],
        photos: []
      },

      showLogin: false,
      showSignup: false,
      activeModal: '',
      mapCenter: {
        lat: 41.9,
        lng: -87.624
      },

      mapZoom: 5,
      detailProps: undefined,
      lastCardClicked: undefined
    }

    this.navbarHandleClose = this.navbarHandleClose.bind(this);
    this.navbarHandleShow = this.navbarHandleShow.bind(this);
    this.navbarHandleShowSignup = this.navbarHandleShowSignup.bind(this);
    this.navbarHandleShowLogin = this.navbarHandleShowLogin.bind(this);

    axios.get('/api/user')
      .then((result) =>
        this.setState({userData: result.data}));
  }

  navbarHandleClose() {
    this.setState({
      showLogin: false,
      showSignup: false
    });
  }

  navbarHandleShow(e) {
    this.setState({ [e.target.name]: true });
  }

  navbarHandleShowSignup() {
    this.setState({
      showSignup : true,
      showLogin: false
    });
  }

  navbarHandleShowLogin() {
    this.setState({
      showSignup : false,
      showLogin: true
    });
  }

  render() {
    const userPromise = this.state.userPromise;
    const userData = this.state.userData;

    return (

      <div style={{backgroundColor: "#fdfdfd"}}>

        <NavbarComp
          userData={userData}
          showLogin={this.state.showLogin}
          showSignup={this.state.showSignup}
          activeModal={this.state.activeModal}
          handleClose={this.navbarHandleClose}
          handleShow={this.navbarHandleShow}
          handleShowSignup={this.navbarHandleShowSignup}
          handleShowLogin={this.navbarHandleShowLogin}
        />

        <Switch>
          <Route
            exact path='/'
            component={ Landing }
          />

          <Route
            path='/upload'
            render={(props) =>
              <Upload
                userData={ userData }
                userPromise={ userPromise }
              />
            }
          />

          <Route
            path='/'
            render={(props) => {
              return (
                <Locations
                  userPromise={ userPromise }
                  userData={ userData }
                  pathname={ props.location.pathname }
                />
              )
            }
          }
          />
        </Switch>
        <Footer />
      </div>
    );
  }
};

