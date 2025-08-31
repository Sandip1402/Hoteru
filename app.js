const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const User = require('./models/user.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const wrapAsync = require("./utils/wrapAsync.js");
const expressError = require("./utils/expressError.js");
const validateData = require("./utils/middlewares/validateData.js");
const config = require("./config.js");


const app = express();
const port = config.port;

// connect to database
const MONGO_URL = config.dbUrl;
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

app.use(express.static(path.join(__dirname, "public")));





// test tailwind
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, "views/index.html"));
// });




// APIs

// user registration
app.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        throw new expressError(500, "Registration failed");
    }
});

// user login
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Authentication failed' });
        }
        const token = jwt.sign({ userId: user._id }, 'your-secret-key', {
            expiresIn: '1h',
        });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});







// index route
app.get(["/", "/listings"], wrapAsync(async (req, res) => {
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
    if (mongoose.Types.ObjectId.isValid(id)) {
        const listing = await Listing.findById(id).populate("reviews");
        res.render("listings/show.ejs", { listing });
    } else {
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
app.post("/listings/:id/reviews", validateData, wrapAsync(async (req, res) => {
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
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;
    console.log(reviewId);
    let listing = await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
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


app.use((req, res, next) => {
    next(new expressError(404, "Page Not found"));
})



app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something weng wrong" } = err;
    res.status(statusCode).render("layouts/error.ejs", { message });
})



app.listen(port, () => {
    console.log(`app listening on ${port} port`);
})