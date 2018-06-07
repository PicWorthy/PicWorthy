import React, { Component } from 'react';
import { Grid, Row } from 'react-bootstrap';
import axios from 'axios';
import _ from 'lodash';

import WorthyMap from './worthymap.jsx';
import PicRow from './picrow.jsx';
import Details from './details.jsx';
import fetchClosestPics from '../helpers/fetchClosestPics.jsx';
import getUserLocation from '../helpers/getUserLocation.jsx';
import EditPicDetails from './editPicDetails.jsx';

/*
 * The locations, userpage, and likes page all get rendered with the locations component
 *
 */



 /*
  * showHideDetails
  * toggles the details on and off.  It uses a set timeout so that the page smoothly
  * moves up before eliminating the div with the details.  In the likes component
  * is a commented out function that makes it smoothly move down too that
  * we couldn't decide on which we liked better.
  *
  */

const rowStyle = {
  marginLeft: `0px`,
  marginRight: `0px`
}

const showHideDetails = function(e, imageURL) {
  if (e.preventDefault !== undefined) {
    e.preventDefault();
  }

  if (this.state.detailedPicURL === imageURL) {
    const detailedPicURL = 'NONE';

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })

    setTimeout(() => this.setState({detailedPicURL}), 322);

  } else {
    /* this reg ex is a
     * last minute hack to eliminate bug.
     * The user and likes page were pretty last minute so they could both be made to itegrate
     * with this component cleaner.
     *
     */

    if (/^\/locations/.test(this.props.pathname)) {
      const detailedPicURL = imageURL;
      const coordinates = this.state.pics.filter(pic => pic.imageURL === imageURL)[0].loc.coordinates;
      const position = {
        lat: coordinates[1],
        lng: coordinates[0]
      }

      this.setState({
        detailedPicURL,
        position,
        zoom: 10
      });

    } else{
      const detailedPicURL = imageURL;
      this.setState({
        detailedPicURL,
      });
    }

  }
}

/*
 * implements the feature to toggle row component left and right
 */

const rotatePicsLocation = function(e, direction) {
  e.preventDefault();

  let pics = [...this.state.pics];

  if (direction === 'LEFT') {
    pics.unshift(pics.pop());

  } else if (direction === 'RIGHT') {
    pics.push(pics.shift());
  }

  this.setState({pics});
}

/*
 * these are seperate functions to get ready to present fast.  Would have refactored if time.
 */

const rotatePicsUserpage = function(e, direction) {

  e.preventDefault();

  let userData = Object.assign({}, this.state.userData);
  let pics = [...userData.photos];

  if (direction === 'LEFT') {
    pics.unshift(pics.pop());

  } else if (direction === 'RIGHT') {
    pics.push(pics.shift());
  }

  userData = Object.assign({}, userData, {photos: pics});
  this.setState({userData});
}

const rotatePicsLikes = function(e, direction) {
  e.preventDefault();

  let userData = Object.assign({}, this.state.userData);
  let pics = [...userData.likes];

  if (direction === 'LEFT') {
    pics.unshift(pics.pop());

  } else if (direction === 'RIGHT') {
    pics.push(pics.shift());
  }

  userData = Object.assign({}, userData, {likes: pics});
  this.setState({userData});
}

