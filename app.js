//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const _ = require('lodash');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Mongoose Connection to Database
mongoose.connect("mongodb+srv://admin:AECa6Br9n683rst@cluster0.b8koz.mongodb.net/todoListDB?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  });

//Mongoose Model Definitions
const itemSchema = {
  name: { type: String, required: true }
};
const Item = mongoose.model("Item", itemSchema);

const listSchema={
  name:String,
  items:[itemSchema]
}
const List=mongoose.model("List",listSchema);
const item1 = new Item({ name: "Feed Hashiko!" });
const item2 = new Item({ name: "Clean my bedroom!" });
const item3 = new Item({ name: "Watch a movie!" });
const defaultItems = [item1,item2,item3];

app.get("/about", function (req, res) {
  res.render("about");
});

app.get("/", function (req, res) {

  Item.find({}, function (err, results) {
    if (err) {
      console.log("Error: ", err.message)
    } else {

      res.render("list", { listTitle: 'Today', newListItems: results });
    }
  });

});
app.get("/:customListName", function (req, res) {
  
  let customListName=_.capitalize(req.params.customListName);
  List.findOne({name:customListName}, function (err, foundList) {
    if (err) {
      console.log("Error: ", err.message)
    } else if(foundList) {
      
      res.render("list", { listTitle:foundList.name, newListItems: foundList.items });
    }else{

      let newList=new List({
        name: customListName,
        items:defaultItems
      });
      newList.save();
      res.redirect("/"+customListName);
    }
  });

});

app.post("/", function (req, res) {

  const itemName = req.body.newItem;
  const list = req.body.list;
  const newItem = new Item({ name: itemName });

  if(list=='Today'){
    newItem.save();
    res.redirect('/');
  }else{
    
    List.findOne({name:list},function(err,resultList){
      resultList.items.push(newItem);
      resultList.save();
      res.redirect('/'+list);
    });  
  }
});

app.post("/delete", function (req, res) {
  let itemID = req.body.item;
  const list = req.body.list;
  if(list=="Today"){

    Item.findByIdAndRemove(itemID, function (err, results) {
      if (err) {
        console.log("Error: ", err.message);
      } else {
        if(results){
          
          res.redirect('/');
        }
      }
    });
  }else{
    List.findOne({name:list},function(err,resultList){
      resultList.items.pull(itemID);
      resultList.save();
      res.redirect('/'+list);
    });
  
  }

});


app.listen(3000, function () {
  console.log("Server started on port 3000");
});
