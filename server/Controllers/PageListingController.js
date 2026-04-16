const axios = require("axios");
const PageListingSchema = require("../modals/PageListingSchema");

/*** CREATE LISTING ***/
const createListing = async (req, res) => {
    console.log("createListing API HIT");

    try {
        const {
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

        // ✅ ALWAYS TRUST JWT
        const creatorId = req.user.userId;

        const listingPhotos = req.files;

        if (!listingPhotos || listingPhotos.length === 0) {
            return res.status(400).json({
                success: false,
                msg: "No file uploaded"
            });
        }

        const listingPhotoPaths = listingPhotos.map((file) => file.path);

        const fullAddress = `${streetAddress}, ${city}, ${province}, ${country}`;

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

        const newListing = new PageListingSchema({
            creator: creatorId,   // ✅ FIXED
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

/*** GET ALL LISTINGS ***/

const getAllListingProperty = async (req, res) => {
    try {
        const { category } = req.query;   // 🔥 get from query

        let filter = {};

        if (category) {
            filter.category = { $regex: category, $options: "i" }; // 🔥 apply filter
        }

        const listings = await PageListingSchema
            .find(filter)
            .populate("creator");

        res.status(200).json({
            success: true,
            listings
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
/*** GET SINGLE LISTING ***/
const getSingleProperty = async (req, res) => {
    try {
        const { listingId } = req.params;

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
        res.status(404).json({ error: error.message });
    }
};

/*** SEARCH LISTING ***/
const searchProperty = async (req, res) => {
    try {
        const { search } = req.params;

        const listings = await PageListingSchema.find({
            $or: [
                { title: { $regex: search, $options: "i" } },
                { city: { $regex: search, $options: "i" } }
            ]
        }).populate("creator");

        res.status(200).json({
            success: true,
            listings
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createListing,
    getAllListingProperty,
    getSingleProperty,
    searchProperty
};