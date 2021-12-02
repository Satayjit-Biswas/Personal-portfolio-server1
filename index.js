
const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require ('dotenv').config();

const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a744t.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        console.log('Connected to database')
        const database = client.db("Portfo");
        const projectCollection  = database.collection("project");
        // add user
        app.post('/project', async(req,res) => {
            const project = req.body;
            const result = await projectCollection.insertOne(project);
            res.json('project added')
        })
        app.get('/project',async(req,res)=>{
            const cursor = projectCollection.find({});
            const getproject = await cursor.toArray();
            res.send(getproject)
        })
        app.get('/project/:id', async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const getSingleproject = await projectCollection.findOne(query);
            res.json(getSingleproject);
        });
        
    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('Running Portfolio Server')
});

app.listen(port,()=>{
    console.log('Portfolio Server port', port);
})