import React, { Component } from 'react';
import { Col, Form, FormGroup, ControlLabel, FormControl, Button } from 'react-bootstrap';
import moment from 'moment';
import axios from 'axios';

const CommentsRender = (props) => {
  if (props.this.props.pic.comments && props.this.props.pic.comments.length > 0) {
    return (
      <Col>
        <div style={{
          textAlign:'center'
        }}>
          {props.this.props.pic.comments.map(comment => 
            <div>
              <h5>{comment.username} {moment(comment.createdAt).fromNow()}</h5>
              <h5><div>{comment.message}</div></h5>
            </div>
          )}
        </div>
      </Col>
    )
  } else {
    return <div></div>
  }
};

export default class Details extends Component {
  constructor(props) {
    super(props); 
    this.state = {
      message: ''
    }
  }

  componentDidMount() {
    this.props.refreshUser();
  }

  handleCommentChange(e) {
    this.setState({
      message: e.target.value
    });
  }

  handleCommentClick() {
    let comment;
    if (this.state.message !== '') {
      comment = {
        username: this.props.pic.username,
        message: this.state.message,
        createdAt: moment().format()
      }
    }
    if (comment) {
      this.setState({
        message: ''
      });
      
      this.updatePhotoComments(comment);//, this.props.refreshUser);
      // this.props.refreshUser();
    }
  }
  
  updatePhotoComments(comment) {
    console.log(this);
    let commentsArray;
    if (this.props.pic.comments) {
      this.props.pic.comments.push(comment);
      commentsArray = this.props.pic.comments.slice();
    } else {
      commentsArray = [];
      commentsArray.push(comment);
    }
    axios.patch('/api/comments', {
      user_id: this.props.pic.user_id,
      comments: commentsArray,
      imageURL: this.props.pic.imageURL
    })
      // .then((data) => {
      //   console.log('data returned after updating photo: ', data);
      //   callback();
      // })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    return (
      <div >
        <CommentsRender this={this}/>

        <Form horizontal className="comment-form">
          <FormGroup controlId="formHorizontalComment">
            <Col componentClass={ControlLabel} smOffset={2} sm={2}>
              Comment:
            </Col>
            <Col sm={5}>
              <FormControl
              type="text"
              placeholder="Add a comment!"
              onChange={this.handleCommentChange.bind(this)}
              value={this.state.message}
              />
            </Col>
            <Col>
              <Button type="button" sm={5} onClick={this.handleCommentClick.bind(this)}>Submit</Button>
            </Col>
          </FormGroup>
        </Form>
      </div>
    )
  }
}