const mongoose = require("mongoose");
const Listing = require("../models/listing.js");

const initData = require("./data.js");
const config = require("../config.js");

// connect to database
const DB_URL = config.dbUrl;
async function main(){
    await mongoose.connect(DB_URL);
}

main().then(() => {
    console.log("connected to database");
}).catch((err) => {
    console.log(err);
    console.log("error connecting to database");
})

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
}
initDB();



// Tests
// app.get("/testListing", async (req,res) => {
//     let listing = new Listing({
//         title : "My New Villa",
//         desc : "By the beach",
//         price : 1200,
//         location : "New Digha",
//         country : "India"
//     })
    
//     await listing.save();
//     console.log("saved in db");
//     res.send("Listing Test successful");
// })