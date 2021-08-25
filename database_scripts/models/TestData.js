const mongoose=require("mongoose");

const TestDataSchema= new mongoose.Schema({
	
	country:{type:String, default: ""},
	city:{type:String, default: ""},
    skill:{type:String, default: ""},
    position:{type:String, default: ""},
	});
	
	module.exports=mongoose.model("TestData",TestDataSchema);