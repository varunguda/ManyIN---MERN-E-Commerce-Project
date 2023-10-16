import React, { useEffect, useReducer, useRef, useState } from 'react';
import "./Orders.css";
import { bindActionCreators } from 'redux';
import { modalActionCreators, profileActionCreators } from '../../../State/action-creators';
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { SET_ORDER_KEYWORD, SET_ORDER_PAGE, SET_ORDER_STATUS, SET_ORDER_TIME } from '../../../State/constants/NavigationConstants';
import { loaderSpin } from '../../../State/action-creators/LoaderActionCreator';
import { TfiSearch } from 'react-icons/tfi';
import { PiSlidersHorizontalLight } from 'react-icons/pi';
import { BiInfoCircle } from 'react-icons/bi';
import FilterContent from './FilterContent';
import Metadata from '../../Metadata';
import Paginate from '../../elements/Pagination/Paginate';
import Icons from './Icons';
import { formatDate } from './OrderUtils';
import { toast } from 'react-toastify';
import { CANCEL_USER_ORDER_RESET } from '../../../State/constants/ProfileConstants';
import { Link } from "react-router-dom";


const orderParamsReducer = (state, action) => {

    switch (action.type) {

        case SET_ORDER_KEYWORD: {
            return ({ ...state, keyword: action.payload });
        }

        case SET_ORDER_STATUS: {
            return ({ ...state, status: action.payload });
        }

        case SET_ORDER_TIME: {
            return ({ ...state, time: action.payload });
        }

        case SET_ORDER_PAGE: {
            return ({ ...state, page: action.payload });
        }

        default: {
            return state;
        }
    }
};


const initialState = {
    keyword: "",
    status: "",
    time: "",
    page: 0
}

