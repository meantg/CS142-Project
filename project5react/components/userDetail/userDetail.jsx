import React from 'react';
import {
  Typography
} from '@material-ui/core';
import {Link} from 'react-router-dom';
import './userDetail.css';
import { cs142models } from '../../modelData/photoApp';

/**
 * Define UserDetail, a React componment of CS142 project #5
 */
class UserDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: cs142models.userModel(this.props.match.params.userId)
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.match.params.userId !== state.prevID) {
      return {
        user: cs142models.userModel(props.match.params.userId),
      }
    }
    return null
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
