import React, { useEffect, useState } from 'react'
import '../../Styles/TripList.scss'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { setListings } from '../../redux/state';
import Loader from '../../Components/Loader'
import Navbar from '../../Components/Navbar';
import ListingCard from '../../Components/ListingCard';

// 🔥 Leaflet Imports
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// 🔥 Helper to change map center dynamically
function ChangeView({ center }) {
    const map = useMap();
    map.setView(center, 13);
    return null;
}

const SearchingPage = () => {

    const [loading, setLoading] = useState(true);
    const [position, setPosition] = useState([28.6139, 77.2090]); // default Delhi

    const { search } = useParams();
    const listings = useSelector((state) => state.listings);
    const dispatch = useDispatch();

    // 🔥 Fetch Properties
    const getSearchingProperty = async () => {
        try {
            const response = await fetch(
                `http://localhost:8000/api/v1/properties/search/${search}`
            );

            const data = await response.json();

            dispatch(setListings({ listings: data.listings }));
            setLoading(false);

        } catch (error) {
            console.log("Unable to fetch data", error.message);
        }
    };

    // 🔥 Fetch Coordinates From Backend (LocationIQ)
    const getLocationCoordinates = async () => {
        try {
            const res = await fetch(
                `http://localhost:8000/api/v1/geocode?address=${search}`
            );

            const data = await res.json();

            if (data.lat && data.lon) {
                setPosition([parseFloat(data.lat), parseFloat(data.lon)]);
            }

        } catch (error) {
            console.log("Geocode error:", error.message);
        }
    };

    useEffect(() => {
        getSearchingProperty();
        getLocationCoordinates();
    }, [search]);

    return loading ? <Loader /> : (
        <>
            <Navbar />

            <h1 className="title-list">{search}</h1>

            {/* 🔥 MAP SECTION */}
            <div style={{ height: "400px", marginBottom: "20px" }}>
                <MapContainer center={position} zoom={13} style={{ height: "100%" }}>
                    <TileLayer
                        attribution="&copy; OpenStreetMap contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={position}>
                        <Popup>{search}</Popup>
                    </Marker>
                    <ChangeView center={position} />
                </MapContainer>
            </div>

            {/* 🔥 LISTINGS */}
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