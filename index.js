const express = require("express");
require('dotenv').config()
const ObjectId = require("mongodb").ObjectId;
var cors = require('cors')
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())

// mongodb (user: Genius-Car-Mechanic ,password :tBpO5F8zsT6BRLXE )
const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.w2qch.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("Genius-Car-Mechanic");
        const servicesCollection = database.collection("services");
        // create a document to insert post method
        app.post("/services", async (req, res) => {
            const newService = req.body;
            const result = await servicesCollection.insertOne(newService);
            console.log("hitting the post method", req.body);
            res.json(result);
        })

        // load data from database by find 
        app.get("/services", async (req, res) => {
            const cursor = servicesCollection.find({})
            const services = await cursor.toArray()
            res.send(services);
        })

        // load single data 
        app.get("/services/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const service = await servicesCollection.findOne(query)
            res.json(service)

        })



        //delete single data
        app.delete("/services/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await servicesCollection.deleteOne(query);
            res.json(result);
        })

    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Hello node..How are you?")
})


// check 
app.get("/hello", async (req, res) => {
    res.send("hello check update here")
})

app.listen(port, () => {
    console.log("listening localhost port", port);
})