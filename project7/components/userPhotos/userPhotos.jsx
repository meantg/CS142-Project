import React from 'react';
import {
  Button,
  TextField,
  Typography
} from '@material-ui/core';
import './userPhotos.css';
import { Link } from 'react-router-dom';
import { cs142models } from '../../modelData/photoApp';
import Photo from './photos/photo';
import { log } from 'async';

const axios = require('axios');

/**
 * Define UserPhotos, a React componment of CS142 project #5
 */
class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      userPhotos: [],
      comment: ""
    }
    this.getUser = this.getUser.bind(this);
    this.getUserPhoto = this.getUserPhoto.bind(this);
  }

  getUser(){
    axios.get('http://localhost:3000/user/' + this.props.match.params.userId)
      .then(result => {
        this.setState({
          user: result.data
        })
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  getUserPhoto(){
    axios.get('http://localhost:3000/photosOfUser/' + this.props.match.params.userId)
      .then(result => {
        this.setState({
          userPhotos: result.data
        })
      })
      .catch(function (err) {
        console.log(err);
      });
  }



  componentDidMount(){
    this.getUser();
    this.getUserPhoto();
  }

  componentWillUnmount(){
    this.setState({
      user: {},
      userPhotos: []
    })
  }

  render() {

    const user = this.state.user;
    const photos = this.state.userPhotos;
    if(photos != []){
      return (
        <div style= {{paddingBottom: 20}}>
          <h1>Photos of {user.first_name} {user.last_name} </h1>
          {(photos.reverse()).map((photo, index) => {
              return (
                <div key={index} style={{ marginBottom: 30}} >
                <Photo user={user} photo={photo}></Photo>
                </div>
              )
          })}
        </div>
      );
    } else return(
      <h3>{user.last_name} don't have any Posts yet!</h3>
    )
    return null;
  }
}

export default UserPhotos;
