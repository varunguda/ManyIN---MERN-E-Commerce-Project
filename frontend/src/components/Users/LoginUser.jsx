import React, { useEffect, useRef, useState } from 'react';
import Metadata from '../Metadata';
import { bindActionCreators } from 'redux';
import { userActionCreators } from '../../State/action-creators';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';
import { toast } from "react-toastify";
import { LOGIN_USER_RESET } from '../../State/constants/UserConstants';
import Loader2 from '../layouts/Loader/Loader2';

import "./LoginUser.css";
import { Link } from 'react-router-dom';
import Loader from '../layouts/Loader/Loader';


const LoginUser = () => {

    const { checkingUser, userExist, userEmail, userCheckError } = useSelector(state => state.checkUser);

    const { loginLoading, loggedIn, loginMessage, loginError } = useSelector(state => state.loggedIn);

    const dispatch = useDispatch();
    const { checkUsersAccount, loginUser } = bindActionCreators(userActionCreators, dispatch);

    const location = useLocation();
    const navigate = useNavigate();

    const [mail, setMail] = useState(sessionStorage.getItem("mail") ? sessionStorage.getItem("mail") : "");
    const [pass, setPass] = useState("");
    const [fetched, setFetched] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const passRef = useRef(null);
    const passErrMsgRef = useRef(null);


    useEffect(() => {
        toast.error((userCheckError || loginError), {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }, [userCheckError, loginError]);


    useEffect(() => {
        if (!checkingUser && !userExist && fetched) {
            sessionStorage.setItem("mail", userEmail);
            navigate("/account/signup");
        }
        // eslint-disable-next-line
    }, [checkingUser, userExist, fetched]);


    const redirect = location.search.includes("redirect") ? '/' + location.search.split("=")[1] : "/";

    useEffect(() => {
        if (loggedIn) {
            navigate(redirect);

            if (sessionStorage.getItem("mail")) {
                sessionStorage.removeItem("mail");
            }
        }
        // eslint-disable-next-line
    }, [loggedIn])


    const mailChangeHandler = (e) => {
        setMail(e.target.value);
    }

    const passChangeHandler = (e) => {
        if (passErrMsgRef.current) {
            passErrMsgRef.current.innerHTML = "";
        }
        setPass(e.target.value);
    }

    const mailSubmitHandler = (e) => {
        e.preventDefault();

        if (mail) {
            sessionStorage.setItem("mail", mail);
            checkUsersAccount(mail);
            setFetched(true);
        }
    }

    const passSubmitHandler = (e) => {
        e.preventDefault();

        if (userEmail && pass) {
            loginUser(userEmail, pass);
        }
    }


    const showPassClickHandler = () => {
        if (passRef && passRef.current && passRef.current.type === "text") {
            setShowPass(false);
            passRef.current.type = "password";
        }
        else {
            setShowPass(true);
            passRef.current.type = "text";
        }
    }

    const forgotPassClickHandler = () => {
        dispatch({
            type: LOGIN_USER_RESET,
        })
        navigate("/account/password/forgot");
    }


    return (
        <>
            {checkingUser ? <Loader /> : (<div className='center-container'>

                <Metadata title={"Login - ManyIN"} />

                <div className="secondary-page-content">

                    <Link to="/">
                        <img className='logo-image' src="/ManyIN_LOGO.png" alt="logo" />
                    </Link>

                    {(!fetched) && (
                        <>
                            <div className='secondary-head'>Sign in or create your account</div>

                            <p>Not sure if you have an account?<br />
                                Enter your email and we'll check for you.</p>

                            <form onSubmit={mailSubmitHandler} method="post">

                                <div className='input-section'>
                                    <label className='label1' htmlFor="email">Email Address*</label>
                                    <input
                                        className='input1'
                                        onChange={mailChangeHandler}
                                        value={mail}
                                        type="email"
                                        name="email"
                                        id="email"
                                        spellCheck={false}
                                    />
                                </div>


                                <button className='main-btn loader-btn' type="submit" disabled={checkingUser}>
                                    {checkingUser ? (<Loader2 />) : "Continue"}
                                </button>

                                <p className="form-caption">Securing your personal information is our priority.</p>
                            </form>
                        </>

                    )}


                    {(userExist && fetched) && (
                        <>
                            <div className='secondary-head'>Login to your account</div>
                            <p>You are already a ManyIN user.<br />
                                Please enter your password in the given field below.</p>

                            <form onSubmit={passSubmitHandler} method="post">

                                <div className='input-section'>
                                    <label className='label1' htmlFor="pass">Password*</label>
                                    <input
                                        ref={passRef}
                                        onChange={passChangeHandler}
                                        className='input1 pass-input'
                                        type="password"
                                        name="pass"
                                        value={pass}
                                        id="pass"
                                        spellCheck={false}
                                    />
                                    <span className='inferior-btn show-pass-btn' onClick={showPassClickHandler}>{showPass ? "hide" : "show"}</span>

                                </div>

                                <p ref={passErrMsgRef} className='err-msg'>{loginMessage ? loginMessage : ""}</p>

                                <button className='main-btn loader-btn' type="submit" disabled={loginLoading}>
                                    {loginLoading ? (<Loader2 />) : "Log in"}
                                </button>

                                <button onClick={forgotPassClickHandler} className='inferior-btn forgot-pass-btn' type="button">Forgot Password?</button>

                            </form>
                        </>
                    )}
                </div>
            </div>)}
        </>
    )
}

export default LoginUser
