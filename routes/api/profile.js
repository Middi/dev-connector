const express = require('express');

const router = express.Router();

// get api/profile/test
// tests profile route
// public
router.get('/test', (req, res) => res.json({msg: "profile works"}));



module.exports = router;