import React, { useState, useEffect } from "react";
import "../../Styles/TripList.scss";
import Navbar from "../../Components/Navbar";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setListings } from "../../redux/state";
import Loader from "../../Components/Loader";
import ListingCard from "../../Components/ListingCard";

const CategoryPage = () => {
  const [loading, setLoading] = useState(true);
  const { category } = useParams();

  const dispatch = useDispatch();
  const listings = useSelector((state) => state.listings);

  const getFeedListings = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/properties?category=${category}`,
        {
          method: "GET",
        }
      );

      const data = await response.json();

      dispatch(setListings({ listings: data.listings }));

      setLoading(false);
    } catch (err) {
      console.log("Fetch Listings Failed", err.message);
    }
  };

  useEffect(() => {
    getFeedListings();
  }, [category]);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">{category} listings</h1>

      <div className="list">
        {listings?.length > 0 ? (
          listings.map((item) => (
            <ListingCard
              key={item._id}   // 🔥 FIX: added key
              listingId={item._id}
              creator={item.creator}
              listingPhotoPaths={item.listingPhotoPaths}
              city={item.city}
              province={item.province}
              country={item.country}
              category={item.category}
              type={item.type}
              price={item.price}
              booking={item.booking || false}
            />
          ))
        ) : (
          <h2>No listings found</h2>   // 🔥 helpful fallback
        )}
      </div>
    </>
  );
};

export default CategoryPage;