import React from 'react';
import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
}
  from '@material-ui/core';
import { Link } from 'react-router-dom'
import './userList.css';
import { cs142models } from '../../modelData/photoApp';
/**
 * Define UserList, a React componment of CS142 project #5
 */
class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: cs142models.userListModel()
    }
  }

  render() {
    return (
      <div>
        <Typography id="userTxt" variant="body1">
          Users list
        </Typography>
        <List component="nav">
          {this.state.users.map((user, index) => (
            <div key={index}>
              <ListItem  >
                <Link to={"/users/" + user._id} replace >{user.first_name + " " + user.last_name}</Link>
              </ListItem>
              <Divider />
            </div>
          ))}
        </List>
        <Typography variant="body1">
          The model comes in from window.cs142models.userListModel()
        </Typography>
      </div>
    );
  }
}

export default UserList;
