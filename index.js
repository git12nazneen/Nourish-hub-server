const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// middleware
//Must remove "/" from your production URL
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://nourish-hub-efad9.web.app",
      "https://nourish-hub-efad9.firebaseapp.com",
    ],
    credentials: true,
  })
);

app.use(cors());
app.use(express.json());

// LWRWyXeHuvl3COfh

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rmgdsvn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();
    // Send a ping to confirm a successful connection

    const addHubCollection = client.db('nourish-hub').collection('room')
    const addBookingCollection = client.db('nourish-hub').collection('booking')
    
    // hub api collection

    app.get('/room', async(req, res)=>{
        const query = addHubCollection.find()
        const result = await query.toArray()
        res.send(result);
    })

    app.get('/room/:id', async(req, res)=>{
      const id = req.params.id;
      const query= {_id : new ObjectId(id)}
      const result = await addHubCollection.findOne(query)
      res.send(result)
    })
    
    // price filter

      // Express route to handle data filtering
      // app.get('/room', (req, res) => {
      //   const { minAge, maxAge } = req.query;

      //   // Perform filtering based on query parameters
      //   const filteredData = addHubCollection.filter(item => {
      //     return (!minAge || item.price_per_night >= minAge) && (!maxAge || item.price_per_night <= maxAge);
      //   });

      //   res.send(filteredData);
      // });
      // app.get('/room/filter', (req, res) => {
      //   const { price } = req.query;
      //   const filteredRooms = room.filter(rooms => rooms.price_per_night <= parseInt(price));
      //   res.send(filteredRooms);
      // });

    // booking

    app.get('/booking', async(req, res)=>{
      const result = await addBookingCollection.find().toArray();
      res.send(result)
    })

    app.post('/booking', async(req, res)=>{
      const booking = req.body;
      console.log(booking)
      const result = await addBookingCollection.insertOne(booking)
      res.send(result);
    })

    // booking delete
    app.delete('/booking/:id', async(req, res)=>{
      const id = req.params.id;
      console.log('delete booking', id);
      const query = {_id: new ObjectId(id)}
      const result = await addBookingCollection.deleteOne(query)
      res.send(result);
    })

    // get all booking room by a specific user
  

      app.get('/booking/:email', async (req, res) => {
        const email = req.params.email;
        const result = await addBookingCollection.find({ email }).toArray();
        res.send(result);
      });

    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res)=>{
    res.send('Nourish hub is running')
})

app.listen(port, ()=>{
    console.log(`Nourish hub is on port: ${port}`)
})