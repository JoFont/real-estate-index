const express = require("express");

const PORT = process.env.PORT || 3000;
const server = express();

server.use("/api", require("./routes/api"));


server.listen(PORT, () => {
    console.log(`Server listening on Port: ${PORT}`);
});