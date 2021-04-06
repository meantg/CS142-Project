import React from 'react';
import {
  Typography
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import './userDetail.css';

const axios = require('axios');

/**
 * Define UserDetail, a React componment of CS142 project #5
 */
class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {}
    }
    this.getUser = this.getUser.bind(this);
  }

  getUser() {
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

  componentDidMount(){
    this.getUser()
  }

  componentDidUpdate(){
    this.getUser()
  }


  render() {
    return (
      <div key={this.props._id}>
        <h1>{this.state.user.first_name + " " + this.state.user.last_name}</h1>
        <p>Location : {this.state.user.location}</p>
        <Typography variant="body1">
          Description : {this.state.user.description} + {this.state.user.occupation}
        </Typography>
        <Link to={"/photos/" + this.state.user._id}>Go to photos</Link>
      </div>
    );
  }
}

export default UserDetail;
