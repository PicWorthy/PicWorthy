import React, { Component } from 'react';
import { Grid, Row, Col, Form, FormGroup, FormControl, Button } from 'react-bootstrap';
import FaIconPack, {FaStarO, FaStar, FaFacebookSquare, FaTwitter, FaYelp, FaInstagram} from 'react-icons/lib/fa';
import axios from 'axios';


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
      <FaStar
        style={ iconStyle }
        size={ 40 }
      />
    )

  } else {
    return (
      <FaStarO
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


export default class editPicDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      edittedLocation: '',
      edittedDescription: ''
    }
  }

  scrollToBottom() {
    // not sure if I like this scroll down
    // this.scrollEnd.scrollIntoView({behavior: 'smooth'});
  }

  componentDidUpdate(prevProps) {
    if (prevProps.detailedPicURL === 'NONE' && this.props.detailedPicURL !== 'NONE') {
      this.scrollToBottom();
    }
  }

  refreshesPicRow() {
    this.props.refreshUser();
  }

  deletesPic() {
    axios.delete('/api/deletePic', {
      data: {
        imageURL: this.props.detailedPicURL,
        username: this.props.pics[0].username
      }
    })
    .then((response) => {
      this.refreshesPicRow();
    })
    .catch((error) => {
      console.log(error);
    });
  }

  editLocation(e) {
    this.setState({
      edittedLocation: e.target.value
    });
  }

  editDescription(e) {
    this.setState({
      edittedDescription: e.target.value
    });
  }

  submitEdit() {
    axios.patch('/api/modifyPicDetails', {
     imageURL: this.props.detailedPicURL,
     username: this.props.pics[0].username,
     location: this.state.edittedLocation,
     description: this.state.edittedDescription
    })
    .then((response) => {
      this.refreshesPicRow();
    })
    .catch((error) => {
      console.log(error);
    });
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
              <Form horizontal>
                <FormGroup>
                  <Button bsStyle="danger" onClick={this.deletesPic.bind(this)}>Delete</Button>
                </FormGroup>
                <FormGroup>
                  <FormControl type="text" placeholder={pic.location} onChange={this.editLocation.bind(this)} />
                </FormGroup>
                <FormGroup>
                  <FormControl componentClass="textarea" rows="4" placeholder={pic.description} onChange={this.editDescription.bind(this)} />
                </FormGroup>
                <FormGroup>
                  <Button onClick={this.submitEdit.bind(this)}>Submit</Button>
                </FormGroup>
              </Form>

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


