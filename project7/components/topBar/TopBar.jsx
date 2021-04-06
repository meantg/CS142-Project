import React from 'react';
import {
  AppBar, Toolbar, Typography, Button,
} from '@material-ui/core';
import './TopBar.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Redirect } from 'react-router';
import { cs142models } from '../../modelData/photoApp';

/**
 * Define TopBar, a React componment of CS142 project #5
 */
class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      versionNumber: 0,
      userName: window.sessionStorage.getItem("login_name"),
      user: {}
    }
    this.handleLogout = this.handleLogout.bind(this);
    this.getCurUser = this.getCurUser.bind(this);
  }


  componentDidMount() {
    this.getCurUser()
  }

  getCurUser() {
    axios.get('http://localhost:3000/get_session')
      .then(result => {
        console.log(result);
        this.setState({ user: result.data })
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  handleLogout() {
    axios.post("http://localhost:3000/admin/logout").then(result => {
      console.log(result);
    }).catch(err => {
      console.log(err);
    })
    window.location.reload(false);
    return <Redirect to="/"></Redirect>
  }

  render() {
    return (
      <AppBar className="cs142-topbar-appBar" position="absolute">
        <Toolbar>
          <Button component={Link} to="/" color="inherit" >
            PHOTO SHARING COMUNITY +
            </Button>
          {this.state.user.last_name != null ? <div style={{ display: "flex", justifyContent: "flex-end", flex: 1 }}>
            <h3>Welcome back {this.state.user.last_name},</h3>
            <Button color="secondary" onClick={() => this.handleLogout()} >
              Logout
            </Button>
          </div> : <div style={{ display: "flex", justifyContent: "flex-end", flex: 1 }}>
            <Button variant="contained" component={Link} to="/login" color="default" >
              Login
            </Button>
          </div>}
        </Toolbar>
      </AppBar>
    );
  }
}

export default TopBar;
