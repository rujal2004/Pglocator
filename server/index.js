const express = require('express');
const app = express();
require('dotenv').config();
const connectDB = require('./connectDB/connect');
const cors = require('cors');
const axios = require('axios');

const authRoutes = require('./Routes/authRoutes');
const PageListingRoutes = require('./Routes/PageListingRoute');
const BookingRoute = require('./Routes/BookingRoute');
const UserRoute = require('./Routes/UserRoute');
const GeocodeRoute = require('./Routes/GeocodeRoute');  // ✅ Added

app.use(cors());
app.use(express.json());
app.use(express.static('./public'));

// test route
app.get('/test', (req, res) => {
    res.send("Hlo I am Test route");
});

// existing routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/properties', PageListingRoutes);
app.use('/api/v1/bookings', BookingRoute);
app.use('/api/v1/users', UserRoute);

// ✅ NEW GEOCODE ROUTE
app.use('/api/v1/geocode', GeocodeRoute);

const port = process.env.PORT || 3000;   // ✅ Fixed

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port, () =>
            console.log(`Server Running at http://localhost:${port}`)
        );
    } catch (error) {
        console.error("Not connected to database:", error);
    }
};

start();