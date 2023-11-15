const express = require('express')
const cors = require('cors')
require('dotenv').config();
const app = express()

app.use(cors())
app.use(express.json())

//user : service-review-11
//pass: FETpI9p1dF55OLO7

const DBUser = process.env.DB_USER
const DbPassword = process.env.DB_PASSWORD
// console.log(DBUser,DbPassword)
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${DBUser}:${DbPassword}@cluster0.bfv30pl.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const ReviewCollection = client.db('Services-review').collection("Custome-review")
    const TouristCollection = client.db('Services-review').collection("Tour-Service")
    // const services =[
    //     {name:"A"},
    //     {name:'b'}
    // ]
    // const result = await TouristCollection2.insertMany(services)
    // console.log(result)

    //services
    app.get('/services',async(req,res)  =>{
        const query = {}
        const findData = TouristCollection.find(query)
        const services = await findData.limit(3).toArray()
        res.send(services)
        // console.log(services)
    })
    app.get('/services/:id',async(req,res) =>{
        const id= req.params.id
        const query = {_id : new ObjectId(id)}
        const findService = await TouristCollection.findOne(query)
        res.send(findService)
        // console.log(findService)
    })
    
    //review -part
    app.post('/review',async(req,res) =>{
      const reviewBody = req.body
      const result = await ReviewCollection.insertOne(reviewBody)
      res.send(result)
    })
    app.get('/review/:id', async(req,res) =>{
      const id = req.params.id
      console.log(id)
      const query = { placeId : id}
      const findReview = ReviewCollection.find(query)
      const reviews = await findReview.toArray()
      res.send(reviews)
      // console.log(reviews)
    })
    //review-update
    app.get('/review',async(req,res) =>{
      // const email = req.params.email
      // console.log(req)
      const query ={};
      const result = ReviewCollection.find(query)
      const getReviews =await result.toArray()
      res.send(getReviews)
      console.log(getReviews)
    })
    app.put('/review/:id',async(req,res)=>{
      const id = req.params.id;
      const query={_id:new ObjectId(id)}
      const body = req.body;
      console.log(id,body)
      const updateReview = {
        $set:{
          reviewTitle:body.title,
          reviewBody:body.body
        }
      }
      const result  = await ReviewCollection.updateMany(query,updateReview)
    
      console.log(result)
    })
  } finally {

  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('server is created')
})


const port = process.env.PORT || 3000
app.listen(port,()=>console.log('server is runnig'))