const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Load Profile Model
const Profile = require('../../models/Profile');
//Load User Profile
const User = require('../../models/User');

//Load validation
const validateProfileInput = require('../../validation/profile');
const validateExprienceInput = require('../../validation/exprience');
const validateEducationInput = require('../../validation/education');

/* @route   GET api/profile/test  */
/* @desc    Tests profile route */
/* @access  Public */
router.get('/test' , (req , res) => res.json({msg:'profile Works'})) ;


/* @route   GET api/profile  */
/* @desc    Get current user profile */
/* @access  Private */
router.get('/' , passport.authenticate('jwt' , {session:false}) , (req , res) => {
    Profile.findOne({user : req.user.id}).populate('user', ['name' , 'avatar']).then( (profile) => {
        const errors = {};
        if(!profile) {
            errors.noprofile = 'There is no profile for this user';
            return res.status(404).json(errors);
        }
        res.json(profile);
    }).catch((err) => {
        res.status(400).json(err);
    });
});


/* @route   GET api/profile/handle/:handle  */
/* @desc    Get profile by handle*/
/* @access  Public */

router.get('/handle/:handle' , (req , res) => {
    const errors = {};

    Profile.findOne({handle : req.params.handle})
        .populate('user' , ['name' , 'avatar'])
        .then( (profile) => {
            if(!profile) {
                errors.noProfile = 'there is no profile for this user';
                return res.status(404).json(errors);
            }

            res.json(profile);
        }).catch( err => res.status(404).json(err));
});

/* @route   GET api/profile/user/:user_id  */
/* @desc    Get profile by user ID*/
/* @access  Public */

router.get('/user/:user_id' , (req , res) => {
    const errors = {};

    Profile.findOne({user : req.params.user_id})
        .populate('user' , ['name' , 'avatar'])
        .then( (profile) => {
            if(!profile) {
                errors.noProfile = 'there is no profile for this user';
                return res.status(404).json(errors);
            }

            res.json(profile);
        }).catch( err => res.status(404).json({profile : 'There is no profile for this user'}));
});

/* @route   GET api/profile/all  */
/* @desc    Get all the profiles*/
/* @access  Public */
router.get('/all' , (req , res) => {
    const errors = {};

    Profile.find()
        .populate('user' , ['name' , 'avatar'])
        .then( (profiles) => {
            if(!profiles) {
                errors.noProfile = 'there are no profiles';
                return res.status(404).json(error);
            }

            res.json(profiles);
        }).catch( err => res.status(404).json({profiles : 'there are no profiles'}));
});

/* @route   POST api/profile  */
/* @desc    Create or Edit user profile */
/* @access  Private */
router.post('/' , passport.authenticate('jwt' , {session:false}) , (req , res) => {

    const {errors , isValid} = validateProfileInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }
    //Get fields
    const profileFields = {};
    profileFields.user = req.user.id;

    /* initial profile fields */
    if(req.body.handle) profileFields.handle = req.body.handle;
    if(req.body.company) profileFields.company = req.body.company;
    if(req.body.website) profileFields.website = req.body.website;
    if(req.body.location) profileFields.location = req.body.location;
    if(req.body.bio) profileFields.bio = req.body.bio;
    if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;
    if(req.body.status) profileFields.status = req.body.status;

    //Skills - split into array
    if(typeof req.body.skills !== undefined) {
        profileFields.skills = req.body.skills.split(',');
    }

    //Social
    profileFields.social = {};

    if(req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if(req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if(req.body.instagram) profileFields.social.instagram = req.body.instagram;
    if(req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if(req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    
    /* End initial profile fields */

    Profile.findOne({user : req.user.id}).then( (profile) => {
        if(profile) {
            //Update
            Profile.findOneAndUpdate(
                {user:req.user.id} ,
                {$set : profileFields} ,
                {new : true}
            ).then( (profile) =>  res.json(profile) );
        }
        else{
            //Create

            //check if handle exists
            Profile.findOne({handle : req.body.handle}).then( (profile) => {
                if(profile) {
                    errors.handle = 'That handle already exists';
                    return res.status(400).json(errors);
                }

                //save profile
                new Profile(profileFields).save().then( (profile) => res.json(profile));
            });
        }
    });

});

/* @route   POST api/profile/exprience  */
/* @desc    Add Exprience to  user profile */
/* @access  Private */
router.post('/exprience' , passport.authenticate('jwt' , {session : false}) , (req , res) => {
    
    /**if there are validation errors then return those errors */
    const {errors , isValid} = validateExprienceInput(req.body);
    if(!isValid) {
        return res.status(400).json(errors);
    }
      
    Profile.findOne({user : req.user.id}).then( (profile) => {
        const newExp = {
            title : req.body.title ,
            company : req.body.company ,
            from : req.body.from,
            location: req.body.location,
            to : req.body.to ,
            current : req.body.current ,
            description : req.body.description
        };
        
        //Add to first of exprience array
        profile.exprience.unshift(newExp);

        profile.save().then( profile => res.json(profile));
    });
});

/* @route   POST api/profile/education  */
/* @desc    Add Education to  user profile */
/* @access  Private */
router.post('/education' , passport.authenticate('jwt' , {session : false}) , (req , res) => {
    
    /**if there are validation errors then return those errors */
    const {errors , isValid} = validateEducationInput(req.body);
    if(!isValid) {
        return res.status(400).json(errors);
    }
      
    Profile.findOne({user : req.user.id}).then( (profile) => {
        const newEdu = {
            school : req.body.school ,
            fieldofstudy : req.body.fieldofstudy ,
            degree : req.body.degree,
            from : req.body.from,
            location: req.body.location,
            to : req.body.to ,
            current : req.body.current ,
            description : req.body.description
        };
        
        //Add to first of exprience array
        profile.education.unshift(newEdu);

        profile.save().then( profile => res.json(profile));
    });
});

/* @route   DELETE api/profile/exprience/:exp_id  */
/* @desc    DELETE profile exprience */
/* @access  Private */
router.delete('/exprience/:exp_id' , passport.authenticate('jwt' , {session:false}) , (req , res) => {
    
    Profile.findOne({user : req.user.id}).then( (profile) => {
        /**Get remove index */
        const removeIndex = profile.exprience.map( (item) => item.id).indexOf(req.params.exp_id);
        /**splice out of array */
        profile.exprience.splice(removeIndex , 1);
        /**Save */
        profile.save().then( (profile) => res.json(profile)).catch( (err) => res.status(404).json(err));
    });
});

/* @route   DELETE api/profile/education/:edu_id  */
/* @desc    DELETE profile education */
/* @access  Private */
router.delete('/education/:edu_id' , passport.authenticate('jwt' , {session:false}) , (req , res) => {
    
    Profile.findOne({user : req.user.id}).then( (profile) => {
        /**Get remove index */
        const removeIndex = profile.education.map( (item) => item.id).indexOf(req.params.edu_id);
        /**splice out of array */
        profile.education.splice(removeIndex , 1);
        /**Save */
        profile.save().then( (profile) => res.json(profile)).catch( (err) => res.status(404).json(err));
    });
});

/* @route   DELETE api/profile  */
/* @desc    DELETE profile and User */
/* @access  Private */
router.delete('/' , passport.authenticate('jwt' , {session:false}) , (req , res) => {
    Profile.findOneAndRemove({user : req.user.id}).then( () => {
        User.findOneAndRemove({_id : req.user.id}).then( () => res.json({success : true}));
    });
});

module.exports = router;