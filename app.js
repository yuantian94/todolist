const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname+"/date.js");
const app = express();
const mongoose = require("mongoose");
const _= require("lodash");

app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

let workItems =[];

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB", {useNewUrlParser:true});

const itemSchema = new mongoose.Schema({
  name:String
});

const listSchema = {
  name: String,
  items: [itemSchema]
}


const Item = new mongoose.model("Item", itemSchema);

const List = new mongoose.model("List",listSchema);

app.get("/",(req,res)=>{
  let day = date.getDate();
  let items = Item.find({},(err,foundItems)=>{
    if(err){
      console.log(err);
    }
    else{
      res.render("list", {listTitle: day, newListItems:foundItems});
    }
  });

});

app.get("/:customListName", (req, res)=>{
  const customListName = _.capitalize(req.params.customListName);
  List.findOne({name:customListName}, (err,results)=>{
    if(err){
      console.log(err);
    }
    else{
      if(results){
        res.render("list", {listTitle: customListName, newListItems:results.items});
      }
      else{
        const list = new List({name:customListName, items:[]});
        list.save();
        res.redirect("/"+customListName);
      }
    }
  });


});

app.post("/",(req,res)=>{
  const item = req.body.newItem;
  const listName = req.body.list;

  const itemInsert = new Item({name:item});

  if(listName === date.getDate()){
    itemInsert.save();
    res.redirect("/");
  }
  else{
    List.findOne({name:listName}, (err,results)=>{
      results.items.push(itemInsert);
      results.save();
      res.redirect("/"+listName);
    });
  }


});

app.post("/delete",(req,res)=>{
  const checkedItemID = req.body.checkbox;
  const listName = req.body.listName;

  if(listName === date.getDate()){
    Item.deleteOne({_id:checkedItemID},(err)=>{
      if(err){
        console.log(err);
      }
      else{
        console.log("Succuessful deletion");
      }
    });
    res.redirect("/");
  }
  else{
    List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItemID}}},(err, results)=>{
      if(err){
        console.log(err);
      }
      else{
        res.redirect("/"+listName);
      }
    });
  }


});


app.get("/about", (req,res)=>{
  res.render("about");
});

app.listen(3000,()=>{
  console.log("Sever started!");
});
