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
import Trending from './components/trending.jsx';

export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      userPromise: axios.get('/api/user'),

      trendingPromise: axios.get('/api/trending'),
      
      userData: {
        firstName: '',
        lastName: '',
        username: '',
        user_id: '',
        likes: [],
        photos: []
      },

      trending: [],

      detailedPicURL: 'NONE',
      zoom: '',
      position: '',

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
    this.handleState = this.handleState.bind(this);

    const getuserData = function() {
      return axios.get('/api/user')
    }

    const getTrendingData = function(){
      return axios.get('/api/trending')
    }
    
    axios.all([getuserData(), getTrendingData()])
      .then(axios.spread( (user, trending) => {
        this.setState({
          userData: user.data,
          trending: trending.data
        })
      }))
      .catch(function(error){
        console.log(error);
      })
  }


  handleState(detailedPicURL, data, trending){
    if (data === null && trending === null){
      this.setState({
        detailedPicURL: detailedPicURL
       });
    } else if (detailedPicURL === null && trending === null){
      this.setState({userData: data})
    } else if (detailedPicURL === null && data === null){
      this.setState({trending: trending})
    }
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
    const trendingPromise = this.state.trendingPromise;

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

          <Route path='/trending'
            render={(props) => 
              <Trending
                trending = {this.state.trending}
                detailedPicURL = {this.state.detailedPicURL}
                showLogin={this.state.showLogin}
                showSignup={this.state.showSignup}
                activeModal={this.state.activeModal}
                handleClose={this.navbarHandleClose}
                handleShow={this.navbarHandleShow}
                handleShowSignup={this.navbarHandleShowSignup}
                handleShowLogin={this.navbarHandleShowLogin}
                handleState={this.handleState}
                pathname = {props.location.pathname}
                userData = { userData }
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

