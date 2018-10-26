const express = require('express');

const router = express.Router();

// get api/users/test
// tests users route
// public
router.get('/test', (req, res) => res.json({msg: "user works"}));

module.exports = router;