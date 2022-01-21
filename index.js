require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const http = require('http');
const morgan = require('morgan');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const { isLoggedIn } = require('./middlewares/authMiddleware');
const User = require('./models/users');
const Community = require('./models/communities');
const communityRoutes = require('./routes/communityRoutes');
const app = express();
const PORT = process.env.PORT || 4000;
const dbURI = process.env.DBURI;
const mapbGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = "pk.eyJ1IjoiYmFuc2kzMiIsImEiOiJja3lud295bDcyenlxMm5xcGxqY2wzZmdhIn0.LK64bwG40L2utXiEWZhWIQ";
const map=mapbGeocoding({accessToken:mapBoxToken});


const db=mongoose.connect(dbURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("DB is connected"))
    .catch(e => console.log(e));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const authRoutes = require('./routes/authRoutes');

app.get('/', (req, res) => {
    res.render('landing'); 
});

app.use(authRoutes);
app.use(function (req, res, next) {
    res.locals.currentUser = req.user;
    next();
});
app.get('/user/home', isLoggedIn, async (req, res) => {
    const geoData=await map.forwardGeocode({
        query: req.currentUser.location,
        limit:1
    }).send();
    const user=await User.findByIdAndUpdate(req.currentUser._id, {...req.body.currentUser});
    user.geometry = geoData.body.features[0].geometry;
    console.log(user);
    await user.save();
    const communities = await Community.find({}).limit(5);
    //const communities = db.Community.aggregate([{$project:{count:{$size:{"$ifNull":["$members",[]]}}}},{$sort:{"count":-1}}]).limit(3);
    res.render('home', {communities});
});

app.get('/user/home/profile', isLoggedIn, async (req, res) => {
    const user = await User.findById(req.currentUser._id);
    console.log(user);
    res.render('profile',{user}); 
});

app.use(communityRoutes);

app.listen(PORT, () => {
  console.log(`The server is up and running at port ${PORT}`);
});






