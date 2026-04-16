const BookingSchema = require("../modals/BookingSchema");
const UserSchema = require("../modals/UserSchema");
const PageListingSchema = require("../modals/PageListingSchema");

/*** GET ALL TRIPS LIST ***/
const getAllTrips = async (req, res) => {
  try {
    const { userId } = req.params;

    // ✅ FIXED
    if (req.user.userId.toString() !== userId.toString()) {
      return res.status(403).json({ msg: "Unauthorized access" });
    }

    const trips = await BookingSchema.find({
      customerId: userId,
    }).populate("customerId hostId listingId");

    res.status(200).json({ success: true, trips });
  } catch (error) {
    res.status(404).json({
      success: false,
      msg: "Unable to fetch trips",
      error: error.message,
    });
  }
};

/*** ADD ITEM IN WISHLIST ***/
const addToWhisList = async (req, res) => {
  try {
    const { userId, listingId } = req.params;

    // ✅ FIXED
    if (req.user.userId.toString() !== userId.toString()) {
      return res.status(403).json({ msg: "Unauthorized access" });
    }

    const user = await UserSchema.findById(userId);
    const listing = await PageListingSchema.findById(listingId);

    const exists = user.whishList.find(
      (item) => item.toString() === listingId
    );

    if (exists) {
      user.whishList = user.whishList.filter(
        (item) => item.toString() !== listingId
      );

      await user.save();

      return res.status(200).json({
        success: true,
        msg: "Removed from wishlist",
        whishList: user.whishList,
      });
    }

    user.whishList.push(listingId);
    await user.save();

    res.status(200).json({
      success: true,
      msg: "Added to wishlist",
      whishList: user.whishList,
    });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
};

/* GET PROPERTY LIST */
const getAllPropety = async (req, res) => {
  try {
    const { userId } = req.params;

    console.log("🔵 PARAM USER ID:", userId);
    console.log("🟢 TOKEN USER ID:", req.user.userId);

    // 🔥 CHECK ALL DATA IN DATABASE
    const allListings = await PageListingSchema.find();
    console.log("🟡 ALL LISTINGS IN DB:", allListings);

    // 🔥 FILTER DATA
   const mongoose = require("mongoose");

const properties = await PageListingSchema.find({
  creator: new mongoose.Types.ObjectId(userId),
}).populate("creator");

    console.log("🟣 FILTERED PROPERTIES:", properties);

    res.status(200).json({
      success: true,
      properties,
    });

  } catch (err) {
    console.log("❌ ERROR:", err);
    res.status(404).json({
      msg: "Can not find properties!",
      error: err.message,
    });
  }
};

/* GET RESERVATION LIST */
const getAllReservation = async (req, res) => {
  try {
    const { userId } = req.params;

    // ✅ FIXED
    if (req.user.userId.toString() !== userId.toString()) {
      return res.status(403).json({ msg: "Unauthorized access" });
    }

    const reservations = await BookingSchema.find({
      hostId: userId,
    }).populate("customerId hostId listingId");

    // 🔥 FIX RESPONSE
    res.status(200).json({
      success: true,
      reservations,
    });

  } catch (err) {
    res.status(404).json({
      msg: "Can not find reservations!",
      error: err.message,
    });
  }
};

module.exports = {
  getAllTrips,
  addToWhisList,
  getAllPropety,
  getAllReservation,
};