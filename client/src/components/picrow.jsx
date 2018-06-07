import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome from 'react-fontawesome';
import FaIconPack, {FaChevronRight, FaChevronLeft} from 'react-icons/lib/fa';
import Card from './card.jsx';


const PicRow = ({ pics, rotatePics,showHideDetails, detailedPicURL }) => {

  const cards = pics.map((pic, i) => (
    <Card
      key={i}
      showHideDetails={ showHideDetails }
      picDetails={pic}
      selected={ pic.imageURL === detailedPicURL }
    />
  ));

  // const rotateLeft = (e) => {
  //   rotatePics(e, 'LEFT');
  //   this.props.refreshUser();
  // };

  // const rotateRight = (e) => {
  //   rotatePics(e, 'RIGHT');
  //   this.props.refreshUser();
  // };

  return (
    <div style={{textAlign: `center`}}>
      <a href='#'><FaChevronLeft
        onClick={(e) => rotatePics(e, 'LEFT')}
        style={chevronStyle}
      /></a>

      { cards }

      <a href='#'><FaChevronRight
        onClick={(e) => rotatePics(e, 'RIGHT')}
        style={chevronStyle}
      /></a>
      <br/>
      <br/>
    </div>
  )

}


const chevronStyle = {
  verticalAlign: `top`,
  paddingRight: `45px`,
  paddingTop: `170px`,
  paddingBottom: `180px`,
  display: `inline-block`,
  margin: `5px`
}

export default PicRow;