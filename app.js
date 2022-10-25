const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname+"/date.js");
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));
let items = [];
let workItems =[];

app.get("/",(req,res)=>{
  let page ="/";
  let day = date.getDate();
  res.render("list", {listTitle: day, newListItems:items, pagePostedFrom:page});
});

app.post("/",(req,res)=>{
  let item = req.body.newItem;
  items.push(item);
  res.redirect("/");
});


app.get("/work", (req,res)=>{
  let page ="work";
  res.render("list",{listTitle: "Work List", newListItems: workItems, pagePostedFrom:page});
});

app.post("/work", (req,res)=>{
  let item = req.body.newItem;
  workItems.push(item);
  res.redirect("/work");
})

app.get("/about", (req,res)=>{
  res.render("about");
});

app.listen(3000,()=>{
  console.log("Sever started!");
});