const Orders = () => {

    const [state, dispatch] = useReducer(orderParamsReducer, initialState);

    // eslint-disable-next-line
    const { gettingMyOrders, myOrders, myOrdersCount, totalOrdersCount } = useSelector(state => state.myOrders);
    const { cancellingMyOrder, cancelledOrder, cancelledOrderMessage, cancelledOrderError } = useSelector(state => state.cancelMyOrder);

    const ordersDispatch = useDispatch();

    const { getUserOrders, cancelUserOrder } = bindActionCreators(profileActionCreators, ordersDispatch);
    const { openModal, closeModal } = bindActionCreators(modalActionCreators, ordersDispatch);

    const [searchText, setSearchText] = useState("");
    const [stateUpdated, setStateUpdated] = useState(false); // Flag to track state updates
    const [navigateUrl, setNavigateUrl] = useState(false);
    const inputRef = useRef(null);

    const navigate = useNavigate();
    const location = useLocation();

    const setOrderParam = (type, queryValue) => {
        dispatch({
            type,
            payload: queryValue,
        });
    };

    useEffect(() => {

        const queryParams = new URLSearchParams(location.search);
        const queryKeyword = queryParams.get("keyword");
        const queryStatus = queryParams.get("status");
        const queryPage = queryParams.get("page");
        const queryTime = queryParams.get("time");

        if (queryKeyword !== null && queryKeyword !== state.keyword) {
            setOrderParam(SET_ORDER_KEYWORD, queryKeyword);
            setSearchText(queryKeyword);
        }
        if (queryStatus !== null && queryStatus !== state.status) {
            setOrderParam(SET_ORDER_STATUS, queryStatus);
        }
        if (queryTime !== null && queryTime !== state.time) {
            setOrderParam(SET_ORDER_TIME, queryTime);
        }
        if (queryPage !== null && queryPage !== state.page) {
            setOrderParam(SET_ORDER_PAGE, parseInt(queryPage, 10));
        }

        if (
            queryKeyword !== state.keyword ||
            queryStatus !== state.status ||
            queryTime !== state.time ||
            queryPage !== state.page
        ) {
            setStateUpdated(true);
            window.scrollTo(0, 0);
        }

        // eslint-disable-next-line
    }, [location.search]);


    useEffect(() => {
        if (stateUpdated) {
            getUserOrders(state.keyword, state.status, state.time, state.page);
            setStateUpdated(false);
        }

        // eslint-disable-next-line
    }, [state, stateUpdated]);


    useEffect(() => {
        if (gettingMyOrders || cancellingMyOrder) {
            ordersDispatch(loaderSpin(true));
        } else {
            ordersDispatch(loaderSpin(false));
        }

        // eslint-disable-next-line
    }, [gettingMyOrders, cancellingMyOrder]);


    useEffect(() => {
        if (myOrdersCount < 6) {
            dispatch({ type: SET_ORDER_PAGE, payload: 0 });
            setNavigateUrl(true);
        }
    }, [myOrdersCount]);


    useEffect(() => {
        toast.error(cancelledOrderError, {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }, [cancelledOrderError]);


    useEffect(() => {
        toast.success(cancelledOrderMessage, {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }, [cancelledOrderMessage]);


    useEffect(() => {
        if (cancelledOrder) {
            dispatch({ type: CANCEL_USER_ORDER_RESET });
            setStateUpdated(true);
        }
    }, [cancelledOrder])


    useEffect(() => {

        const queryParams = [
            state.keyword && `keyword=${encodeURIComponent(state.keyword)}`,
            state.status && `status=${encodeURIComponent(state.status)}`,
            state.time && `time=${encodeURIComponent(state.time)}`,
            state.page && `page=${encodeURIComponent(state.page)}`,
        ].filter(Boolean).join("&");

        if (navigateUrl) {
            navigate(`${queryParams && ('?' + queryParams)}`);
            setNavigateUrl(false);
        }

        // eslint-disable-next-line
    }, [navigateUrl]);


    const searchOrdersHandler = (e) => {
        e.preventDefault();

        if (searchText.trim()) {
            if (state.keyword !== searchText) {
                dispatch({ type: SET_ORDER_KEYWORD, payload: searchText });
                setNavigateUrl(true);
            }
            inputRef.current.blur();
        }
        else if ((searchText.trim() !== state.keyword)) {
            dispatch({ type: SET_ORDER_KEYWORD, payload: "" });
            setNavigateUrl(true);
        }
        else {
            setSearchText("");
            inputRef.current.blur();
        }
    }


    const setStatus = (val) => {
        dispatch({ type: SET_ORDER_STATUS, payload: val });
    }

    const setTime = (val) => {
        dispatch({ type: SET_ORDER_TIME, payload: val });
    }

    const filterClickHandler = () => {
        openModal("Filter Orders", <FilterContent state={state} setStatus={(val) => setStatus(val)} setTime={(val) => setTime(val)} setNavigateUrl={setNavigateUrl} closeModal={closeModal} />);
    }


    const setPage = (page) => {
        dispatch({ type: SET_ORDER_PAGE, payload: page });
        setNavigateUrl(true);
    }


    const cancelOrderHandler = (id) => {
        cancelUserOrder(id);
        closeModal();
    }


    const cancelOrderClickHandler = (id) => {
        openModal(
            "Are you sure you want to Cancel your order?",
            (<>
                <div className="modal-caption">Once cancelled, you dont get this ordered delivered to you, the money gets refunded within the next 3-7 business days if paid. You can still look up your cancelled orders in here.</div>

                <div className="modal-btn-container">
                    <button onClick={() => closeModal()} className='secondary-btn'>No</button>
                    <button onClick={() => cancelOrderHandler(id)} className='main-btn warning'>Yes</button>
                </div>
            </>)
        );
    }


    return (
        <div className="profile-page-content">

            <Metadata title={"Orders & Returns - ManyIN"} />

            {!gettingMyOrders && (
                <>
                    <div className="profile-page-head">
                        {allStatus[state.status ? state.status : "all"]} orders
                        <div className="profile-page-caption">from {allTimes[state.time ? state.time : "any"]}</div>
                    </div>

                    <div className="orders-container">

                        <div className="orders-search-filters">

                            <form onSubmit={searchOrdersHandler} className='secondary-search-container' >

                                <input
                                    className='secondary-search'
                                    type="text"
                                    spellCheck="false"
                                    placeholder="Search in orders"
                                    onChange={(e) => {
                                        setSearchText(e.target.value)
                                    }}
                                    value={searchText}
                                    ref={inputRef}
                                />

                                <button className='search-icon' type="submit">
                                    <TfiSearch size={13} />
                                </button>
                            </form>

                            <button onClick={filterClickHandler} type='button' className="order-filter-btn">
                                <PiSlidersHorizontalLight />
                                Filters
                            </button>
                        </div>


                        <div className="orders-content">

                            {(myOrders.length > 0) ? (
                                <>
                                    {myOrders.map((order, index) => {

                                        return (
                                            <div key={index} className='order-cards'>

                                                {order.order_items.map((item, ind) => {
                                                    return (
                                                        <div key={ind} className="order-item">
                                                            <div className="order-status-container">
                                                                <Icons status={item.product_status} />
                                                                <div>
                                                                    <p className="order-status">
                                                                        {item.product_status}
                                                                    </p>
                                                                    <p className="order-date">
                                                                        On {formatDate(item.ordered_at.slice(0, 10))}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <Link to={`/product/${item.product}`} className="order-product link" target='_blank'>
                                                                <div className="order-image-container">
                                                                    <img src={item.product_img ? item.product_img : "https://images.unsplash.com/photo-1605236453806-6ff36851218e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1964&q=80"} alt="order-img" />
                                                                </div>

                                                                <div className="order-price-inline">
                                                                    <p className="brand">
                                                                        {item.brand}
                                                                    </p>
                                                                    <p className="name">
                                                                        {item.name.length > 60 ? item.name.slice(0, 60) + "..." : item.name}
                                                                    </p>
                                                                    <p className="quantity">
                                                                        quantity: {item.quantity}
                                                                    </p>
                                                                </div>
                                                            </Link>
                                                        </div>
                                                    )
                                                })}


                                                <div className="order-section">

                                                    <div className="order-section-heading">Price information</div>

                                                    {order.order_items.map((item, index) => {
                                                        return (
                                                            <div key={index} className="price-inline">
                                                                <p>
                                                                    {item.quantity + " x " + (item.name.length > 60 ? item.name.slice(0, 60) + "..." : item.name)}
                                                                </p>

                                                                <p
                                                                    style={{ textDecoration: (item.product_status === "Cancelled") ? "1px line-through" : "none" }}
                                                                >
                                                                    ₹ {item.final_price * item.quantity}
                                                                </p>
                                                            </div>
                                                        )
                                                    })}


                                                    <div className="price-inline">
                                                        <p>Total tax price</p>
                                                        <p
                                                            style={{ textDecoration: (order.order_items.every(item => item.product_status === "Cancelled")) ? "1px line-through" : "none" }}
                                                        >
                                                            ₹ {order.tax_price}
                                                        </p>
                                                    </div>

                                                    <div className="price-inline">
                                                        <p>Shipping cost</p>
                                                        <p
                                                            style={{ textDecoration: (order.order_items.every(item => item.product_status === "Cancelled")) ? "1px line-through" : "none" }}
                                                        >
                                                            ₹ {order.shipping_cost}
                                                        </p>
                                                    </div>

                                                    <div className="total-price">
                                                        <p>Total order price</p>
                                                        <p
                                                            style={{ textDecoration: (order.order_items.every(item => item.product_status === "Cancelled")) ? "1px line-through" : "none" }}
                                                        >
                                                            ₹ {order.total_price}
                                                        </p>
                                                    </div>
                                                </div>


                                                <div className="order-section" style={{ marginTop: "30px" }}>

                                                    <div className="order-section-heading">Delivery Address</div>

                                                    <div className="shipping-details">

                                                        <p className="name">{`${order.delivery_address.first_name} ${order.delivery_address.last_name}  |  ${order.delivery_address.mobile}`}</p>

                                                        {`${order.delivery_address.flat}, ${order.delivery_address.street_address}, ${order.delivery_address.city}, ${order.delivery_address.state}, ${order.delivery_address.zip}`}

                                                    </div>

                                                </div>

                                                {((order.order_items.every(item => (item.product_status === "Processing") || (item.product_status === "Cancelled"))) && (!order.order_items.every(item => (item.product_status === "Cancelled")))) && (
                                                    <div className="cancel-order-section">
                                                        <button
                                                            className='inferior-btn warning'
                                                            type="button"
                                                            onClick={() => cancelOrderClickHandler(order._id)}
                                                        >
                                                            Cancel Order?
                                                        </button>

                                                        <div
                                                            className="custom-tooltip light large"
                                                            data-tooltip="You can cancel your order only when the items in your order are under processing. Once shipped, you cannot cancel your order."
                                                        >
                                                            <BiInfoCircle className='icon' size={17} />
                                                        </div>
                                                    </div>
                                                )}

                                            </div>
                                        )
                                    })}
                                </>
                            ) : (
                                <>
                                    <div className="order-not-found-container">
                                        <img src="/images/order_not_found.svg" alt="order-not-found" />

                                        {totalOrdersCount === 0 ? (
                                            <>
                                                <p className="main">
                                                    You haven't placed any order yet!
                                                </p>
                                                <p className="caption">
                                                    Order section is empty. After placing order, You can track them from here!
                                                </p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="main">
                                                    Sorry! orders not found
                                                </p>
                                                <p className="caption">
                                                    Try using different filter or go to back to orders
                                                </p>
                                            </>
                                        )}

                                    </div>
                                </>
                            )}

                        </div>

                        {(myOrdersCount && myOrdersCount > 6) ? (
                            <Paginate onChange={setPage} total={myOrdersCount} pageSize={6} current={state.page ? state.page : 1} />
                        ) : ""}

                    </div>
                </>
            )}


        </div>

    )
}

export default Orders;


const allStatus = {
    "all": "All",
    "delivered": "Delivered",
    "outForDelivery": "Out for delivery",
    "inTransit": "In transit",
    "shipped": "Shipped",
    "processing": "Processing",
    "cancelled": "Cancelled",
}

const allTimes = {
    "any": "Anytime",
    "last30days": "Last 30 days",
    "last6months": "Last 6 months",
    "last1year": "Last year",
    "before1year": "Before an year",
}
