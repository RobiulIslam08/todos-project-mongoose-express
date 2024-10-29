const express = require('express')
const mongoose = require('mongoose');
const app = express()
const port = 3000
app.use(express.json())
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://todos_user:FywoiOiOhauhJCqh@cluster0.rqcbidk.mongodb.net/todoDB?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// lagbe nah cause use mongoose
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });

const todoSchema = new mongoose.Schema({
  todo: String,
  piority: String
});
const Todo = mongoose.model('Todo', todoSchema);

async function run() {
  try {
	  // await client.connect();
    await mongoose.connect(uri);
    
	// const todosCollection = client.db('todoDB').collection('todos')


	//get todos data 
	app.get('/todos',async(req, res)=>{
		// const todosData = await todosCollection.find({}).toArray()
		// console.log(todosData)
    const todos = await Todo.find({})
		res.send(todos)
	})

	//insert todos data
	app.post('/todo-insert',async (req, res)=>{
		const todoData = req.body
    const todo = Todo.create(todoData)
  
		// const insertData = await todosCollection.insertOne(todoData)
		res.send(todo)
	})
    // Connect the client to the server	(optional starting in v4.7)
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);









app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})