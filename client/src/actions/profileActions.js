import axios from 'axios';

import {GET_PROFILE , PROFILE_LOADING , PROFILE_NOT_FOUND , CLEAR_CURRENT_PROFILE , GET_PROFILES , GET_ERRORS} from './types';

//get current profile
export const getCurrentProfile = () => dispatch => {
    //first send set profile loading
    dispatch(setProfileLoading());
    //then get the profile from backend
    axios.get('/api/profile')
        .then(res => 
            dispatch({
                type : GET_PROFILE ,
                payload : res.data
            })
        )
        .catch(err => 
            dispatch({
                type: GET_PROFILE ,
                payload : {}
            })    
        );
}

//load profile
export const setProfileLoading = () => {
    return {
        type : PROFILE_LOADING
    }
}

//Clear profile
export const clearCurrentProfile = () => {
    return {
        type : CLEAR_CURRENT_PROFILE
    }
}