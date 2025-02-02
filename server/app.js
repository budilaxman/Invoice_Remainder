require("dotenv").config();
require("./db/conn");
const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 6005;
const session = require("express-session");
const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const userdb = require("./model/userSchema");

const invoiceRoutes = require("./invoices/invoice.routes");

const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}));

app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 60 * 60 * 1000 } // One hour session timeout
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new OAuth2Strategy({
    clientID,
    clientSecret,
    callbackURL: "http://localhost:6005/auth/google/callback",
    scope: ["email", "profile"]
}, async (accessToken, refreshToken, profile, done) => {
    console.log("Profile Received:", profile);

    try {
        let user = await userdb.findOne({ googleId: profile.id });

        if (!user) {
            user = new userdb({  //  FIX: Use "new userdb" instead of "userdb.create()"
                googleId: profile.id,
                displayName: profile.displayName,
                email: profile.emails[0].value,
                image: profile.photos[0].value
            });
            await user.save();  //  FIX: Ensure `user.save()` is called
            console.log("New User Created:", user);
        } else {
            console.log("User Already Exists:", user);
        }

        return done(null, user);
    } catch (error) {
        console.error("Error Saving User:", error);
        return done(error, null);
    }
}));


passport.serializeUser((user, done) => {
    done(null, user.id); //  Serialize only user ID
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await userdb.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

app.get("/auth/google", passport.authenticate("google", { scope: ["email", "profile"] }));

app.use("/api/invoices", invoiceRoutes);

app.get("/auth/user", (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ email: req.user.email, displayName: req.user.displayName, image: req.user.image });
    } else {
        res.status(401).json({ message: "Not logged in" });
    }
});

app.get("/auth/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: "Logout failed" });
        }
        res.clearCookie("connect.sid", { path: "/" }); // Adjust cookie name if different
        return res.json({ message: "Logged out successfully" });
    });
});
app.get("/auth/logout", (req, res) => {
    res.clearCookie("token", { path: "/" });
    return res.json({ message: "Logged out successfully" });
});


app.get("/auth/google/callback",
    passport.authenticate("google", {
        successRedirect: "http://localhost:3000/dashboard",
        failureRedirect: "http://localhost:3000/login"
    })
);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
