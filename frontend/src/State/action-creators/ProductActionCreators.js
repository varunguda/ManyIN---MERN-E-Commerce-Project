import axios from "axios";
import {
    ALL_PRODUCT_REQUEST,
    ALL_PRODUCT_FAILURE,
    ALL_PRODUCT_SUCCESS,

    PRODUCT_DETAILS_FAILURE,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_REQUEST,

    SELLER_PRODUCT_REQUEST,
    SELLER_PRODUCT_FAILURE,
    SELLER_PRODUCT_SUCCESS,

    BUNDLE_PRODUCTS_FAILURE,
    BUNDLE_PRODUCTS_REQUEST,
    BUNDLE_PRODUCTS_SUCCESS,

    PRODUCT_REVIEWS_REQUEST,
    PRODUCT_REVIEWS_FAILURE,
    PRODUCT_REVIEWS_SUCCESS,

    // DISLIKE_REVIEW_FAILURE,
    // DISLIKE_REVIEW_SUCCESS,

    // LIKE_REVIEW_FAILURE,
    // LIKE_REVIEW_SUCCESS,

} from "../constants/ProductConstants.js";



export const getProducts = (keyword="", minPrice=0, maxPrice=0, page=0, category="", brand="", availability="") => async(dispatch) => {
    try {
        dispatch({ type: ALL_PRODUCT_REQUEST });

        const queryParams = [
            keyword && `keyword=${keyword}`,
            minPrice && `pricemin=${minPrice}`,
            maxPrice && `pricemax=${maxPrice}`,
            category && `category=${category}`,
            availability && `availability=${availability}`,
            brand && `brand=${brand}`,
            page && `page=${page}`
        ].filter(Boolean).join('&');

        let link = `/api/v1/products${queryParams ? '?'+queryParams : ''}`;

        const { data } = await axios.get(link);
        
        dispatch({
            type: ALL_PRODUCT_SUCCESS,
            payload: data,
        });

    } catch (error) {
        dispatch({
            type: ALL_PRODUCT_FAILURE,
            payload: error.response.data.message,
        })
    }
}
// export const getProducts = () => async(dispatch, getState) => {
//     try {
//         dispatch({ type: ALL_PRODUCT_REQUEST });

//         const state = getState();

//         const queryParams = [
//             state.urlParams.keyword && `keyword=${state.urlParams.keyword}`,
//             state.urlParams.minPrice && `pricemin=${state.urlParams.minPrice}`,
//             state.urlParams.maxPrice && `pricemax=${state.urlParams.maxPrice}`,
//             state.urlParams.category && `category=${state.urlParams.category}`,
//             state.urlParams.availability && `availability=${state.urlParams.availability}`,
//             state.urlParams.brand && `brand=${state.urlParams.brand}`,
//             state.urlParams.page && `page=${state.urlParams.page}`
//         ].filter(Boolean).join('&');

//         let link = `/api/v1/products${queryParams ? '?'+queryParams : ''}`;

//         const { data } = await axios.get(link);
        
//         dispatch({
//             type: ALL_PRODUCT_SUCCESS,
//             payload: data,
//         });

//     } catch (error) {
//         dispatch({
//             type: ALL_PRODUCT_FAILURE,
//             payload: error.response.data.message,
//         })
//     }
// }



export const getProductDetails = ({ id }) => async(dispatch) => {
    try {
        
        dispatch({ type: PRODUCT_DETAILS_REQUEST });

        const { data } = await axios.get(`/api/v1/products/${id}`);

        dispatch({
            type: PRODUCT_DETAILS_SUCCESS,
            payload: data,
        });

    } catch (error) {
        dispatch({
            type: PRODUCT_DETAILS_FAILURE,
            payload: error.response.data.message,
        })
    }
}



export const getAllProductsOfSeller = (id) => async(dispatch) => {
    try {
        
        dispatch({ type : SELLER_PRODUCT_REQUEST });

        const { data } = await axios.get(`/api/v1/products/seller/${id}`); 

        dispatch({
            type: SELLER_PRODUCT_SUCCESS,
            payload: data.products,
        })

    } catch (error) {
        dispatch({
            type: SELLER_PRODUCT_FAILURE,
            payload: error.response.data.message
        })
    }
} 



export const getBundleProducts = (id) => async(dispatch) => {
    try {

        dispatch({ type: BUNDLE_PRODUCTS_REQUEST });

        const { data } = await axios.get(`/api/v1/products/bundles/${id}`);

        dispatch({
            type: BUNDLE_PRODUCTS_SUCCESS,
            payload: data,
        })

    } catch (error) {
        dispatch({
            type: BUNDLE_PRODUCTS_FAILURE,
            payload: error.response.data.message,
        })
    }
}



export const getProductReviews = (id, page) => async(dispatch) => {
    try {

        dispatch({ type: PRODUCT_REVIEWS_REQUEST });

        const { data } = await axios.get(`/api/v1/products/reviews/${id}?page=${page?page:1}`);

        dispatch({
            type: PRODUCT_REVIEWS_SUCCESS,
            payload: data,
        })
        
    } catch (error) {
        dispatch({
            type: PRODUCT_REVIEWS_FAILURE,
            payload: error.response.data.message,
        })
    }
}


// export const likeReview = ( reviews_id, review_id ) => (dispatch) => {
//     try {
        
//     } catch (error) {
//         dispatch({
//             type: LIKE_REVIEW_FAILURE,
//             payload: 
//         })
//     }
// }