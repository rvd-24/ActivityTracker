const express =require('express');
const app=express();
const path=require('path');
const Router=express.Router();
const port=process.env.PORT||3000;
const chrome = require('sinon-chrome');

const {dbmessage} =require('./popup');
console.log(dbmessage.message);

require('./db/connect');
const static_path=path.join(__dirname);
app.use(express.static(static_path));

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,"popup.html"));
});

app.listen(port,()=>{
    console.log('(app_user_elec.js)Server is running at port no. '+ port);
});

app.post('/',async(req,res)=>{
    console.log()
})