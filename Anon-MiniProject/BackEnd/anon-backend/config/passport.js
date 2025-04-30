const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel'); // or your User model

console.log('Initializing Google Strategy...'); // Debugging line


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID, // Using the client ID from .env
  clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Using the client secret from .env
  callbackURL: 'http://localhost:5000/api/auth/google/callback', // The callback URL for Google OAuth
}, async (accessToken, refreshToken, profile, done) => {
  // Check if the user already exists in the database
  const existingUser = await User.findOne({ googleId: profile.id });

  if (existingUser) {
    return done(null, existingUser); // User already exists, log them in
  }

  // Create a new user if they don't exist
  const newUser = new User({
    googleId: profile.id,
    email: profile.emails[0].value,
    name: profile.displayName,
  });

  await newUser.save(); // Save new user to DB
  done(null, newUser); // Proceed to login the user
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => User.findById(id).then(user => done(null, user)));
