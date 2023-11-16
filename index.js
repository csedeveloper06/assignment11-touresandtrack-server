const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jwzzltb.mongodb.net/?retryWrites=true&w=majority`;

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

    const touristServiceCollection = client.db('touristPlans').collection('touristServices');
    const popularTouristServiceCollection = client.db('touristPlans').collection('popularTouristServices');
    const bookingCollection = client.db('touristPlans').collection('bookings');
    const manageServicesCollection = client.db('touristPlans').collection('manageServices');

    app.get('/touristServices', async(req,res) => {
        const cursor = touristServiceCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })
    app.get('/popularTouristServices', async(req,res) => {
        const cursor = popularTouristServiceCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

      app.get('/touristServices/:id', async(req,res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await touristServiceCollection.findOne(query);
        res.send(result);
    })

    app.get('/touristServices/:id', async( req, res )=> {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};

      const options = {
        // Include only the `title` and `imdb` fields in the returned document
        projection: { serviceName: 1, serviceImage: 1, servicePrice: 1, serviceProviderEmail: 1 }
      };

      const result = await touristServiceCollection.findOne( query, options );
      res.send(result);
    })

    // bookings

    app.get('/bookings', async(req , res) => {
      let query = {};
      if(req.query?.email){
        query = { email: req.query.email }
      }
      const result = await bookingCollection.find(query).toArray();
      res.send(result);
    })

    app.post('/bookings', async (req, res) => {
      const bookings = req.body;
      console.log(bookings);
      const result = await bookingCollection.insertOne(bookings);
      res.send(result);
    });


    app.get('/manageServices', async(req , res) => {
      let query = {};
      if(req.query?.email){
        query = { 
          serviceProviderEmail: req.query.email }
      }
      console.log(req.query.email);
      const result = await manageServicesCollection.find(query).toArray();
      res.send(result);
    })


    app.post('/manageServices', async (req, res) => {
        const manageServices = req.body;
        console.log(manageServices);
        const result = await manageServicesCollection.insertOne(manageServices);
        res.send(result);
    });



    app.post('/touristServices', async(req,res) =>{
        const newService = req.body;
        console.log(newService);
        const result = await touristServiceCollection.insertOne(newService);
        res.send(result);
    })

    app.put('/manageServices/:id', async(req,res)=> {
        const updatedManageService = req.body;
        
    })

    app.delete('/manageServices/:id', async(req,res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await manageServicesCollection.deleteOne(query);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    //await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('ToursNTracks is running')
})

app.listen(port, () => {
    console.log(`ToursNTrack is running on port ${port}`)
})