const express = require("express");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;
const server = express();

//Set up default mongoose connection
const mongoDB = 'mongodb://heroku_m0q245mq:j8i28nooppt0rcb9prnvg15n4r@ds039078.mlab.com:39078/heroku_m0q245mq';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

const serverStatus = () => {
    return { 
        state: 'up', 
        dbState: mongoose.STATES[mongoose.connection.readyState] 
    }
};

// Api route handling
server.use("/api", require("./routes/api"));

// Uptime
api.use('/api/uptime', require('express-healthcheck')({
    healthy: serverStatus   
}));

// Error handling
server.use((err, req, res, next) => {
    res.status(422).send({
        Code: 422,
        Status: "Unprocessable Entity",
        Error: err.message
    });
});

server.listen(PORT, () => {
    console.log(`Server listening on Port: ${PORT}`);
});