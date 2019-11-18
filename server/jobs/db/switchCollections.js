const MongoClient = require('mongodb').MongoClient;

switchCollections = async (coll1, coll2) => {
    // Connection URL
    const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/heroku_m0q245mq';
    // Database Name
    const dbName = 'heroku_m0q245mq';
    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true});
    
    try {
        // Use connect method to connect to the Server
        await client.connect();
        
        const db = client.db(dbName);
        const [task1, task2] = await Promise.all([
            db.renameCollection(coll1, `old${coll1}`),
            db.renameCollection(coll2, coll1)
        ]);
        await db.dropCollection(`old${coll1}`);

    } catch (err) {
        console.log(err.stack);
    }
    
    client.close();
    return `Successful Migration of ${coll2} to ${coll1}`;
}

module.exports = switchCollections;