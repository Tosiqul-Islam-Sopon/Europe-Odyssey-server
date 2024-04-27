const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



//EuropeOdyssey
//xUE8dVGJ8z1lyIOH


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nnvexxr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("EuropeOdysseyDB");
    const spotCollection = database.collection("TouristSpots");

    app.get("/spots", async(req, res) =>{
      const cursor = spotCollection.find({ user_name: "" });
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get("/spots/:id", async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await spotCollection.findOne(query);
      res.send(result);
    })

    app.get("/allSpots", async(req, res) =>{
      const cursor = spotCollection.find({ user_name: { $ne: "" } });
      const result = await cursor.toArray();
      res.send(result)
    })

    app.get("/allSpots/:email", async(req, res) =>{
      const email = req.params.email;
      const cursor = spotCollection.find({user_email: email});
      const result = await cursor.toArray();
      res.send(result);
    })

    app.post("/addSpot", async(req, res)=>{
      const spot = req.body;
      const result = await spotCollection.insertOne(spot);
      res.send(result);
    })

    app.patch("/updateSpot/:id", async(req, res) =>{
      const id = req.params.id;
      const spot = req.body;
      const query = {_id: new ObjectId(id)};
      const updatedSpot = {
        $set : {
          tourist_spot_name: spot.tourist_spot_name,
          country_name: spot.country_name,
          location: spot.location,
          average_cost: spot.average_cost, 
          seasonality: spot.seasonality,
          travel_time: spot.travel_time, 
          total_visitors_per_year: spot.total_visitors_per_year, 
          short_description: spot.short_description,
          image: spot.image, 
          user_email: spot.user_email, 
          user_name: spot.user_name
        }
      }

      const result = await spotCollection.updateOne(query, updatedSpot);
      res.send(result);
    })

    app.delete("/spots/:id", async(req, res) =>{
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await spotCollection.deleteOne(query);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) =>{
    res.send("EuropeOdyssey server is Running");
})

app.listen(port , () =>{
    console.log(`EuropeOdyssey server is running on ${port}`);
})