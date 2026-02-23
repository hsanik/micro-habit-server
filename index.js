require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xwhlkva.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const habitsCollection = client.db("microHabitDB").collection("habits");

app.post('/habits', async (req, res) => {
    const habit = req.body;
    habit.currentCount = 0;
    const result = await habitsCollection.insertOne(habit);
    res.send(result);
});

app.get('/habits', async (req, res) => {
    const result = await habitsCollection.find().sort({ createdAt: -1 }).toArray();
    res.send(result);
});

app.get('/habits/user/:email', async (req, res) => {
    const email = req.params.email;
    const query = { userEmail: email };
    const result = await habitsCollection.find(query).sort({ createdAt: -1 }).toArray();
    res.send(result);
});

app.get('/habits/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await habitsCollection.findOne(query);
    res.send(result);
});

app.patch('/habits/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const updatedDoc = {
        $set: req.body
    };
    const result = await habitsCollection.updateOne(query, updatedDoc);
    res.send(result);
});

app.delete('/habits/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await habitsCollection.deleteOne(query);
    res.send(result);
});

app.get('/', (req, res) => {
    res.send('Micro Habit Server is running');
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

module.exports = app;