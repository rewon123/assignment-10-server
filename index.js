const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const ObjectId = require('mongodb').ObjectId;


app.use(bodyParser.json())
app.use(cors());

const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()


app.get('/', (req, res) => {
    res.send('Hello World!')
})



const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00.oqqwn.mongodb.net:27017,cluster0-shard-00-01.oqqwn.mongodb.net:27017,cluster0-shard-00-02.oqqwn.mongodb.net:27017/${process.env.DB_NAME}?ssl=true&replicaSet=atlas-eg2ygn-shard-0&authSource=admin&retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const eventsCollection = client.db("volunteer").collection("events");
    const registrations = client.db("volunteer").collection("registrations");

    app.get('/eventsForRegister', (req, res) => {
        eventsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })
    app.get('/register/:id', (req, res) => {
        eventsCollection.find({_id: ObjectId(req.params.id)})
            .toArray((err, documents) => {
                res.send(documents[0])
            })
    })
    app.get('/specificRegistration', (req, res) => {
        registrations.find({ email: req.query.email })
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
    // function for getting the data..
    app.get(`/allUsers`, (req, res) => {
        registrations.find({})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })


    app.post('/AddRegistrations', (req, res) => {
        const registrationsDetails = req.body;
        registrations.insertOne(registrationsDetails)
            .then(result => {
                console.log(result.insertedCount);
                res.send(result.insertedCount > 0)
            })
    })

    app.delete('/deleteRegistration/:id', (req, res) => {
        registrations.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                console.log(result, 'tui are nai');
            })
    })

    app.delete('/deleteUser/:id', (req, res) => {
        registrations.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0);
            })
    })
    app.post('/AddEvent', (req, res) => {
        const eventDetails = req.body;
        eventsCollection.insertOne(eventDetails)
            .then(result => {
                console.log(result.insertedCount);
                res.send(result.insertedCount > 0)
            })
    })
    // it will show on terminal when database is connected successfully
    console.log('connected');

});

app.listen(process.env.PORT)
