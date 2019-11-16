const MongoClient = require('mongodb').MongoClient;

switchCollections = async (coll1, coll2) => {
    // Connection URL
    const url = 'mongodb://heroku_m0q245mq:j8i28nooppt0rcb9prnvg15n4r@ds039078.mlab.com:39078/heroku_m0q245mq';
    // Database Name
    const dbName = 'heroku_m0q245mq';
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true});
    
    try {
        // Use connect method to connect to the Server
        await client.connect();
        
        const db = client.db(dbName);
        const [task1, task2] = await Promise.all([
            db.renameCollection(coll1, "oldproperties"),
            db.renameCollection(coll2, "properties")
        ]);
        await db.dropCollection("oldproperties");

    } catch (err) {
        console.log(err.stack);
    }
    
    client.close();
    return "Success, Db Migration successful";
}

module.exports = switchCollections;