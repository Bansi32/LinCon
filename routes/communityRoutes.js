const express = require('express');
const router = express.Router();
const Community = require('../models/communities');
const { isLoggedIn } = require('../middlewares/authMiddleware');


// Creating Community
router.get('/create-community', isLoggedIn, (req, res) => {
    res.render('createCommunity');
})

router.post('/create-community', isLoggedIn, async (req, res) => {
    
    try {
        const community = {
            name: req.body.name,
            location: req.body.location,
            about: req.body.about
        };

        const newCommunity = await Community.create(community);
        res.redirect("/user/home");
    }

    catch(e) {
        console.log(e);
        res.status(402);
    }
})  

//get all communities listed
router.get('/allCommunities', isLoggedIn, async (req, res) => {
    const communities = await Community.find({});
    res.render('allCommunities', { communities });
});

module.exports = router;