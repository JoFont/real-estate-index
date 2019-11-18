require('dotenv').config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const scraper = require("./jobs/scraper/scraper");

const PORT = process.env.PORT || 3000;
const server = express();

//Set up default mongoose connection
const mongoDB = process.env.MONGODB_URI || 'mongodb://localhost:27017/heroku_m0q245mq';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

const serverStatus = () => {
    return { 
        state: 'up', 
        dbState: mongoose.STATES[mongoose.connection.readyState] 
    }
};

//! Serve Svelte Front End
server.use(express.static(path.join(__dirname, '../public/dist')));

server.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/dist/index.html'));
});

//! Api route handling
server.use("/api", require("./routes/api"));

// Uptime
server.use('/api/uptime', require('express-healthcheck')({
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



// Run Scraper
// scraper.scrape();