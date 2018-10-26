const express = require('express');

const router = express.Router();

// get api/posts/test
// tests post route
// public
router.get('/test', (req, res) => res.json({msg: "posts works"}));

module.exports = router;