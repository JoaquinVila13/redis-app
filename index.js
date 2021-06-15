const express = require('express');
const axios = require('axios');
const redis = require('redis');
const app = express();

const redisPort = 6379
const client = redis.createClient({host: '35.232.232.192', port: redisPort});

client.on("error", (err) => {
    console.log(err);
});

app.get("/states", (req, res) => {
    const searchTerm = req.query.search;
    try {
        client.get(searchTerm, async (err, states) => {
            if (err) throw err;
    
            if (states) {
                res.status(200).send({
                    states: JSON.parse(states),
                    message: "data retrieved from the cache"
                });
            } else {
                const states = await axios.get(`https://corona.lmao.ninja/v2/states?search=${searchTerm}`);
                client.setex(searchTerm, 600, JSON.stringify(states.data));
                res.status(200).send({
                    states: states.data,
                    message: "cache miss"
                });
            }
        });
    } catch(err) {
        res.status(500).send({message: err.message});
    }
});

app.listen(process.env.PORT || 8166, () => {
	console.log("Node server started : 8166");
});