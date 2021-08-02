//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const date = require(__dirname + "/date.js");
const port = 3000;
const mongoose = require('mongoose');
const password = require('./passwords');
const uri = 'mongodb+srv://admin:' + password.mongodb + '@cluster0.b8koz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });


const itemSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, "Please check your data entry, no task specified!"]
    },
    checked: { type: Boolean, default: false }
});
const listSchema = new mongoose.Schema({
    title: String,
    due: { type: Date, default: Date.now },
    items: [itemSchema]
});
const Item = new mongoose.model('Item', itemSchema);
const List = new mongoose.model('List', listSchema);

let workItems = [];
let item1 = new Item({ text: 'Welcome to a new brand To Do List!' });
let item2 = new Item({ text: 'Type a new item to get started.' });

let items = new List({ title: 'To Do List', items: [item1, item2] });
let worklist = new List({ title: 'Work List', items: [item1, item2] });
let item = new Item({ text: 'otro' });

// worklist.save(function (err) {
//     if (err) return handleError(err);
//     // saved!
//     console.log('done!');
//   });


/*aqui estamos requiriendo el modulo dentro del archivo date.js y como no es algo que deba enviarse
al browser para funcionar, si que es parte del proceso en el backend, entonces puede perfectamente 
estar en el root

La forma de usarlo es como se muestra abajo con el comando date(), ya que solo existe un modulo
pero si fuera mas de uno variaria como se observara en el siguiente branch
*/


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {

    console.log('database connection established');
});



app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");


//every time something is display on screen is because
//it was sent to it so that we 
app.get("/", function (req, res) {

    List.findOne({ title: 'To Do List' }, function (err, result) {

        res.render('list', { listTitle: result.title, listOfItems: result.items, idList: result._id });
    });
});

app.post("/", function (request, response) {

    let idList = request.body.idList
    let text = request.body.newItem;
    let newItem = new Item({ text: text });


    List.findOneAndUpdate(

        { _id: idList },
        { $push: { items: newItem } }, function (err, result) {
            // this runs after the mongoose operation
            response.redirect('/');


        }
    );



});
app.post("/:list", function (request, response) {
    let list = request.params.list;
    let idList = request.body.idList
    let text = request.body.newItem;
    let newItem = new Item({ text: text });


    List.findOneAndUpdate(

        { _id: idList },
        { $push: { items: newItem } }, function (err, result) {
            // this runs after the mongoose operation
            response.redirect('/' + list);


        }
    );



});



app.get("/about", function (req, res) {
    res.render('about');
});

//este es como decir el metodo para cargar la pagina
app.get("/:list", function (req, res) {
    let list = req.params.list;

    List.exists({ title: list }, function (err, result) {
        if (err) {
            console.log(err);
        } else if (result == true) {
            List.findOne({ title: list }, function (err, result) {
                res.render('list', { listTitle: result.title, listOfItems: result.items, idList: result._id });

            });
        } else {
            let items = new List({ title: list, items: [item1, item2] });
            items.save();
            res.redirect(req.originalUrl);

        }
    }
    );
});

app.listen(port, function () {
    console.log("Server started on port " + port);
});