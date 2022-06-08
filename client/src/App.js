
import {useState, useEffect} from 'react'
import './App.css';
import axios from 'axios'


function App() {
  // state of the object we will send to the database when we create an item
const [item, setItem] = useState({
  title:'',
  description:''
})
const [items, setItems] = useState([
  {
    title: '',
    description:'',
    _id:''
  }
])

const [isPut, setIsPut] = useState(false);
const [updatedItem, setUpdatedItem] = useState({
  title:'',
  description:'',
  _id:'',
})
// const [items, setItems] = useState([])

  // useEffect(()=>{
  //   //fetch request to http://localhost:3001/items
  //   axios.get("/items")
  //   .then(jsonRes=>setItems([...items,...jsonRes.data]))
  //   .then(res=>console.log(items))
  //   .catch(err=>console.log(err))
  //   //call use effect when the state of items changes, not only once when the component is rendered
  // },[])

useEffect(()=>{
    fetch("/items")
    .then((res)=>{
      if(res.ok){
        return res.json();
      }
    })
    .then((jsonRes)=>setItems(jsonRes))
    .catch((err)=>console.log(err))
  },[items])

  const handleChange=(event)=>{
    //desctructure event .target into the name of the input and the value of the input
    const{name,value} = event.target;
    //copy the state of items
    let copyItem = {...item}
    //set the corresponding key and value to the event
    copyItem[name] = value
    //set state for the item
    setItem(copyItem)
    // console.log(item)
    // setItem((prevInput)=>{
    //   return{
    //     ...prevInput,
    //     [name]:value,
    //   }
    // })
  }
  //onclick event handler to send item to server
  function addItem(event){
    //stop form from submitting and redirecting to new page
    event.preventDefault()
    //new item we will create and sent to mongodb
    const newItem = {
      title: item.title,
      description: item.description
    };
    //post request to http://localhost:3001/newitem
    axios.post('/newitem', newItem)
    console.log(newItem)
    alert('item added')
    //cleaar the state
    setItem({
      title: "",
      description:"",
    })
  }

  //axios delete request by id
  function deleteItem(id){
    axios.delete('/delete/' + id);
    alert('item deleted')
    console.log(`Deleted item with id ${id}`)
  }

  //when isPut is false then we are using add item mode to create a new item
  //when we click update it switches the form to upate mode so the button triggers an updateItem instea of addItem onclick 
  function openUpdate(id){

    setIsPut(true);
    //sets the item being updated as whatever was in the updatedItem state plus the current id.
    setUpdatedItem((prevInput)=>{
      return{
          ...prevInput,
          id: id,
        }
    })
  }

  function updateItem(id){
    //axios put request to modify the item in the db
    axios.put('/put/'+id, updatedItem)
    alert('item updated');
    console.log(`item with id ${id} updated`)
  }

  //onChange handler
  function handleUpdate(event){
    //destructure the event based on the specific input
    const {name, value} = event.target
    //set state for updatedItem copy the current state of updated item and set the specific key and value.
    setUpdatedItem((prevInput)=>{
      return{
        ...prevInput,
        [name]: value,

      }
    })
    console.log(updatedItem)
  }

  return (
    //this is a form
    <div className="App">
      {!isPut?
      (<div className='main'>
        {/* onchange handler for setting the item we are adding. We are modelling the item state with the handle chan  */}
        <input onChange={handleChange} name='title' value={item.title} placeholder='title' type="text" />
        <input onChange={handleChange} name='description' value={item.description} placeholder='description' type="text" />
        <button onClick={addItem}>ADD ITEM</button>
      </div>):(
        // moddle the inputs for the item we are updating
        <div className='main'>
          <input onChange={handleUpdate} name='title' value={updatedItem.title} placeholder='title' type="text" />
          <input onChange={handleUpdate} name='description' value={updatedItem.description} placeholder='description' type="text" />
          <button onClick={()=>updateItem(updatedItem.id)}>UPDATE ITEM</button>
      </div>

      )}
      
      {items.map((item)=>(
        //unique id from mongo db as key
        <div key={item._id} style={{background: 'pink', width: '40%', margin:"auto auto"}}>
          <p>{item.title}</p>
          <p>{item.description}</p>
          <button onClick={()=>deleteItem(item._id)}>DELETE</button>
          {/* open update mode */}
          <button onClick={()=>openUpdate(item._id)}>UPDATE</button>
        </div>
        )
      )}
    </div>
  );
}

export default App;
