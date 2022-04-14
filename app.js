
const express =require("express");
const bodyParser=require("body-parser");
const res = require("express/lib/response");
const mongoose=require("mongoose");
const app=express();

let dates=[];

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://admin-samar:samararman123@cluster0-shard-00-00.azsiz.mongodb.net:27017,cluster0-shard-00-01.azsiz.mongodb.net:27017,cluster0-shard-00-02.azsiz.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-t7bzex-shard-0&authSource=admin&retryWrites=true&w=majority",{useNewUrlParser: true});

const itemsSchema={
    name:String
};


const Item=mongoose.model("Item",itemsSchema)


const defaultItems=[];


Item.insertMany(defaultItems,function(err){
    if(err){
        console.log(err);
    }
    else{
        console.log("Success");
    }
})


app.get("/",function(req,res){
    let date=new Date();

    let options={
        weekday:"long",
        day:"numeric",
        month:"long"
    };

    let day=date.toLocaleDateString("en-US",options);
    
    Item.find({},function(err,foundItems){
        console.log(foundItems);
        res.render("list",{kindOfDay:day, newListItems: foundItems, newDates: dates});
    })
    

   
});

app.post("/",function(req,res){
    const itemName =req.body.newItem;
    const item=new Item({
        name: itemName
    });
    item.save();
    res.redirect("/");

})
app.post("/delete",function(req,res){
    const deletedItemId=req.body.btn;
    Item.findByIdAndRemove(deletedItemId,function(error){
        if(!error){
            console.log("Succesfully");
            res.redirect("/");
        }
    })
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3001;
}

app.listen(port,function(){
    console.log("Hello Everyone");
});
