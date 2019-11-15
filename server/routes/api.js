const express = require("express");
const Property = require("../db/models/Property");

const router = express.Router();

router.get("/properties", (req, res, next) => {
    Property.find({}).then(data => {
        res.send(data);
    });
});


module.exports = router;