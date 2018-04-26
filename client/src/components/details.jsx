import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-bootstrap';
import FaIconPack, {FaHeartO, FaStar, FaFacebookSquare, FaTwitter, FaYelp, FaInstagram} from 'react-icons/lib/fa';

const getPic = (url, pics) => {
  for (const pic of pics) {
    if (pic.imageURL === url) {
      return pic;
    }
  }
  return 'NOT_FOUND';
}

const DisplayStar = ({ pic, handleStarClick, isStarred }) => {
  if (isStarred) {
    return (
      <FaHeart 
        style={ iconStyle } 
        size={ 40 }
      />
    )

  } else {
    return (
      <FaHeartO
        style={ iconStyle } 
        size={ 40 } 
        onClick={ (e) => handleStarClick(e, pic) } 
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

    const { detailedPicURL, pics, userFavorites, showHideDetails, handleStarClick } = this.props

    let pic = getPic(detailedPicURL, pics);

    if (pic === 'NOT_FOUND') {
      return <div />;
    }

    const isStarred = checkFavorites(userFavorites.map((p) => p.imageURL), pic.imageURL)


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
                handleStarClick={ handleStarClick }
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
        </Grid>
        <br />

        <div
          ref={ (el) => this.scrollEnd = el  }
        />
      </div>
    )
  }
};


