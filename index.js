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

const app = express();
const PORT = process.env.PORT || 4000;
const dbURI = process.env.DBURI;

mongoose.connect(dbURI, {
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

app.get('/', isLoggedIn, (req, res) => {

    res.render('home');
})

app.use(authRoutes);

app.listen(PORT, () => {
  console.log(`The server is up and running at port ${PORT}`);
});






