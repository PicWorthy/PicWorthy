import React, {Component} from 'react';
import { Grid, Row, Col, Carousel } from 'react-bootstrap';
import axios from 'axios';
import PicRow from './picrow.jsx';
import Details from './details.jsx';

const rowStyle = {
    marginLeft: `0px`,
    marginRight: `0px`
  }
  
  
  
  
  export default class Trending extends Component {
    constructor(props){
      super(props);

      this.showHideDetails = this.showHideDetails.bind(this);
      this.rotatePics = this.rotatePics.bind(this);
      this.onStarClick = this.onStarClick.bind(this);
      this.handleHeartClick = this.handleHeartClick.bind(this);
  }
  
  showHideDetails(e, imageURL) {
      if (e.preventDefault !== undefined) {
        e.preventDefault();
      }
    
      if (this.props.detailedPicURL === imageURL) {
        const detailedPicURL = 'NONE';
    
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        })
    
        setTimeout(() => this.props.handleState(detailedPicURL, null, null), 322);
    
      } else {
        /* this reg ex is a
         * last minute hack to eliminate bug.
         * The user and likes page were pretty last minute so they could both be made to itegrate
         * with this component cleaner.
         *
         */
    
        if (/^\/trending/.test(this.props.pathname)) {
          var detailedPicURL = imageURL;
          this.props.handleState(
            detailedPicURL, null, null
          );
        }
    
      }
  }

  handleHeartClick (e, { category, location, imageURL, description, latLng, rating}, beDeleted) {
    rating = rating ? rating : 0;
  
    if(beDeleted){
      axios.post('/api/unfavorite', {
        category,
        location,
        imageURL,
        description,
        rating,
        user_id: this.props.userData._id,
        username: this.props.userData.username,
        latLng: {
          lat: latLng.lat,
          lng: latLng.lng
        }
      })
        .then(({data}) => this.handleState(null, data, null))
    } else {
      axios.post('/api/favorites', {
        category,
        location,
        imageURL,
        description,
        rating,
        user_id: this.props.userData._id,
        username: this.props.userData.username,
        latLng: {
          lat: latLng.lat,
          lng: latLng.lng
        }
      })
        .then(({data}) => this.handleState(null, data, null))
    }
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

    let pic = getPic(this.props.detailedPicURL, this.props.userData.photos);
    pic.rating = nextValue;
    let {category, location, imageURL, description, latLng, rating} = pic;
    
    axios.post('/api/starred', {
      category,
      location,
      imageURL,
      description,
      rating,
      user_id: this.props.userData._id,
      username: this.props.userData.username,
      latLng: {
        lat: latLng.lat,
        lng: latLng.lng
      }
    })
      .then(({data}) => this.handleState(null, data, null));
  }

   
  rotatePics (e, direction) {
  
      e.preventDefault();
    
      let pics = [...this.props.pics];
    
      if (direction === 'LEFT') {
        pics.unshift(pics.pop());
    
      } else if (direction === 'RIGHT') {
        pics.push(pics.shift());
      }
    
      handleState(null, null, trending);
  }
  

  render(){

        const pics = [];
        
        this.props.trending.forEach( object => object.photos.forEach( photo => pics.push(photo)));
        


        return (
            <div style={{minHeight: `calc(100vh - 150px)`}}>
              <div>
      
              <h1 style={{fontFamily: `billabong`, textAlign: `center`, color: `#32bfff`}}>What's Trending?</h1>
              <br />
              </div>
      
              { this.props.trending.length === 0 ? <div /> :
                <PicRow
                  showHideDetails={ this.showHideDetails }
                  rowType="locations"
                  pics={ pics }
                  rotatePics={ () => this.rotatePics }
                  detailedPicURL={ this.props.detailedPicURL }
                />
              }
      
              <br/>
      
              <Details
                detailedPicURL={ this.props.detailedPicURL }
                pics={ pics }
                showHideDetails={ (e, imageURL) => this.showHideDetails(e, imageURL) }
                handleHeartClick={ this.handleHeartClick }
                userFavorites={ this.props.userData.likes }
                onStarClick={this.onStarClick}
              />
            </div>
          )
    }
}

