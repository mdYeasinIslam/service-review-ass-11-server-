const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());

//user : service-review-11
//pass: FETpI9p1dF55OLO7

const DBUser = process.env.DB_USER;
const DbPassword = process.env.DB_PASSWORD;
// console.log(DBUser,DbPassword)
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${DBUser}:${DbPassword}@cluster0.bfv30pl.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const ReviewCollection = client
      .db("Services-review")
      .collection("Custome-review");
    const TouristCollection = client
      .db("Services-review")
      .collection("Tour-Service");
    const CustomService = client
      .db("Services-review")
      .collection("custom-services");
    const TouristInfo = client.db("Services-review").collection("tourist-Info");

    //services
    app.get("/services", async (req, res) => {
      const query = {};
      const name = req.query.name;
      const findData = TouristCollection.find(query);
      if (name == "hasan") {
        const services = await findData.limit(3).toArray();
        res.send(services);
      } else {
        const services = await findData.toArray();
        res.send(services);
      } 
      // console.log(req.query);
    });
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const findService = await TouristCollection.findOne(query);
      res.send(findService);
      // console.log(findService)
    });

    //review -part
    app.post("/review", async (req, res) => {
      const reviewBody = req.body;
      const result = await ReviewCollection.insertOne(reviewBody);
      res.send({
        result,status:'true',message:'Your review is submitted successfully'
      });
    });
    app.get("/review/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id);
      const query = { placeId: id };
      const findReview = ReviewCollection.find(query);
      const reviews = await findReview.toArray();
      res.send(reviews);
      // console.log(reviews)
    });
    //review-update
    app.get("/review", async (req, res) => {
      const query = {};
      const result = ReviewCollection.find(query);
      const getReviews = await result.toArray();
      res.send(getReviews);
      // console.log(getReviews)
    });
    app.put("/review/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const body = req.body;
      // console.log(id,body)
      const updateReview = {
        $set: {
          reviewTitle: body.title,
          reviewBody: body.body,
        },
      };
      const result = await ReviewCollection.updateMany(query, updateReview);
      if (result.acknowledged) {
        res.send({
          status: true,
          message: "Update operation is success",
        });
      } else {
        res.send({
          status: false,
          message: "Update operation is failed",
        });
      }
    });
    //review-delete
    app.delete("/review/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const deleteItem = await ReviewCollection.deleteOne(query);
      res.send({
        status: true,
        message: "Review is deleted successfully...",
      });
      // console.log(id,deleteItem)
    });

    //add-custom services
    app.post("/custom-service", async (req, res) => {
      const body = req.body;
      // console.log(body);
      const insertServiceInfo = await CustomService.insertOne(body);
      res.send(insertServiceInfo);
    });
    app.get("/custom-service", async (req, res) => {
      const query = {};
      const result = CustomService.find(query);
      const services = await result.toArray();
      res.send(services);
    });
    //find signle service
    app.get("/custom-service/:id", async (req, res) => {
      const id = req.params.id;
      // console.log(id)
      const query = { _id: new ObjectId(id) };
      const result = await CustomService.findOne(query);
      res.send(result);
    });

    //checkout (tourist info)
    app.post("/tourist-Info", async (req, res) => {
      const body = req.body;
      // console.log(body.placeId);
      const findInfo = TouristInfo.find({
        placeId: { $exists: true, $in: [body.placeId] },
      });
      const signleInfo = await findInfo.toArray();
      if (signleInfo[0]?.placeId !== body.placeId || signleInfo.length == 0) {
        const inserInfo = await TouristInfo.insertOne(body);
      }

      // console.log(signleInfo);
      if (signleInfo.length >= 1) {
        res.send({
          status: true,
          message:
            "You already puchased this package and Submitted your information, Please wait until we called ....",
        });
      } else {
        res.send({
          status: true,
          message:
            "Your information is submitted successfully. Please wait for our TRIP-Day ,We will send message/email to you as soon as possible ",
        });
      }
    });
    app.get("/tourist-Info", async (req, res) => {
      const query = {};
      const result = TouristInfo.find(query);
      const info = await result.toArray();
      res.send(info);
    });
    app.delete('/tourist-Info/:id',async(req,res) =>{
      const id = req.params.id
      // console.log(id)
      const query = {placeId : id};
      const deleteInfo  = await TouristInfo.deleteOne(query)
      res.send({
        deleteInfo,status:true,message:'Your Information id deleted successfully. Please purchase another one...'
      })
    })
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is created");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("server is runnig"));
