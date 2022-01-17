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
            about: req.body.about,
            location: req.body.location
        };

        const newCommunity = await Community.create(community);
        res.redirect("/home");
    }

    catch(e) {
        console.log(e);
        res.status(402);
    }
})  

module.exports = router;