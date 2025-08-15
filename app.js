const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");


const app = express();
const port = 8080;

// connect to database
const MONGO_URL = "mongodb://127.0.0.1:27017/hoteru";
async function main() {
    await mongoose.connect(MONGO_URL);
}

main().then(() => {
    console.log("connected to database");
}).catch((err) => {
    console.log(err);
    console.log("error connecting to database");
})

// ejs setting
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));

app.engine("ejs", ejsMate);

app.use(express.static(path.join(__dirname, "/public")));






// validate list
const validateData = (req, res, next) => {
    if (!req.body) {
        throw new expressError(400, "Request body is missing");
    }

    let schema;

    if (req.path.includes("/reviews")) {
        schema = reviewSchema;
    } else if (req.path === "/listings") {
        schema = listingSchema;
    }

    if (schema) {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errMsg = error.details.map(el => el.message).join(", ");
            throw new expressError(400, errMsg);
        }
    }

    next();
};



// APIs

    // Home route
app.get("/", (req, res) => {
    res.send("Home");
})



// index route
app.get("/listings", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}))



// new listing route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
})
// create new listing
app.post("/listings", validateData, wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save()

    res.redirect("/listings");
})
)



// show route
app.get("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    if(mongoose.Types.ObjectId.isValid(id)){
        const listing = await Listing.findById(id).populate("reviews");
        res.render("listings/show.ejs", { listing });
    }else{
        throw new expressError(404, "Page Not found");
    }
}))



// update listing route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
}))
// update listing
app.put("/listings/:id", validateData, wrapAsync(async (req, res) => {
    // if(!req.body.listing){
    //     throw new expressError(400, "Send valid data for listing");
    // }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect("/listings");
}))



// add Review Route
app.post("/listings/:id/reviews", validateData, wrapAsync(async (req,res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();

    console.log(`New review saved for ${listing.title}`);
    res.redirect(`/listings/${req.params.id}`);
})
)



// Delete review route
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req,res)=>{
    let {id, reviewId} = req.params;
    console.log(reviewId);
    let listing = await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});
    let review = await Review.findByIdAndDelete(reviewId);

    console.log(`Review Deleted for ${listing.title}`);
    console.log("--------------------------------------")
    console.log(review);

    res.redirect(`/listings/${id}`);
}   
))



// Delete Route
app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}))



app.use((req,res,next) => {
    next(new expressError(404, "Page Not Found"));
})



app.use((err, req, res, next) => {
    let { statusCode=500, message="Something weng wrong" } = err;
    res.status(statusCode).render("error.ejs", {message});
    // res.status(statusCode).send(message);
    // res.send("Something went wrong");
})



app.listen(port, () => {
    console.log(`app listening on ${port} port`);
})