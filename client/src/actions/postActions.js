import axios from 'axios';
import {ADD_POST ,GET_POSTS , GET_ERRORS , POST_LOADING} from '../actions/types';

//ADD POST
export const addPost = postData => dispatch => {
    axios.post('/api/posts' , postData)
        .then( res => dispatch({
            type : ADD_POST ,
            payload : res.data
        }))
        .catch( err => dispatch({
            type : GET_ERRORS ,
            payload : err.response.data
        }))
}

//GET POSTS
export const getPosts = postData => dispatch => {
    dispatch(setLoading());
    axios.get('/api/posts')
        .then( res => dispatch({
            type : GET_POSTS ,
            payload : res.data
        }))
        .catch( err => dispatch({
            type : GET_POSTS ,
            payload : null
        }))
}

//set loading state
export const setLoading = () => {
    return {
        type : POST_LOADING
    }
}