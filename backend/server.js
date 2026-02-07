const express = require("express");
const mongoose = require("mongoose");
const cors=require('cors');

const app = express();

// middleware
app.use(express.json());
app.use(cors());
// connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/todoapp")
  .then(() => console.log("DB connected successfully"))
  .catch((err) => console.log("DB connection failed", err));

// schema
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
});

// model
const Todo = mongoose.model("Todo", todoSchema);

// test route
app.get("/", (req, res) => {
  res.send("Server is alive");
});
app.post("/todos", async (req, res) => {
  console.log("Request body:", req.body);

  const { title, description } = req.body;

  try {
    const newTodo = new Todo({ title, description });
    await newTodo.save();

    res.status(201).json(newTodo);
  } catch (error) {
    console.error("SAVE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});

// get all todos
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

//update a todo
app.put("/todos/:id", async (req, res) => {
  try {
    
  const {title, description} = req.body;
  const id = req.params.id;
  const updatedTodo= await Todo.findByIdAndUpdate(id, {title, description}, {new: true})
  if(!updatedTodo){
    return res.status(404).json({message:"Todo not found"})
  }
  res.json(updatedTodo)

    
  } catch (error) {
   console.error(error);
    res.status(500).json({ message: error.message }); 
  }
});

//Delete a todo
app.delete('/todos/:id',async(req,res)=>{
  try {
      const id= req.params.id;
  await Todo.findByIdAndDelete(id);
  res.status(204).end();

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
  
})

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
