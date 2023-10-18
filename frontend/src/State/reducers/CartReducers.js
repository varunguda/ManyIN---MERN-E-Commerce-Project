import { ADD_TO_CART, SAVE_SHIPPING_INFO } from "../constants/CartConstants";


export const addToCartReducer = ( state = { cartItems: [] }, action ) => {

    switch (action.type) {    
        case ADD_TO_CART:{
            const item = action.payload;

            const isItemExist = state.cartItems.find(i => i.product === item.product);

            if(!isItemExist){
                return ({
                    ...state,
                    cartItems: [...state.cartItems, item]
                });
            }

            if(item.quantity === 0){
                return ({
                    ...state,
                    cartItems: state.cartItems.filter(i => i.product !== isItemExist.product),
                })
            }

            return ({
                ...state,
                cartItems: state.cartItems.map(i => i.product === isItemExist.product ? item : i),
            });
        }


        case SAVE_SHIPPING_INFO:{
            return ({
                ...state,
                shippingInfo: action.payload,
            })
        }
    
        default:{
            return state;
        }
    }
};