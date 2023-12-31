import React, { useEffect, useRef, useState } from 'react'
import IconSearch from '@tabler/icons-react/dist/esm/icons/IconSearch';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';

const SearchBar = () => {

    const { keyword } = useSelector((state)=> state.urlParams);

    const [ searchText, setSearchText ] = useState("");
    const inputRef = useRef(null);

    const navigate = useNavigate();
    const location = useLocation();

    const handleSearchHandler = (e) => {
        e.preventDefault();
        if(searchText.trim()){
            if(location.pathname !== `/${searchText}`){
                navigate(`/search?keyword=${encodeURIComponent(searchText)}`, { replace: false });
            }
            inputRef.current.blur();
        }
    }

    useEffect(()=>{
        setSearchText(keyword);
    }, [ keyword ])

    return (
        <form onSubmit={handleSearchHandler} className='searchbar-container'>
            <input
                type="text"
                className="search"
                id="search"
                spellCheck="false"
                placeholder="Search anything here..."
                onChange={(e)=>{
                    setSearchText(e.target.value)
                }}
                value={searchText}
                ref={inputRef}
            />

            <button type="submit" className="search-toggle" >
                <IconSearch color='black' size={22} strokeWidth={1.25} />
            </button>
        </form>
    )
}

export default SearchBar
