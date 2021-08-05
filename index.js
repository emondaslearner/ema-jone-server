const express = require('express');
require('dotenv').config()
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require("nodemailer");
const app= express();

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9pksi.mongodb.net/${process.env.DB_NAMES}?retryWrites=true&w=majority`;





app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/',(req,res) => {
  res.send('hello heroku');
})
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db(process.env.DB_NAMES).collection(process.env.DB_COLLECTION);
  const orderCollection = client.db(process.env.DB_NAMES).collection('orders');
  app.post('/addData',(req,res)=>{
    collection.insertMany(req.body)
  })
  app.post('/addOrder',(req,res) => {
    orderCollection.insertOne(req.body)
    .then(result => {
      res.send(req.body);
    })
  })
  app.get('/data',(req,res) => {
    const search = req.query.search;
    collection.find({name:{$regex:search}})
    .toArray((err,documents) => {
      res.send(documents)
    })
  })
});




app.listen(process.env.PORT || 4000)