export default class Locations extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pics: [],
      displayAmount: 0,
      markers: [],
      zoom: 4,
      position: {lat: 37.09, lng: -95.71},
      detailedPicURL: 'NONE',
      userData: props.userData,
      friendData: {
        firstName: '',
        lastName: '',
        username: '',
        user_id: '',
        likes: [],
        photos: []
      }
    };
    /*
     * this is a hacky way to get the userid to work.  We had major issues passing data
     * from app into locations.  When state updated.
     * This hacky solution is to pass a promise too so if
     * the userdata doesn't get passed by the time the component renders the user data
     * can be extracted out of the promise that got passed as a prop.
     */

    if (props.userData.user_id === '') {
      props.userPromise.then((result) => this.setState({userData: result.data}));
    }

    this.updatePictures = _.throttle(this.updatePictures.bind(this), 1000);
    this.updateDisplayAmount = this.updateDisplayAmount.bind(this);
    this.getUserLocation = getUserLocation.bind(this);
    this.showHideDetails = showHideDetails.bind(this);
    this.onStarClick = this.onStarClick.bind(this);
    this.handleHeartClick = this.handleHeartClick.bind(this);
    this.rotatePics = this.rotatePics.bind(this);
    this.rotatePicsLocation = rotatePicsLocation.bind(this);
    this.rotatePicsUserpage = rotatePicsUserpage.bind(this);
    this.rotatePicsLikes = rotatePicsLikes.bind(this);
  }

  /*
   * refresh user just in case they just uploaded a pic.
   * would have the pic refresh in App and get passed down but react router gave issues.
   *
   * if window changes size update how many pics are displayed.
   */

  componentDidMount() {
    this.refreshUser();
    this.getUserLocation();
    this.updateDisplayAmount();

    //Renders friend data for friendpageRender function.
    const startIndex = this.props.pathname.indexOf('/', 1);
    const endIndex = this.props.pathname.indexOf('/', startIndex + 1);
    const username = this.props.pathname.slice(startIndex + 1, endIndex);
    if (/^\/friendpage/.test(this.props.pathname)) {
      const startIndex = this.props.pathname.indexOf('/', 1);
      const endIndex = this.props.pathname.indexOf('/', startIndex + 1);
      const username = this.props.pathname.slice(startIndex + 1, endIndex);
      axios.get('/api/friend', {
        params: {
          username: username
        }
      })
      .then(result => {
        console.log(result.data);
        this.setState({
          friendData: result.data
        });
      })
      .catch(err => console.log(err));
    }

    window.addEventListener('resize', this.updateDisplayAmount);
  }

  updatePictures(lat, lng) {
    fetchClosestPics(lat, lng)
      .then(({data}) => {
        const clickHandler = this.showHideDetails;

        const markers = data.map((pic) => ({
            lat: pic.loc.coordinates[1],
            lng: pic.loc.coordinates[0],
            clickHandler: (e) => clickHandler(e, pic.imageURL)
          })
        );

        this.setState({
          pics: data,
          markers: markers
        })
      })
  }

  refreshUser() {
    axios.get('/api/user')
      .then((result) => this.setState({userData: result.data}));
  }


  onStarClick (nextValue, prevValue, name, e) {
    const getPic = (url, pics) => {
      for (const pic of pics) {
        if (pic.imageURL === url) {
          return pic;
        }
      }
      return 'NOT_FOUND';
    }

    let pic = getPic(this.state.detailedPicURL, this.state.userData.photos);
    pic.rating = nextValue;
    let {category, location, imageURL, description, latLng, rating, comments} = pic;

    axios.post('/api/starred', {
      category,
      location,
      imageURL,
      description,
      rating,
      user_id: this.state.userData._id,
      username: this.state.userData.username,
      latLng: {
        lat: latLng.lat,
        lng: latLng.lng
      },
      comments
    })
      .then(({data}) => this.setState({userData: data}));
  }



  handleHeartClick(e, { category, location, imageURL, description, latLng, rating, comments}, beDeleted) {
    rating = rating ? rating : 0;

    if(beDeleted){
      axios.post('/api/unfavorite', {
        category,
        location,
        imageURL,
        description,
        rating,
        user_id: this.state.userData._id,
        username: this.state.userData.username,
        latLng: {
          lat: latLng.lat,
          lng: latLng.lng
        },
        comments
      })
        .then(({data}) => this.setState({userData: data}))
    } else {
      axios.post('/api/favorites', {
        category,
        location,
        imageURL,
        description,
        rating,
        user_id: this.state.userData._id,
        username: this.state.userData.username,
        latLng: {
          lat: latLng.lat,
          lng: latLng.lng
        },
        comments
      })
        .then(({data}) => this.setState({userData: data}))
    }
  }

  rotatePics(e, direction) {

    if (/^\/locations/.test(this.props.pathname)) {
      this.rotatePicsLocation(e, direction);

    } else if (/^\/likes/.test(this.props.pathname)) {
      this.rotatePicsLikes(e, direction);

    } else if (/^\/userpage/.test(this.props.pathname)) {
      return this.rotatePicsUserpage(e, direction);
    }
  }

  updateDisplayAmount() {
    const displayAmount = Math.floor((window.innerWidth - 90)/250);
    this.setState({displayAmount});
  }

  friendpageRender() {

    const pics = this.state.friendData.photos.slice(0, this.state.displayAmount);
    return (
      <div style={{minHeight: `calc(100vh - 150px)`}}>

        <h1 style={{fontFamily: `billabong`, textAlign: `center`, color: `#32bfff`}}>Hello {this.state.friendData.firstName}</h1>
        <h2 style={{fontFamily: `billabong`, textAlign: `center`, color: `#919295`}}>User's Places</h2>

        { pics.length === 0 ? <div /> :
          <PicRow
            showHideDetails={ this.showHideDetails }
            rowType="locations"
            pics={ pics }
            rotatePics={ this.rotatePics }
            detailedPicURL={ this.state.detailedPicURL }
          />
        }

        <br />

        <Details
          detailedPicURL={ this.state.detailedPicURL }
          pics={ this.state.friendData.photos }
          showHideDetails={ this.showHideDetails }
          handleStarClick={ this.handleStarClick }
          userFavorites={ this.state.friendData.likes }
          refreshUser={ this.refreshUser.bind(this) }
        />

      </div>
    )
}

  userpageRender() {

    const pics = this.state.userData.photos.slice(0, this.state.displayAmount);

    return (
      <div style={{minHeight: `calc(100vh - 150px)`}}>

        <h1 style={{fontFamily: `billabong`, textAlign: `center`, color: `#32bfff`}}>Hello {this.props.userData.firstName}</h1>
        <h2 style={{fontFamily: `billabong`, textAlign: `center`, color: `#919295`}}>Your Places</h2>

        { pics.length === 0 ? <div /> :
          <PicRow
            showHideDetails={ this.showHideDetails }
            rowType="locations"
            pics={ pics }
            rotatePics={ this.rotatePics }
            detailedPicURL={ this.state.detailedPicURL }
          />
        }

        <br />

        <EditPicDetails
          detailedPicURL={ this.state.detailedPicURL }
          pics={ this.state.userData.photos  }
          userFavorites = {this.state.userData.likes}
          showHideDetails={ this.showHideDetails }
          handleHeartClick={ this.handleHeartClick }
          refreshUser={ this.refreshUser.bind(this) }
          onStarClick={this.onStarClick}
        />

      </div>
    )
  }

  likesRender() {
    const pics = this.state.userData.likes.slice(0, this.state.displayAmount);

    return (
      <div style={{minHeight: `calc(100vh - 150px)`}}>
        <div>

        <h1 style={{fontFamily: `billabong`, textAlign: `center`, color: `#32bfff`}}>{this.props.userData.firstName}'s Favorites</h1>
        <br />
        </div>

        { pics.length === 0 ? <div /> :
          <PicRow
            showHideDetails={ this.showHideDetails }
            rowType="locations"
            pics={ pics }
            rotatePics={ this.rotatePics }
            detailedPicURL={ this.state.detailedPicURL }
          />
        }

        <br/>

        <Details
          detailedPicURL={ this.state.detailedPicURL }
          pics={ this.state.userData.likes }
          showHideDetails={ this.showHideDetails }
          handleHeartClick={ this.handleHeartClick }
          userFavorites={ this.state.userData.likes }
          refreshUser={this.refreshUser.bind(this)}
          onStarClick={this.onStarClick}
        />
      </div>
    )
  }

  //This is renders the view that includes the map and Around You section.
  locationsRender() {
    const pics = this.state.userData.photos.slice(0, this.state.displayAmount);
    return (
      <Grid style={{margin: `0`, width: `100vw`, paddingLeft: `0px`, paddingRight: `0px`, minHeight: `calc(100vh - 150px)`}}>

        <Row style={{margin: `20px`, height:`calc((100vh - 150px)/2)`, minHeight: `400px`}}>

        <WorthyMap
          markers={ this.state.markers }
          defaultZoom={ this.state.zoom }
          defaultCenter={ this.state.position }
          onCenterChanged={ this.updatePictures }
        />

        </Row>

        <div style={{textAlign: `center`, fontFamily: `billabong`, fontSize: `275%`, color: `#32bfff`}}>
          Around You
        </div>

        <Row style={rowStyle}>
          { pics.length === 0 ? <div /> :
            <PicRow
              showHideDetails={ this.showHideDetails }
              rowType="locations"
              pics={ pics }
              rotatePics={ this.rotatePics }
              detailedPicURL={ this.state.detailedPicURL }
              refreshUser={this.refreshUser.bind(this)}
            />
          }
        </Row>

        <Row style={rowStyle}>
          <Details
            detailedPicURL={ this.state.detailedPicURL }
            pics={ this.state.userData.photos }
            showHideDetails={ this.showHideDetails }
            handleHeartClick={ this.handleHeartClick }
            userFavorites={ this.state.userData.likes }
            onStarClick={this.onStarClick}
            username={this.state.userData.username}
            refreshUser={this.refreshUser.bind(this)}
          />
        </Row>
      </Grid>
    );
  }


  render() {

    if (/^\/friendpage/.test(this.props.pathname)) {
      return this.friendpageRender();

    } else if (/^\/userpage/.test(this.props.pathname)) {
      return this.userpageRender();

    } else if (/^\/locations/.test(this.props.pathname)) {
      return this.locationsRender();

    }  else if (/^\/likes/.test(this.props.pathname)) {
      return this.likesRender();

    } else {
      return <div>PAGE NOT FOUND</div>

    }

  }
}




