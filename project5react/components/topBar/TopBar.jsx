import React from 'react';
import {
  AppBar, Toolbar, Typography
} from '@material-ui/core';
import './TopBar.css';

/**
 * Define TopBar, a React componment of CS142 project #5
 */
class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      versionNumber: 0
    }
    this.FetchVersionNumber = this.FetchVersionNumber.bind(this)
  }


  FetchVersionNumber() {
    // var url = "http://localhost:3000/test/info";
    // try {
    //   let res = fetch(url);
    //   console.log(res.body);
    // } catch (error) {
    //   console.log(error);
    // }
  }

  render() {
    return (
      <AppBar className="cs142-topbar-appBar" position="absolute">
        {this.FetchVersionNumber()}
        <Toolbar>
          <Typography variant="h5" color="inherit">
            Photo Sharing Community v{this.state.versionNumber}
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }
}

export default TopBar;
