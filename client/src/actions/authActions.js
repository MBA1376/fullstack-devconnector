import axios from 'axios';
import {GET_ERRORS} from './types';

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