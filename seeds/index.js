const mongoose = require("mongoose");
const CampGround = require("../models/campground");
const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

const sample = (array) => array[Math.floor(Math.random() * array.length)]


const seedDB = async () => {
    await CampGround.deleteMany({})
    for (let i = 0; i < 300; i++) {
        const randomCity = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const newCamp = new CampGround({
            author: "68790f7af6eac24bf62661b6",
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[randomCity].city}, ${cities[randomCity].state}`,
            description: "description",
            price: price,
            geometry: { 
                type: 'Point', 
                coordinates: [ cities[randomCity].longitude, cities[randomCity].latitude ] 
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dskzdyptk/image/upload/v1754027396/YelpCamp/npwndmkbmlguxajbzzds.png',
                    filename: 'YelpCamp/npwndmkbmlguxajbzzds'
                },
                {
                    url: 'https://res.cloudinary.com/dskzdyptk/image/upload/v1754027397/YelpCamp/zsz3ym5wsc5jy0b3djze.jpg',
                    filename: 'YelpCamp/zsz3ym5wsc5jy0b3djze'
                }
            ]
        });
        await newCamp.save();
    }
}

seedDB()
    .then(() => {
        mongoose.connection.close()
    })