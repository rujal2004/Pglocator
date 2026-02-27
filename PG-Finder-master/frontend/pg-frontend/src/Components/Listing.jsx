import React, { useEffect, useState } from 'react';
import '../Styles/Listing.scss';
import { categories } from '../catDB';
import Loader from './Loader';
import ListingCard from './ListingCard';
import { useSelector, useDispatch } from 'react-redux';
import { setListings } from '../redux/state';

const Listing = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // ✅ Safe selector (no crash, no new array reference)
  const listings = useSelector((state) => state.user?.listings);
  const safeListings = Array.isArray(listings) ? listings : [];

  const getFeedListings = async () => {
    try {
      const response = await fetch(
        selectedCategory !== "All"
          ? `http://localhost:3000/api/v1/properties?category=${selectedCategory}`
          : "http://localhost:3000/api/v1/properties"
      );

      const data = await response.json();

      console.log("API RESPONSE:", data);

      // Backend returns { success: true, listings: [] }
      dispatch(setListings({ listings: data.listings }));

      setLoading(false);
    } catch (error) {
      console.log("Fetching Listing Failed:", error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getFeedListings();
  }, [selectedCategory]);

  return (
    <>
      <div className="category-list">
        {categories?.map((category, index) => (
          <div
            className={`category ${
              category.label === selectedCategory ? "selected" : ""
            }`}
            key={index}
            onClick={() => setSelectedCategory(category.label)}
          >
            <div className="category_icon">{category.icon}</div>
            <p>{category.label}</p>
          </div>
        ))}
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="listings">
          {safeListings.length === 0 ? (
            <p>No properties found</p>
          ) : (
            safeListings.map(({
              _id,
              creator,
              listingPhotoPaths,
              city,
              province,
              country,
              category,
              type,
              price,
              booking = false
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
            ))
          )}
        </div>
      )}
    </>
  );
};

export default Listing;