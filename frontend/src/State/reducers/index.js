import { combineReducers } from "redux";
import {
    productReducer,
    productDetailsReducer,
    sellerProductsReducer,
    bundleProductsReducer,
    productReviewReducer
} from "./ProductReducer";
import { navigationReducer } from "./NavigationReducers";
import { 
    checkUserReducer,
    emptyListProductsReducer,
    forgotPasswordReducer,
    listItemsReducer,
    listProductsReducer,
    loginReducer,
    resetPasswordReducer,
    signOutReducer,
    signupReducer,
    verifcationReducer
} from "./UserReducers";
import {
    getAddressesReducer,
    addAddressReducer,
    updateDeleteAddressReducer,
    getMyOrdersReducer,
    cancelMyOrderReducer,
} from "./ProfileReducers"
import { 
    adminReducer, 
    createProductReducer, 
    dataAnalysisReducer, 
    deleteAnyUserReducer, 
    deleteOrUpdateAnyOrderReducer,
    getAllOrdersReducer, 
    getAllUsersReducer, 
    updateAnyUserRoleReducer
} from "./AdminReducers";
import { loaderReducer } from "./LoaderReducers";
import { addToCartReducer, orderValueReducer } from "./CartReducers";
import { sellerAnalysisReducer, sellerReducer } from "./SellerReducers";


const reducers = combineReducers({
    checkUser: checkUserReducer,
    listItems: listItemsReducer,
    products: productReducer,
    detailedProducts: productDetailsReducer,
    sellerProducts: sellerProductsReducer,
    bundleProducts: bundleProductsReducer,
    productReviews: productReviewReducer,
    urlParams: navigationReducer,
    loggedIn: loginReducer,
    signup: signupReducer,
    signout: signOutReducer,
    verifySignup: verifcationReducer,
    forgotPassword: forgotPasswordReducer,
    resetPassword: resetPasswordReducer,
    loader: loaderReducer,
    addresses: getAddressesReducer,
    listProducts: listProductsReducer,
    emptyListProducts: emptyListProductsReducer,
    addAddress: addAddressReducer,
    updateDeleteAddress: updateDeleteAddressReducer,
    myOrders: getMyOrdersReducer,
    cancelMyOrder: cancelMyOrderReducer,
    cart: addToCartReducer,
    orderValue: orderValueReducer,
    admin: adminReducer,
    adminAnalytics: dataAnalysisReducer,
    seller: sellerReducer,
    sellerAnalytics: sellerAnalysisReducer,
    createProduct: createProductReducer,
    allOrders: getAllOrdersReducer,
    deleteOrUpdateAnyOrder: deleteOrUpdateAnyOrderReducer,
    customersOrSellers: getAllUsersReducer,
    deleteAnyUser: deleteAnyUserReducer,
    updateUserRole: updateAnyUserRoleReducer,
});


export default reducers;