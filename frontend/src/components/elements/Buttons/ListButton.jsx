import React, { useEffect, useRef, useState } from 'react'
import { HiHeart, HiOutlineHeart } from 'react-icons/hi2'
import { useDispatch, useSelector } from 'react-redux';
import { getListItems, toggleListItem } from '../../../State/action-creators/UserActionCreators';


const ListButton = ({ product }) => {

    const { listItems } = useSelector(state => state.listItems);

    const [added, setAdded] = useState(false);
    const listInterval = useRef(null);

    const dispatch = useDispatch();

    useEffect(() => {
        if (listItems && listItems.some((prod) => prod.toString() === product)) {
            setAdded(true);
        } else if (listItems && !listItems.some((prod) => prod.toString() === product)) {
            setAdded(false);
        }
        // eslint-disable-next-line
    }, [listItems, product]);
    

    const addToListHandler = () => {
        const exist = !added;
        setAdded(exist);

        clearTimeout(listInterval.current);
        listInterval.current = setTimeout(async() => {
            if((!exist && listItems && listItems.some((prod) => prod.toString() === product)) || (exist && listItems && !listItems.some((prod) => prod.toString() === product))){
                await dispatch(toggleListItem(product));
                dispatch(getListItems());
            }
        }, 700);
    }

    return (
        <>
            <button className='inferior-btn' onClick={addToListHandler}>
                {added ? (
                    <>
                        <HiHeart strokeWidth={1} size={18} color="#e31b23" />Visit List
                    </>
                ) : (
                    <>
                        <HiOutlineHeart strokeWidth={1} size={18} />Add to list
                    </>
                )}
            </button>
        </>
    )
}

export default ListButton;
