import React, { useEffect } from "react";
import "../../Styles/TripList.scss";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../../Components/Navbar";
import ListingCard from "../../Components/ListingCard";
import { setWishList } from "../../redux/state";

const WishList = () => {

  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const wishList = user?.wishList || []; // ✅ FIXED

  const getWishList = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:8000/api/v1/users/${user._id}/wishlist`, // ✅ FIX ROUTE
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      console.log(data);

      dispatch(setWishList(data.wishList)); // ✅ FIXED

    } catch (err) {
      console.log("Fetch wishlist failed", err.message);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    if (user?._id) {
      getWishList();
    }
  }, [user]);

  return (
    <>
      <Navbar />
      <h1 className="title-list">Your Wish List</h1>

      <div className="list">
        {wishList.length > 0 ? (
          wishList.map((item) => (
            <ListingCard
              key={item._id}
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
          <h2>No items in wishlist</h2> // ✅ better UX
        )}
      </div>
    </>
  );
};

export default WishList;