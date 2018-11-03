const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// Load models
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// get api/profile/test
// tests profile route
// public
router.get('/test', (req, res) => res.json({msg: "profile works"}));

// get api/profile
// profile route
// private
router.get('/', passport.authenticate('jwt', {session:false}), (req, res) => {
    const errors = {};
    Profile.findOne({user: req.user.id})
        .then(profile => {
            if(!profile) {
                errors.noprofile = 'There is no profile for this user';
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});

module.exports = router;