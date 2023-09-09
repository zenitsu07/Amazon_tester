const mongoose = require('mongoose');

exports.Connection = async (username, password) => {
    //connecting URL from mongodb site
    const URL = `mongodb://${username}:${password}@ac-khixnvr-shard-00-00.mmh7usl.mongodb.net:27017,ac-khixnvr-shard-00-01.mmh7usl.mongodb.net:27017,ac-khixnvr-shard-00-02.mmh7usl.mongodb.net:27017/?ssl=true&replicaSet=atlas-7nj9l0-shard-0&authSource=admin&retryWrites=true&w=majority`;
    try {
        //function is passed as the 2nd argument to parse the passed URL to the connect function as the previous URL format gets deprecated now
        await mongoose.connect(URL, { useNewUrlParser: true });
        console.log("Database connected successfully");
    } catch (error) {
        console.log("Error in connecting to the database", error);
    }
};
