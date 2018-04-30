import React from 'react';
import PropTypes from 'prop-types';



const cardStyle ={
  display: `inline-block`,
  padding: `15px 15px 70px 15px`,
  height: `350px`,
  width: `250px`,
  border: `1px solid black`,  
  margin: `5px`,
  borderRadius: `3px`,
  boxShadow: `5px 5px 3px grey`,
  backgroundColor: `white`
}

const cardStyleSelected = Object.assign(
  {},
  cardStyle, 
  {background: `linear-gradient(to right, #4cc7ff 0%, #99dfff  100%)`}
);


const imgStyle = {
  border: `1px solid #555`,
  height: `100%`,
  width: `100%`,
  objectFit: `cover`
}

const locationStyle = {
  textTransform: `capitalize`,
  fontFamily: `billabong, Comic Sans MS, Arial, sans-serif`,
  fontWeight: `bold`,
  fontSize: `xx-large`
}

const Card = ({ picDetails, showHideDetails, selected }) => (
  <a href='#'>
    <span 
      style={ selected ? cardStyleSelected : cardStyle } 
      onClick={ (e) => showHideDetails(e, picDetails.imageURL) }
    >
        <img 
          src={ picDetails.imageURL } 
          style={ imgStyle } 
        />
      
      <br/> <br/>
      <div style={ locationStyle }>{ picDetails.location }</div>
    </span>
  </a>
)

/*
 * We did a bad job at updating and consistently using propTypes
 */

Card.propTypes = {
  picDetails: PropTypes.shape({
    location: PropTypes.string,
    imageURL: PropTypes.string
  }).isRequired,
  showHideDetails: PropTypes.func.isRequired,
  selected: PropTypes.func.isRequired
}

export default Card;