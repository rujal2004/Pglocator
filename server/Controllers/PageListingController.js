const PageListingSchema = require("../modals/PageListingSchema");
const UserSchema = require("../modals/UserSchema");
const axios = require("axios");

// ======================
// CREATE LISTING
// ======================
const createListing = async (req, res) => {
    console.log("createListing API HIT");

    try {
        const {
            creator,
            category,
            type,
            streetAddress,
            aptSuite,
            city,
            province,
            country,
            guestCount,
            bedroomCount,
            bedCount,
            bathroomCount,
            amenities,
            title,
            description,
            highlight,
            highlightDesc,
            price,
        } = req.body;

        const listingPhotos = req.files;

        if (!listingPhotos || listingPhotos.length === 0) {
            return res.status(400).json({
                success: false,
                msg: "No file uploaded"
            });
        }

        const listingPhotoPaths = listingPhotos.map((file) => file.path);

        // 🔥 1. Create Full Address
        const fullAddress = `${streetAddress}, ${city}, ${province}, ${country}`;
        console.log("Calling LocationIQ for:", fullAddress);
        console.log("LOCATIONIQ_KEY:", process.env.LOCATIONIQ_KEY);

        // 🔥 2. Call LocationIQ API
        const geoResponse = await axios.get(
            "https://us1.locationiq.com/v1/search",
            {
                params: {
                    key: process.env.LOCATIONIQ_KEY,
                    q: fullAddress,
                    format: "json"
                }
            }
        );

        if (!geoResponse.data || geoResponse.data.length === 0) {
            return res.status(400).json({
                success: false,
                msg: "Invalid address. Could not fetch coordinates."
            });
        }

        const latitude = geoResponse.data[0].lat;
        const longitude = geoResponse.data[0].lon;

        console.log("Coordinates:", latitude, longitude);

        // 🔥 3. Save in Database
        const newListing = new PageListingSchema({
            creator,
            category,
            type,
            streetAddress,
            aptSuite,
            city,
            province,
            country,
            guestCount,
            bedroomCount,
            bedCount,
            bathroomCount,
            amenities,
            listingPhotoPaths,
            title,
            description,
            highlight,
            highlightDesc,
            price,
            latitude,
            longitude
        });

        await newListing.save();

        res.status(201).json({
            success: true,
            msg: "Listing successfully created",
            newListing
        });

    } catch (error) {
        console.log("CREATE LISTING ERROR:", error.response?.data || error.message);

        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// ======================
// GET ALL LISTINGS
// ======================
const getAllListingProperty = async (req, res) => {
    const qCategory = req.query.category;

    try {
        let listings;

        if (qCategory) {
            listings = await PageListingSchema
                .find({ category: qCategory })
                .populate("creator");
        } else {
            listings = await PageListingSchema
                .find({})
                .populate("creator");
        }

        res.status(200).json({
            success: true,
            listings
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

// ======================
// GET SINGLE LISTING
// ======================
const getSingleProperty = async (req, res) => {
    const { listingId } = req.params;

    try {
        const listing = await PageListingSchema
            .findById(listingId)
            .populate("creator");

        if (!listing) {
            return res.status(404).json({
                success: false,
                msg: "Listing not found"
            });
        }

        res.status(200).json({
            success: true,
            listing
        });

    } catch (error) {
        res.status(404).json({
            success: false,
            error: error.message
        });
    }
};

// ======================
// SEARCH LISTINGS
// ======================
const searchProperty = async (req, res) => {
    const { search } = req.params;

    try {
        let listings = [];

        if (search === "all") {
            listings = await PageListingSchema.find().populate("creator");
        } else {
            listings = await PageListingSchema.find({
                $or: [
                    { category: { $regex: search, $options: "i" } },
                    { title: { $regex: search, $options: "i" } },
                    { city: { $regex: search, $options: "i" } },
                    { province: { $regex: search, $options: "i" } },
                    { country: { $regex: search, $options: "i" } }
                ]
            }).populate("creator");
        }

        res.status(200).json({
            success: true,
            listings
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

module.exports = {
    createListing,
    getAllListingProperty,
    getSingleProperty,
    searchProperty
};