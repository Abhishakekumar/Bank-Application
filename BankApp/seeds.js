var mongoose = require("mongoose");
var Client = require("./models/client");

var data = [
    {
        name: "Harry Potter", 
        age : "20",
        email: "potter@hogwarts.com",
        account: 12345678,
        money: 0
    },
    {
        name: "Hermione Granger", 
        age : "20",
        email: "hermione@hogwarts.com",
        account: 12345677,
        money: 0
    },
]
function seedDB(){
 
   Client.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed clients!");
        
        data.forEach(function(seed){
            Client.create(seed, function(err, client){
                if(err){
                    console.log(err)
                } else {
                    console.log("added a client");
                  
                }
            });
        });
    }); 
    
}

module.exports = seedDB;
