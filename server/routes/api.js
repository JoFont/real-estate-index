const router = require("express").Router();
const Property = require("../db/models/Property");

router.get("/properties", (req, res, next) => {
    Property.find({}).then(data => {
        res.send(data);
    }).catch(err => next);
});


module.exports = router;