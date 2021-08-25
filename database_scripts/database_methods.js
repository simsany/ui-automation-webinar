const mongoose = require("mongoose");
mongoose.connect("mongodb+srv://sanyika:Nem99@cluster0.hg5xp.mongodb.net/orders?retryWrites=true&w=majority");
const TestData = require("./models/TestData.js");
module.exports= class DatabaseMethods{
addTestData(TestDataObject) {
    TestData.create(TestDataObject, (err) => {
        if (err) { 
            console.log("Error")
        } 
        else {
            console.log("TestData created!")
            
        }
    })
}

 getAllTestDatas(){
    return  TestData.find({}, (err) => {
        if (err){
            console.log("Error")} 
        else {
            console.log('Item found!')
            }
           
        }
    ).exec()
}
    
    


getTestDatasByCountry(country){
    return TestData.find( { "country":country }, (err) => {
        if (err){
            console.log("Error")
        } 
        else{
          console.log("Item found")  
        }
    }).exec()
}
getTestDatasByCity(city){
   return TestData.find( { "city":city }, (err) => {
        if (err){
            console.log("Error")
        } 
        else{
            console.log("Item found!")
        }
    }).exec()
}

 getTestDatasBySkill(skill){
    return TestData.find( { "skill":skill }, (err) => {
        if (err){
            console.log("Error")
        } 
        else{
            console.log("Item found!")
        }
    }).exec()
}


 getTestDatasByPosition(position){
    return TestData.find( { "position":position }, (err) => {
        if (err){
            console.log("Error")
        } 
        else{
            console.log('Item found!')
        }
    }).exec()
}
}
