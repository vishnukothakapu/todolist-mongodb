const express = require('express');
const bodyParser = require('body-parser');
const port = 8080;
const app = express();
const mongoose = require('mongoose');
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static("public"));
mongoose.connect("mongodb://127.0.0.1:27017/todolistDB", { useNewUrlParser: true })
    .then((res) => {
        console.log("Connected to the Database");
    })
    .catch((err) => {
        console.log(err);
    })
const itemsSchema = {
    name: String
};
const Item = mongoose.model("Item", itemsSchema);
const item1 = {
    name: "Buy Food"
};
const item2 = {
    name: "Cook Food"
};
const item3 = {
    name: "Eat Food"
};
const defaultItems = [item1, item2, item3];




app.get('/', (req, res) => {
    Item.find({})
        .then((result) => {
            if (result.length == 0) {
                Item.insertMany(defaultItems)
                    .then((res) => {
                        console.log('Inserted Default Items');
                    })
                    .catch((err) => console.log(err));
                res.redirect("/");
            } else {
                res.render('list', { listTitle: "Today", newListItem: result });
            }

        })
        .catch((err) => {
            console.log(err);
        })
});
app.post("/", (req, res) => {
    const itemName = req.body.newItem;
    const newItem = new Item({
        name: itemName
    });
    newItem.save()
        .then((result) => {
            console.log("inserted new item..");
            res.redirect("/");
        })
        .catch((err) => {
            console.log(err);
        })
});

app.post("/delete", (req, res) => {
    const checkedItemId = req.body.checkbox;
    Item.findByIdAndRemove(checkedItemId)
        .then((result) => {
            console.log("deleted an item");
            res.redirect("/");
        })
        .catch((err) => {
            console.log(err);
        })
});

app.get("/about", (req, res) => {
    res.render("about");
})

app.get("/work", (req, res) => {
    res.render("list", { listTitle: "Work List", newListItem: workItems });
});
app.post("/work", (req, res) => {
    let item = req.body.newItem;
    workItems.push(item);
    res.redirect("/work");
});
app.listen(port, () => {
    console.log('listening on port ' + port);
});