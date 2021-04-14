import React from 'react';
import {
	Button,
	Typography
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import './userDetail.css';
import Rodal from 'rodal';
import 'rodal/lib/rodal.css';
import Comment from '../userPhotos/photos/comment/comment';
import Photo from '../userPhotos/photos/photo';
import { useParams } from 'react-router-dom'

import { useGlobalState, GlobalProvider } from '../../context/accountContext';

const axios = require('axios');

/**
 * Define UserDetail, a React componment of CS142 project #5
 */
const UserDetail = ({ match }) => {

	const [user, setUser] = React.useState({});
	const [latestPhoto, setLatestPhoto] = React.useState({});
	const [mostCmtPhoto, setMostCmtPhoto] = React.useState({});
	const [rodalPhoto, setRodalPhoto] = React.useState({});
	const [favors, setFavors] = React.useState([]);
	const [curUser, setCurUser] = React.useState({});
	const [modal, setModal] = React.useState(false);
	const [loading, setLoading] = React.useState(false);

	const userId = match.params.userId;
	//from reducer
	const { loginUser } = useGlobalState();

	React.useEffect(() => {
		console.log(loginUser);
		loadInfo()
	}, [userId, loginUser])

	const loadInfo = () => {
		getUser();
		getCurUser();
		getUserPhoto();
		getMostCmtPhoto();

	}

	const getCurUser = () => {
		console.log("getCurUser");
		axios.get('http://localhost:3000/get_session')
			.then(result => {
				setCurUser(result.data);
			})
			.catch(function (err) {
				console.log(err);
			});
	}

	const getUser = () => {
		console.log("getUser");
		axios.get('http://localhost:3000/user/' + userId)
			.then(result => {
				setUser(result.data)
			})
			.catch((err) => {
				console.log(err);
				setUser({});
			});
	}

	const getUserPhoto = () => {
		console.log("getUserPhoto");
		axios.get('http://localhost:3000/photosOfUser/latest/' + userId)
			.then(result => {
				setLatestPhoto(result.data)
			})
			.catch(function (err) {
				setLatestPhoto({})
				console.log(err);
			});
	}

	const getMostCmtPhoto = () => {
		console.log("getMostCmtPhoto");
		axios.get('http://localhost:3000/photosOfUser/mostComment/' + userId)
			.then(result => {
				setMostCmtPhoto(result.data)
				setLoading(true);
			})
			.catch(err => {
				console.log(err);
				setMostCmtPhoto({})
			})
	}

	const modalOpen = (photo) => {
		setModal(true);
		setRodalPhoto(photo);
	}

	const modalClose = () => {
		setModal(false)
	}

	const renderRodal = () => {
		console.log(rodalPhoto);
		if (rodalPhoto.file_name != undefined) {
			return (
				<Rodal width={window.innerWidth * 8 / 10} height={window.innerHeight * 6 / 10} visible={modal} onClose={() => modalClose()}>
					<Photo flexDirection={"row"} user={user} photo={rodalPhoto} />
				</Rodal>
			)
		} else {
			return (<p> No one cmt yet !</p>)
		}

	}

	if (user) {
		return (
			<div>
				{curUser.last_name === user.last_name ? <h1>Your profile</h1> : <h1>{user.first_name + " " + user.last_name}</h1>}
				<p>Location : {user.location}</p>
				<Typography variant="body1">
					Description : {user.description}
				</Typography>
				<Typography variant="body1">
					Carrier : {user.occupation}
				</Typography>
				{curUser.last_name === user.last_name ? <Link to={"/users/" + user._id + "/favorites"}>Go to favorites</Link> : null}
				{
					latestPhoto.file_name !== undefined ? <div >
						<Link to={"/photos/" + user._id}>Go to photos</Link>
						<h3>Latest upload: </h3>
						<img style={{ cursor: "pointer" }} onClick={() => modalOpen(latestPhoto)} width={450} src={"../../images/" + latestPhoto.file_name}></img>
						<p>Uploaded in: {latestPhoto.date_time}</p>
					</div> : <div>
						<h3>This user doesn't public any photo yet !</h3>
					</div>
				}
				{
					mostCmtPhoto.file_name !== undefined ? <div >
						<h3>Most comment photo with {mostCmtPhoto.comments.length} comments :</h3>
						<img style={{ cursor: 'pointer', }} onClick={() => modalOpen(mostCmtPhoto)} width={450} src={"../../images/" + mostCmtPhoto.file_name}></img>
						<p>Uploaded in: {mostCmtPhoto.date_time}</p>
					</div> : null
				}
				{renderRodal()}
			</div>
		);
	} else {
		return (
			<div style={{ justifyContent: "center", alignItems: "center" }}>
				YOU HAVEN'T LOGGED IN YET !
			</div>)
	}

}

export default UserDetail;
