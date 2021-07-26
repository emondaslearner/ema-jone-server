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
      let mailTransporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port:587,
          secure:false,
          requireTLS:true,
          auth: {
              user: 'emonwordpress.1000@gmail.com',
              pass: 'emondas12345'
          }
      });
        
      let mailDetails = {
          from: 'emonwordpress.1000@gmail.com',
          to: req.body.address.email,
          subject: 'ema-jone order',
          html: '<h5>product order has been successfully placed on ema-jone</h5>'
      };
        
      mailTransporter.sendMail(mailDetails, function(err, data) {
          if(err) {
              console.log(err);
          } else {
              console.log('Email sent successfully');
          }
      });
    })
  })
  app.get('/data',(req,res) => {
    collection.find({})
    .toArray((err,documents) => {
      res.send(documents)
    })
  })
});




app.listen(4000)