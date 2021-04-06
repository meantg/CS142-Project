import React from 'react';
import {
  Typography
} from '@material-ui/core';
import './userPhotos.css';
import { Link } from 'react-router-dom';
import { cs142models } from '../../modelData/photoApp';

const axios = require('axios');

/**
 * Define UserPhotos, a React componment of CS142 project #5
 */
class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {},
      userPhotos: []
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
          {photos.map((photo, index) => {
            let comments = photo.comments;
            console.log(comments);
              return (
                <div key={index} style={{ marginBottom: 30}} >
                  <img width={400} src={'../../images/' + photo.file_name} />
                  <p>Created at : {photo.date_time}</p>
                  <h3>Comments : </h3>
                  {comments !== undefined ?  comments.map((cmt, index) => {              
                      return (
                        <div key={index} >
                          <div style={{ display: "flex", flexDirection: "row" }}>
                            <Link to={"/users/" + cmt.user["_id"]} style={{ paddingRight: 7, fontWeight: "bold", margin: 1, }}>{cmt.user["first_name"]} {cmt.user["last_name"]} </Link>
                            <p style={{ margin: 1 }}> {cmt.comment}</p>
                          </div>
                          <p style={{ margin: 3, color: "grey" }}>{cmt.date_time}</p>
                        </div>
                      )
                  }) : <p>No one cmt yet !</p> }
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
