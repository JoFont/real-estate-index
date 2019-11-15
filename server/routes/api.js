const express = require("express");

const router = express.Router();

router.get("/properties", (req, res) => {
    res.send({type: "GET", code: "200", status: "OK"});
});


module.exports = router;