const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
// load Validation
const validateProfileInput = require('../../validation/profile');

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
        .populate('user', ['name', 'avatar'])
        .then(profile => {
            if(!profile) {
                errors.noprofile = 'There is no profile for this user';
                return res.status(404).json(errors);
            }
            res.json(profile);
        })
        .catch(err => res.status(404).json(err));
});


// post api/profile
// create or edit user profile route
// private
router.post('/', passport.authenticate('jwt', {session:false}), (req, res) => {
    const {errors, isValid} = validateProfileInput(req.body);

    //check validation
    if(!isValid) {
        //return any errors
        return res.status(400).json(errors);
    }
    // get fields
    const profileFields = {};
    profileFields.user = req.user.id;

    if(req.body.handle) profileFields.handle = req.body.handle;
    if(req.body.company) profileFields.company = req.body.company;
    if(req.body.website) profileFields.website = req.body.website;
    if(req.body.location) profileFields.location = req.body.location;
    if(req.body.bio) profileFields.bio = req.body.bio;
    if(req.body.status) profileFields.status = req.body.status;
    if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;

    // skills - split into array
    if(typeof req.body.skills !== 'undefined') {
        profileFields.skills = req.body.skills.split(',');
    }

    // Social
    profileFields.social = {};
    if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if(req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({user:req.user.id})
        .then(profile => {
            if(profile) {
                //update
                Profile.findOneAndUpdate({user: req.user.id}, {$set: profileFields}, {new: true})
                .then(profile => res.json(profile))
            }
            else {
                // create

                // check if handle exists
                Profile.findOne({handle: profileFields.handle})
                    .then(profile => {
                        if(profile) {
                            errors.handle = 'That handle already exists';
                            res.status(400).json(errors);
                        }

                        // save profile
                        new Profile(profileFields).save().then(profile => res.json(profile));
                    })
            }
        })
});

module.exports = router;