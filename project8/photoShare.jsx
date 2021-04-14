import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter, Route, Switch
} from 'react-router-dom';
import {
  Grid, Typography, Paper, Button
} from '@material-ui/core';
import './styles/main.css';

// import necessary components
import TopBar from './components/topBar/TopBar';
import UserDetail from './components/userDetail/UserDetail';
import UserList from './components/userList/UserList';
import UserPhotos from './components/userPhotos/UserPhotos';
import LoginForm from './components/login/loginForm';
import UploadPhoto from './components/userPhotos/upload/uploadPhoto';
import Register from './components/login/register/register';

import { GlobalProvider } from './context/accountContext'
import Favorites from './components/userFavorites/userFavorites';

const PhotoShare = () => {

  return (
    <GlobalProvider>
      <HashRouter>
        <div>
          <Grid container spacing={8}>
            <Grid item xs={12}>
              <TopBar />
            </Grid>
            <div className="cs142-main-topbar-buffer" />
            <Grid item sm={3}>
              <Paper className="cs142-main-grid-item">
                <UserList />
              </Paper>
            </Grid>
            <Grid wrap="wrap" item sm={9}>
              <Paper className="cs142-main-grid-item">
                <Switch>

                  <Route exact path="/"
                    render={() =>
                      <div>
                        <Typography style={{ fontSize: 20 }} variant="body1">
                          Welcome to your photosharing app.
                        </Typography>
                        <Typography style={{ fontSize: 16, marginBottom: 20 }} variant="body1">
                          Upload your photos now !
                        </Typography>
                        <Button variant="contained" color="primary" onClick={() => window.location.replace("/photo-share.html#/uploadphotos")} >Upload photo</Button>
                        <p>(only accecpt .png file)</p>
                      </div>
                    }
                  />
                  <Route exact path="/users/:userId"
                    render={props => <UserDetail {...props} />}
                  />
                  <Route path="/photos/:userId"
                    render={props => <UserPhotos {...props} />}
                  />
                  <Route exact path="/users" component={UserList} />
                  <Route exact path="/users/:id/favorites" component={Favorites} />
                  <Route exact path="/login" component={LoginForm} />
                  <Route exact path="/register" component={Register} />
                  <Route exact path="/logout" />
                  <Route exact path="/uploadphotos" component={UploadPhoto} />
                </Switch>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </HashRouter>
    </GlobalProvider>
  );
}


ReactDOM.render(
  <PhotoShare />,
  document.getElementById('photoshareapp')
);
