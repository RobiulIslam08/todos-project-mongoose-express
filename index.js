const express = require('express')
const mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
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
  todo: {
    type:String,
    required: true
  },
  piority:{
     type: String,
     enum:["hign", "medium", "low"]

  }
});
const Todo = mongoose.model('Todo', todoSchema);
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }
})
const User = mongoose.model('User', userSchema)

async function run() {
  try {
	  // await client.connect();
    await mongoose.connect(uri);
    
	// const todosCollection = client.db('todoDB').collection('todos')

	//get todos data 
	app.get('/todos',async(req, res, next)=>{
    console.log(req.headers.authorization)
    const token = req.headers.authorization
      const privateKey = "secret"
    const verifiedToken = jwt.verify(token, privateKey)
    console.log(verifiedToken)
    if(verifiedToken){
      
      next()
    }else{
      res.send('not athorization')
    }
    
  }, async(req, res)=>{
		// const todosData = await todosCollection.find({}).toArray()
		// console.log(todosData)
    const todos = await Todo.find({})
		res.send(todos)
	})
  // single data get 
  app.get('/todos/:id',async(req, res)=>{
		// const todosData = await todosCollection.find({}).toArray()
		// console.log(todosData)
    const id = req.params.id
    // const todos = await Todo.findById(id)
    const todos = await Todo.findOne({
      _id: id
    })
		res.send(todos)
	})
	//insert todos data
	app.post('/todo-insert',async (req, res)=>{
		const todoData = req.body
    const todo = Todo.create(todoData)
  
		// const insertData = await todosCollection.insertOne(todoData)
		res.send(todo)
	})
  // update todo data 
  app.patch('/todos/:id', async (req, res) => {
    const id = req.params.id;
    const updateData = req.body;
  
    try {
      let todos = await Todo.findByIdAndUpdate(id, updateData, { new: true });
      res.send(todos);
    } catch (error) {
      res.status(500).send({ error: "Failed to update the document" });
    }
  });
  // delete todo data
  app.delete('/todos/:id', async (req, res) => {
    const id = req.params.id;
    try {
      let todos = await Todo.findByIdAndDelete(id);
      res.send(todos);
    } catch (error) {
      res.status(500).send({ error: "Failed to update the document" });
    }
  });

  //User Register
  app.post('/register',async (req, res)=>{
    const userData = req.body
    const user = await User.create(userData)
    res.send(user)
  })

  //login user
  app.post('/login', async(req, res)=>{
    const {name,email} = req.body
    
    const user = await User.findOne({
      email,
      name
    })
    const payload = {
      name: user.name,
      email: user.email
    }
    const privateKey = "secret"
    const expiratonTime = "1d"
    const accessToken = jwt.sign(payload,privateKey,{
      expiresIn: expiratonTime
    })
    if(user){
      const userResponse = {
        message: "logged in successfully" ,
        data: {
         accessToken
        }
        
      }
      res.send(userResponse)
    }else{
      res.send('unvalid credential')
    }
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