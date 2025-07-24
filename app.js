const express = require("express");
const mongoose = require("mongoose");

const Listing = require("./models/listing.js");


const app = express();
const port = 8080;

// connect to database
const MONGO_URL = "mongodb://127.0.0.1:27017/hoteru";
async function main(){
    await mongoose.connect(MONGO_URL);

}


main().then(() => {
    console.log("connected to database");
}).catch((err) => {
    console.log(err);
    console.log("error connecting to database");
})



// APIs
app.get("/", (req,res) => {
    res.send("Home");
})



// Tests
app.get("/testListing", async (req,res) => {
    let listing = new Listing({
        title : "My New Villa",
        desc : "By the beach",
        price : 1200,
        location : "New Digha",
        country : "India"
    })
    
    await listing.save();
    console.log("saved in db");
    res.send("Listing Test successful");
})


app.listen(port, () => {
    console.log(`app listening on ${port} port`);
})