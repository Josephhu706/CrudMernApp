const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const port = process.env.PORT  || 3001

//configure server
app.use(cors())
//convets json data into db data. extended allows use of non unicode characters. Can be false if you want
app.use(bodyParser.urlencoded({extended: true}));
//return data in json format
app.use(bodyParser.json())


//connect to mongodb
mongoose.connect(`mongodb+srv://vocab:chicken420@cluster0.li9sn.mongodb.net/?retryWrites=true&w=majority`)

//data schema
const itemsSchema={
    title: String,
    description: String
}

//data model
const Item = mongoose.model("Item", itemsSchema)

//read route
//if we're at http://localhost3001/items
app.get('/items', (req,res)=>{
    //find the item in the db
    Item.find()
    //then return it as a json object
    .then(items=>res.json(items))
    //if there's an error then return an error
    .catch(err=>res.status(400).json("Error: "+err))
});

//create route
//post request to db
app.post('/newitem', (req, res)=>{
    //create a new item model
    const newItem = new Item(
        {   //the title and body of our new Item are from the get request sent from the client 
            title: req.body.title,
            description: req.body.description
        }
    );
    //save the item
    newItem.save()
    .then(item=>console.log(item))
    .catch(err=>res.status(400).json("Error "+err))
})


//delete route
//delete via params id
app.delete('/delete/:id', (req, res)=>{
    const id = req.params.id
    Item.findByIdAndDelete({_id: id}, (req, res, err)=>{
        if(!err){
            console.log("Item Deleted")
        }
        else{
            console.log(err)
        }
    }) 

})

//update route
app.put('/put/:id', (req,res)=>{
    const updatedItem = {
        title: req.body.title,
        description: req.body.description
    }
    Item.findByIdAndUpdate({_id: req.params.id},{$set: updatedItem}, (req, res, err)=>{
        if(!err){
            console.log("Item updated")
        }else{
            console.log(err)
        }
    })
})


app.listen(port, function(){
    console.log(`the server is running on htt[://localhost${port}`)
})

