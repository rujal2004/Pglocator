import React, { useEffect, useState } from "react";
import "../../Styles/TripList.scss";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../../Components/Navbar";
import ListingCard from "../../Components/ListingCard";
import { setPropertyList } from "../../redux/state";
import Loader from '../../Components/Loader';

const PropertyList = () => {

  const [loading, setLoading] = useState(true);

  const user = useSelector((state) => state.user);
  const propertyList = user?.propertyList || []; // ✅ FIX

  const dispatch = useDispatch();

  const getPropertyList = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8000/api/v1/users/${user._id}/properties`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log(data);

      dispatch(setPropertyList(data.properties)); // ✅ correct

      setLoading(false);

    } catch (err) {
      console.log("Fetch all properties failed", err.message);
    }
  };

  useEffect(() => {
    if (user?._id) {   // ✅ VERY IMPORTANT
      getPropertyList();
    }
  }, [user]);

  return loading ? <Loader /> : (
    <>
      <Navbar />
      <h1 className="title-list">Your Property List</h1>

      <div className="list">
        {propertyList.length > 0 ? (
          propertyList.map((item) => (
            <ListingCard
              key={item._id}  // ✅ IMPORTANT
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
          <h2>No properties found</h2>
        )}
      </div>
    </>
  );
};

export default PropertyList;