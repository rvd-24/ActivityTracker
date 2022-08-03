const mongoose=require('mongoose');
const tab_details= new mongoose.Schema({
    Name : {
        type:String,
        required:true
    }
})

//Collection/Table
const tab_detail=new mongoose.model("tab_details",tab_details);
module.exports=tab_details;