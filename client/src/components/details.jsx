import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import FaIconPack, {FaHeartO, FaHeart, FaFacebookSquare, FaTwitter, FaYelp, FaInstagram} from 'react-icons/lib/fa';
import StarRatingComponent from 'react-star-rating-component';

const getPic = (url, pics) => {
  for (const pic of pics) {
    if (pic.imageURL === url) {
      return pic;
    }
  }
  return 'NOT_FOUND';
}

const DisplayStar = ({ pic, handleHeartClick, isStarred }) => {
  if (isStarred) {
    console.log(pic);
    return (
      <FaHeart 
        starred='true'
        style={ iconStyle } 
        size={ 40 }
        onClick={ (e) => handleHeartClick(e, pic, true) }
      />
    )

  } else {
    return (
      <FaHeartO
        starred='false'
        style={ iconStyle } 
        size={ 40 } 
        onClick={ (e) => handleHeartClick(e, pic, false) } 
      /> 
    );
  }
}

const checkFavorites = (userFavorites, img) => userFavorites.includes(img);

const imgSpanStyle= {
  display: `inline-block`,
  float: `right`,
  padding: `15px`,
  backgroundColor: `white`,
  borderRadius: `3px`,
  border: `2px solid black`
}

const imgStyle = {
  border: `1px solid black`,
  height: `100%`,
  width: `100%`,
  objectFit: `contain`
}

const iconStyle ={
  paddingRight: `10px`
}


export default class Details extends Component {

  scrollToBottom() {
    // not sure if I like this scroll down
    // this.scrollEnd.scrollIntoView({behavior: 'smooth'});
  }

  componentDidUpdate(prevProps) {
    if (prevProps.detailedPicURL === 'NONE' && this.props.detailedPicURL !== 'NONE') {
      this.scrollToBottom();
    }
  }

  render() {
    
    const { detailedPicURL, pics, userFavorites, showHideDetails, handleHeartClick, onStarClick} = this.props 


    let pic = getPic(detailedPicURL, pics);

    if (pic === 'NOT_FOUND') {
      return <div />;
    }

    const isStarred = checkFavorites(userFavorites.map((p) => p.imageURL), pic.imageURL)

    const {rating} = pic;

    return (
      <div>
        <br/>

        <Grid style={ {
          background: `linear-gradient(to right, #4cc7ff 0%, #99dfff  100%)`,
          padding: `20px`,
          width: `100vw`
        } }>

          <Row>

            <Col 
              md={ 6 } 
              mdPush={ 6 } 
              style={ {paddingRight: `100px`} }
            >

              <h1 style={ {fontFamily: `billabong`} }>
                {pic.location }
              </h1>

              <h4>
                Submitted by: { pic.username }
              </h4>

              <p>
                { pic.description }
              </p>

              <br />

              <DisplayStar
                pic={ pic }
                handleHeartClick={ handleHeartClick }
                isStarred={ isStarred }
              />
              {/*
              <FaInstagram
                style={ iconStyle}
                size={ 30 }
              />
              <FaFacebookSquare
                style={ iconStyle }
                size={ 30 }
              />
              <FaTwitter
                style={ iconStyle }
                size={ 30 }
              />
              <FaYelp
                style={ iconStyle }
                size={ 30 }
              />
              */}
            </Col>

            <Col
              md={ 6 }
              mdPull={ 6 }
            >

              <span style={ imgSpanStyle }>

                <img
                  src={ pic.imageURL }
                  style ={ imgStyle }
                />
              </span>
            </Col>
          </Row>

          <Row>
            <Col md ={6}
                 mdOffset={6}
            >
            <h4>
              Rating:
            </h4>
              <StarRatingComponent
                  name='picrating' /* name of the radio input, it is required */
                  value={ rating } /* number of selected icon (`0` - none, `1` - first) */
                  starCount={ 5 } /* number of icons in rating, default `5` */
                  onStarClick={ onStarClick } /* on icon click handler */
              />
            </Col>
          </Row>
        </Grid>
        <br />

        <div
          ref={ (el) => this.scrollEnd = el  }
        />
      </div>
    )
  }
};


