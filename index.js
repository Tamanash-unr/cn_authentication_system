// Get Express and other required packages
const express = require('express');
const cookieParser = require('cookie-parser')
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');

// Setup for Session Cookie
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const MongoStore = require('connect-mongo');

// Setup for Flash Messages
const flash = require('connect-flash');

// Setup for Custom Middleware
const customMware = require('./config/middleware');

// Parsing POST requests
app.use(express.urlencoded());

// Setup Cookie Parser
app.use(cookieParser());

// Setup Express Layout
app.use(expressLayouts);

// Setup the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// Setup Session
app.use(session({
    name: "Auth_System",
    // TODO - Change Secret key before Deployment in Production Mode
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    // Mongo Store is used to store the session cookie in the DB
    store: MongoStore.create({
        client: db.getClient(),
        autoRemove: 'disabled'
    },
    function(err){
        console.log(err || 'connect-mongodb setup ok');
    })
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser)

// Setup for Notifications
app.use(flash());
app.use(customMware.setFlash)

// Use Express Router
app.use('/', require('./routes'))

app.listen(port, function(err){
    if(err){
        console.log(`Error Connecting to Server : ${err}`);
    }

    console.log(`Server is running on port ${port}`);
});