const mongoose = require('mongoose');
require('dotenv').config();
const Offer = require('./src/models/Offer');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        const offers = await Offer.find({ isActive: true });
        console.log("Active offers in DB:", offers.length);
        console.log(offers);
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
