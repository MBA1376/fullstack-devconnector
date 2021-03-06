import axios from 'axios';
import {ADD_POST ,GET_POSTS , GET_ERRORS , POST_LOADING, DELETE_POST, GET_POST} from '../actions/types';

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
export const getPosts = () => dispatch => {
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

//Delete Post
export const deletePost = id => dispatch => {
    axios.delete(`/api/posts/${id}`)
        .then( res => dispatch({
            type : DELETE_POST ,
            payload : id
        }))
        .catch( err => dispatch({
            type : GET_ERRORS ,
            payload : err.response.data
        }));
}       

//Add Like
export const addLike = (id)=> dispatch => {
    axios.post(`/api/posts/like/${id}`)
        .then( res => dispatch(getPosts()))
        .catch( err => dispatch({
            type : GET_ERRORS ,
            payload : err.response.data
        }));
}

//Remove Like
export const removeLike = (id)=> dispatch => {
    axios.post(`/api/posts/unlike/${id}`)
        .then( res => dispatch(getPosts()))
        .catch( err => dispatch({
            type : GET_ERRORS ,
            payload : err.response.data
        }));
}

//get post by id
export const getPost = id => dispatch => {
    dispatch(setLoading());
    axios.get(`/api/posts/${id}`)
        .then( res => dispatch({
            type : GET_POST ,
            payload : res.data
        }))
        .catch(err => dispatch({
            type : GET_POST,
            payload : null
        }));
}

//set loading state
export const setLoading = () => {
    return {
        type : POST_LOADING
    }
}