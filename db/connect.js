const mongoose=require('mongoose');
mongoose.connect("mongodb://localhost:27017/TabDetails").then(()=>{
    console.log("Connected successfully to MongoDB");  
}).catch((err)=>{
    console.log("Errors connecting to database");
});
var connect=mongoose.connection;