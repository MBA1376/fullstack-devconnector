const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//Post Model
const Post = require('../../models/Post');

//Profile Model
const Profile = require('../../models/Profile');


//Load validations
const validatePostInput = require('../../validation/post');

/* @route   GET api/posts/test  */
/* @desc    Tests post route */
/* @access  Public */
router.get('/test' , (req , res) => res.json({msg:'Posts Works'})) ;

/* @route   GET api/posts  */
/* @desc    GET Posts */
/* @access  Public */
router.get('/' , (req , res) => {
    Post.find().sort({date : -1})
        .then( posts => res.json(posts))
        .catch(err => res.status(404).json({nopostsfound : 'no posts found'}));
});


/* @route   GET api/posts/:id  */
/* @desc    GET Post by id */
/* @access  Public */
router.get('/:id' , (req , res) => {
    Post.findById(req.params.id)
        .then( post => res.json(post))
        .catch( err => res.status(404).json({nppostfound : 'no post found with that id'}));
});

/* @route   POST api/posts  */
/* @desc    create post */
/* @access  Private */
router.post('/' , passport.authenticate('jwt' , {session : false}) , (req , res) => {
    //validation
    const { errors , isValid } = validatePostInput(req.body);
    if(!isValid) {
        return res.status(400).json(errors);
    }

    const newPost = new Post({
        text : req.body.text ,
        name : req.body.name ,
        avatar : req.body.avatar ,
        user : req.user.id
    });

    newPost.save().then( post => res.json(post));
});

/* @route   DELETE api/posts/:id  */
/* @desc    DELETE Post */
/* @access  Private */
router.delete('/:id' , passport.authenticate('jwt' , {session : false}) , (req , res) => {
    Profile.findOne({user : req.user.id}).then( profile => {
        Post.findById(req.params.id).then( (post) => {
            if(post.user.toString() !== req.user.id) {
                return res.status(401).json({notauthorized : 'user not authorized'});
            }

            post.remove().then( () => res.json({success : true}))
                .catch( err => res.status(404).json({postnotfound : 'No post found'}));
        })
    })
});

/* @route   POST api/posts/like/:id  */
/* @desc    Like Post */
/* @access  Private */
router.post('/like/:id' , passport.authenticate('jwt' , {session : false}) , (req , res) => {
    Profile.findOne({user : req.user.id}).then( profile => {
        Post.findById(req.params.id).then( (post) => {
            if(post.likes.filter( like => like.user._id.toString() === req.user.id).length > 0) {
                return res.status(400).json({alreadyliked : 'user already liked this post'});
            }

            /**add user id to likes array */
            post.likes.unshift({user : req.user.id});
            
            /**save changes to database */
            post.save().then( post => res.json(post)).catch( err => res.status(404).json({postnotfound : 'no post found'}));
        })
    })
});


/* @route   POST api/posts/unlike/:id  */
/* @desc    Unlike Post */
/* @access  Private */
router.post('/unlike/:id' , passport.authenticate('jwt' , {session : false}) , (req , res) => {
    Profile.findOne({user : req.user.id}).then( profile => {
        Post.findById(req.params.id).then( (post) => {
            if(post.likes.filter( like => like.user._id.toString() === req.user.id).length === 0) {
                return res.status(400).json({notliked : 'you have not liked this post'});
            }

            /**get remove index */            
            const removeIndex = post.likes
                .map( item => item.user.toString())
                .indexOf(req.user.id);

            /**splice out of array */
            post.likes.splice(removeIndex , 1);

            /**save changes to database */
            post.save().then( post => res.json(post));
        })
    })
});



/* @route   POST api/posts/comment/:id  */
/* @desc    Add a comment to a Post */
/* @access  Private */
router.post('/comment/:id' , passport.authenticate('jwt' , {session:false}) , (req , res) => {
    //validation
    const { errors , isValid } = validatePostInput(req.body);
    if(!isValid) {
        return res.status(400).json(errors);
    }

    Post.findById(req.params.id).then( post => {
        const newComment = {
            text : req.body.text ,
            name : req.body.name ,
            avatar : req.body.avatar ,
            user : req.user.id
        };

        /**Add comment to comments array */
        post.comments.unshift(newComment);

        /**save to database */
        post.save().then( post => res.json(post)).catch( err => res.status(404).json({postnotfound : 'No post found'}));
    });
});


/* @route   DELETE api/posts/comment/:id/comment_id  */
/* @desc    Delete a comment from a Post */
/* @access  Private */
router.delete('/comment/:id/:comment_id' , passport.authenticate('jwt' , {session:false}) , (req , res) => {
    //validation
    // const { errors , isValid } = validatePostInput(req.body);
    // if(!isValid) {
    //     return res.status(400).json(errors);
    // }

    Post.findById(req.params.id).then( post => {
        /**check to see if comment exists */
        if(post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
            return res.status(404).json({commentnotexist : 'comment does not exist'});
        }

        /**get remove index */
        const removeIndex = post.comments
            .map( comment => comment._id.toString()).
            indexOf(req.params.comment_id);
        
        post.comments.splice(removeIndex , 1);

        /**save to database */
        post.save().then( post => res.json(post)).catch( err => res.status(404).json({postnotfound : 'No post found'}));

    });
});

module.exports = router;