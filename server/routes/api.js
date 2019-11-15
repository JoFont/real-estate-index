const express = require("express");

const router = express.Router();

router.get("/properties", (req, res, next) => {
    res.send({type: "GET", code: "200", status: "OK"});
});


// router.get("/uptime", (req, res, next) => {

// });

module.exports = router;