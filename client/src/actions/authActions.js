import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import jwt_decode from 'jwt-decode';
import {GET_ERRORS , SET_CURRENT_USER} from './types';

// Register User
export const registerUser = (userData , history)=> dispatch => {
    /**in this section if user signed in then redirect to login page else show's the errors with redux dispatch */
    axios.post('/api/users/register' , userData)
        .then( res => history.push('/login'))
        .catch( err =>
            dispatch({
                type : GET_ERRORS ,
                payload : err.response.data
            })   
        );
}


//Login user
export const loginUser = userData => dispatch => {
    axios.post('/api/users/login' , userData)
        .then(res => {
            //save to localStorage
            const {token} = res.data;
            //set token to localStorage
            localStorage.setItem('jwtToken' , token);
            //set token to Auth header
            setAuthToken(token);
            //decode current token 
            const decoded = jwt_decode(token);
            //set current user
            dispatch(setCurrentUser(decoded));

        })
        .catch(err =>
            dispatch({
                type : GET_ERRORS ,
                payload : err.response.data
            }) 
        );
}   


export const setCurrentUser = (decoded) => ({
    type : SET_CURRENT_USER ,
    payload : decoded
});

// log user out
export const logoutUser = () => dispatch => {
    //Remove token from localStorage
    localStorage.removeItem('jwtToken');
    //Remove auth header for future requests
    setAuthToken(false);
    //Set current user to {} and set isAuthenticated to false
    dispatch(setCurrentUser({}));
}