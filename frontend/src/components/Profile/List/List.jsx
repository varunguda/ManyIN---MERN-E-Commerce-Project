import React, { useContext, useEffect, useState } from 'react';
import "./List.css";
import ListProductCard from '../../elements/Cards/ListProductCard';
import { useDispatch, useSelector } from 'react-redux';
import { loaderSpin } from '../../../State/action-creators/LoaderActionCreator';
import { emptyListItems, getListItems, getListProducts } from '../../../State/action-creators/UserActionCreators';
import { toast } from 'react-toastify';
import { ModalContext } from '../../../Context/ModalContext';
import { EMPTY_LIST_ITEMS_RESET } from '../../../State/constants/UserConstants';
import { addToCart } from '../../../State/action-creators/CartActionCreators';
import IconInfo from '@tabler/icons-react/dist/esm/icons/IconInfoCircle';
import IconReload from '@tabler/icons-react/dist/esm/icons/IconReload';


const List = ({ user }) => {

    const { loadingListProducts, listProducts, listProductsError } = useSelector(state => state.listProducts);
    const { deletingListProducts, deletedList, deletedListMessage, deletedListError } = useSelector(state => state.emptyListProducts);
    const { listItems } = useSelector(state => state.listItems);

    const { openModal, closeModal } = useContext(ModalContext);

    const [products, setProducts] = useState({});

    const dispatch = useDispatch();

    useEffect(() => {
        if (!listProducts || (listProducts && listItems && listItems.length !== listProducts.length) || (listProducts && !listProducts.every(prod => listItems && listItems.includes(prod._id)))) {
            dispatch(getListProducts());
        }
        // eslint-disable-next-line
    }, []);
    

    useEffect(() => {
        if(listProducts){
            let updatedProducts = {...products};
            listProducts.forEach((prod) => {
                if(!Object.keys(updatedProducts).includes(prod._id) && prod.stock !== 0){
                    updatedProducts[prod._id] = 1 * prod.final_price;
                }
            });

            Object.keys(updatedProducts).forEach(id => {
                if(!listProducts.some(prod => prod._id === id)){
                    delete updatedProducts[id];
                }
            });

            setProducts(updatedProducts);
        }
        // eslint-disable-next-line
    }, [listProducts]);


    useEffect(() => {
        dispatch({ type: EMPTY_LIST_ITEMS_RESET });
        if (deletedList) {
            dispatch(getListItems());
            dispatch(getListProducts());
        }
        // eslint-disable-next-line
    }, [deletedList]);


    useEffect(() => {
        toast.error((listProductsError || deletedListError), {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
        // eslint-disable-next-line
    }, [listProductsError || deletedListError]);


    useEffect(() => {
        toast.success(deletedListMessage, {
            position: "bottom-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }, [deletedListMessage]);


    useEffect(() => {
        if (loadingListProducts || deletingListProducts) {
            dispatch(loaderSpin(true));
        } else {
            dispatch(loaderSpin(false));
        }
        // eslint-disable-next-line
    }, [loadingListProducts || deletingListProducts]);


    const emptyList = () => {
        closeModal();
        dispatch(emptyListItems());
    }

    const emptyListClickHandler = () => {
        const modalContent = (
            <>
                <div className="modal-caption">All the items in your list will be removed.</div>

                <div className="modal-btn-container">
                    <button onClick={closeModal} className="inferior-btn">Cancel</button>
                    <button onClick={emptyList} className="main-btn">Yes</button>
                </div>
            </>
        );

        openModal("Are you certain you wish to clear your list?", modalContent);
    }


    const addAllToCartHandler = () => {
        if(listProducts && listProducts.length > 0 && Object.keys(products).length
         > 0){
            Object.keys(products).forEach((id) => {
                const product = listProducts.find(prod => prod._id === id);
                dispatch(addToCart(id, Math.round(products[id]/product.final_price)));
            })
        }
    }


    return (
        (!loadingListProducts && listProducts) && (
            <div className="profile-page-content">

                <div className="page-head">{user.name}'s List</div>

                {listProducts && listProducts.length > 0 ? (
                    <>
                        <div className="list-head">
                            {listProducts.length > 0 && listProducts.length} items
                            <IconReload
                                onClick={() => {
                                    dispatch(getListItems());
                                    dispatch(getListProducts());
                                }}
                                size={20}
                                strokeWidth={1.5}
                                className='icon' 
                            />
                        </div>

                        <div className="list-page-container">

                            <section className='products-section'>
                                {listProducts.map((product, index) => {
                                    return (
                                        <ListProductCard
                                            key={index}
                                            product={product}
                                            setTotal={setProducts}
                                        />
                                    )
                                })}
                            </section>

                            <section className='cart-section'>
                                <div className="add-cart-container">
                                    <div>
                                        <div className='price'>
                                            {Object.values(products).reduce((count, price) => count += price ,0)}
                                        </div>
                                        <span>Estimated total</span>
                                        <span
                                            className="custom-tooltip light large"
                                            data-tooltip="This estimated total reflects only the sum of items currently in your list. Please note that the final price in your cart may vary if there are other items already included in the cart."
                                        >
                                            <IconInfo className='icon' size={15} strokeWidth={1.25} />
                                        </span>
                                    </div>

                                    <button 
                                        className="main-btn"
                                        onClick={addAllToCartHandler}
                                    >
                                        Add all to cart
                                    </button>

                                    <button
                                        onClick={emptyListClickHandler}
                                        className="secondary-btn"
                                    >
                                        Empty list
                                    </button>
                                </div>
                            </section>
                        </div>
                    </>
                ) : (
                    <div className="content-not-found-container">
                        <img src="/images/empty_list.svg" alt="list-empty" />
                        <>
                            <p className="main">
                                You don't have any products in your List.
                            </p>
                            <p className="caption">
                                Your product list is currently empty. Try adding some products to your list.
                            </p>
                        </>
                    </div>
                )}
            </div>
        )
    )
}

export default List;
