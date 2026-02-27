import React, { useEffect, useState } from 'react'
import '../../Styles/TripList.scss'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { setListings } from '../../redux/state';
import Loader from '../../Components/Loader'
import Navbar from '../../Components/Navbar';
import ListingCard from '../../Components/ListingCard';

const SearchingPage = () => {
    const [loading, setLoading] = useState(true);
    const { search } = useParams();
    const listings = useSelector((state) => state.listings);
    const dispatch = useDispatch();

    const getSearchingProperty = async () => {
        try {
            const response = await fetch(
                `http://localhost:3000/api/v1/properties/search/${search}`
            );

            const data = await response.json();

            console.log("API RESPONSE:", data);

            // ✅ FIXED LINE
         dispatch(setListings({ listings: data.listings }));

            setLoading(false);
        } catch (error) {
            console.log("Unable to fetch data", error.message);
        }
    };

    useEffect(() => {
        getSearchingProperty();
    }, [search]);

    return loading ? <Loader /> : (
        <>
            <Navbar />
            <h1 className="title-list">{search}</h1>
            <div className="list">
                {Array.isArray(listings) && listings.map(
                    ({
                        _id,
                        creator,
                        listingPhotoPaths,
                        city,
                        province,
                        country,
                        category,
                        type,
                        price,
                        booking = false,
                    }) => (
                        <ListingCard
                            key={_id}
                            listingId={_id}
                            creator={creator}
                            listingPhotoPaths={listingPhotoPaths}
                            city={city}
                            province={province}
                            country={country}
                            category={category}
                            type={type}
                            price={price}
                            booking={booking}
                        />
                    )
                )}
            </div>
        </>
    );
};

export default SearchingPage;