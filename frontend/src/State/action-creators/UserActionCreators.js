import axios from "axios";
import {
    USER_CHECK_REQUEST,
    USER_CHECK_SUCCESS,
    USER_CHECK_FAILURE,

    LOGIN_USER_REQUEST,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAILURE,

    SIGNUP_USER_REQUEST,
    SIGNUP_USER_SUCCESS,
    SIGNUP_USER_FAILURE,

    VERIFY_USER_REQUEST,
    VERIFY_USER_SUCCESS,
    VERIFY_USER_FAILURE,
    FORGOT_PASSWORD_FAILURE,
    FORGOT_PASSWORD_REQUEST,
    FORGOT_PASSWORD_SUCCESS,

    RESET_PASSWORD_FAILURE,
    RESET_PASSWORD_REQUEST,
    RESET_PASSWORD_SUCCESS,
} from "../constants/UserConstants.js";



export const checkUsersAccount = ( email ) => async(dispatch) => {

    try {
        
        dispatch({ type: USER_CHECK_REQUEST });

        const config = { headers: { "Content-Type": "application/json" } };

        const { data } = await axios.post(`/api/v1/checkuser`, { email }, config);

        dispatch({
            type: USER_CHECK_SUCCESS,
            payload: data,
        })
        
    } catch (error) {

        dispatch({
            type: USER_CHECK_FAILURE,
            payload: error.response.data.message,
        })
    }
}



export const loginUser = (email, pass) => async(dispatch) => {

    try {
        
        dispatch({
            type: LOGIN_USER_REQUEST
        })

        const config = { headers: { "Content-Type": "application/json" } }

        const { data } = await axios.post("/api/v1/login", { email, password: pass }, config);

        dispatch({
            type: LOGIN_USER_SUCCESS,
            payload: data,
        })

    } catch (error) {

        dispatch({
            type: LOGIN_USER_FAILURE,
            payload: error.response.data.message,
        })
    }
}



export const signupUser = (user) => async(dispatch) => {

    try {
        
        dispatch({
            type: SIGNUP_USER_REQUEST
        })

        const config = { headers: { "Content-Type": "application/json" } }

        const { data } = await axios.post("/api/v1/register", { name: user.name, email: user.mail , password: user.confirmPass }, config);

        dispatch({
            type: SIGNUP_USER_SUCCESS,
            payload: data,
        })

    } catch (error) {

        dispatch({
            type: SIGNUP_USER_FAILURE,
            payload: error.response.data.message,
        })
    }
}



export const verifyUser = (code) => async(dispatch) => {

    try {
        
        dispatch({
            type: VERIFY_USER_REQUEST
        })

        const config = { headers: { "Content-Type": "application/json" } }

        const { data } = await axios.post("/api/v1/register-verify", { userCode: code }, config);

        dispatch({
            type: VERIFY_USER_SUCCESS,
            payload: data,
        })

    } catch (error) {

        dispatch({
            type: VERIFY_USER_FAILURE,
            payload: error.response.data.message,
        })
    }
}



export const sendPassRecoveryMail = (email) => async(dispatch) => {

    try {

        dispatch({ type: FORGOT_PASSWORD_REQUEST });

        const config = { headers: { "Content-Type" : "application/json" } };

        const { data } = await axios.post(`/api/v1/password/forgot`, { email }, config);

        dispatch({
            type: FORGOT_PASSWORD_SUCCESS,
            payload: data,
        })
        
    } catch (error) {
        dispatch({
            type: FORGOT_PASSWORD_FAILURE,
            payload: error.response.data.message,
        })
    }
}



export const resetPassword = ( pass, confirmPass, token ) => async(dispatch) => {
    
    try {
        
        dispatch({ type: RESET_PASSWORD_REQUEST });

        const config = { headers: {"Content-Type": "application/json"} };
        
        const { data } = await axios.put(`/api/v1/password/reset/${token}`, { password: pass, confirmPassword: confirmPass }, config);

        dispatch({
            type: RESET_PASSWORD_SUCCESS,
            payload: data,
        })
        
    } catch (error) {
        dispatch({
            type: RESET_PASSWORD_FAILURE,
            payload: error.response.data.message,
        })
    }
}