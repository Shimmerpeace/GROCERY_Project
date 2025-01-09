
//****** SELECT ITEMS ********/
// querySelector() selects or returns the first element in the HTML documents that matches
//  the specified selector (e.g .alert)
const alert = document.querySelector(".alert");
const form = document.querySelector(".grocery-form");
const grocery = document.getElementById("grocery");
const submitBtn = document.querySelector(".submit-btn");
const container = document.querySelector(".grocery-container");
const list = document.querySelector(".grocery-list");
const clearBtn = document.querySelector(".clear-btn");

// edit option
let editElement;
let editFlag = false;
let editID = "";

// *** EVENT LISTENERS FOR FORMS*****
form.addEventListener("submit", addItem); // submit form
// **** FUNCTIONS FOR FORMS *****
function addItem(e) { 
    e.preventDefault();
    const value = grocery.value;
    const id = new Date().getTime().toString();        

    /* 
    if(value !== "" && editFlag === false) {console.log("add item to the list");}
    else if(value !== "" && editFlag === true) {console.log("editing");}
    else {console.log("empty value");}
    */

    if (value && !editFlag) {
        createListItem(id, value)
        displayAlert("item added to the list", "success"); // display alert      
        container.classList.add("show-container"); // show container
        addToLocalStorage(id,value); // add to local storage
        setBackToDefault(); // set back to default
    }
     else if (value && editFlag) {
        editElement.innerHTML = value;
        displayAlert("value changed", "success"); 
        // edit local storage
        editLocalStorage(editID, value);
        setBackToDefault()
    } else {
       displayAlert("please enter value", "danger"); 
    }
}
// delete function
function deleteItem(e) {
const element = e.currentTarget.parentElement.parentElement;
const id = element.dataset.id;
list.removeChild(element);
if (list.children.length === 0) {
    container.classList.remove("show-container");
}
displayAlert("item removed", "danger");
setBackToDefault();
// remove from local storage
removeFromLocalStorage(id);
}

// edit function
function editItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    // set edit item
    editElement = e.currentTarget.parentElement.previousElementSibling;
    // set form value
    grocery.value = editElement.innerHTML;
    editFlag = true;
    editID = element.dataset.id;
    submitBtn.textContent = "edit";    
}

//  display alert function
function displayAlert(text,action){
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);

    // remove alert 
    setTimeout(function() {
    alert.textContent = "";
    alert.classList.remove(`alert-${action}`);
},1000);
}

// *** EVENT LISTENERS TO CLEAR ITEMS *****
clearBtn.addEventListener("click", clearItems); // clear items



// **** FUNCTIONS FOR CLEAR ITEMS *****
function clearItems() {
    const items = document.querySelectorAll(".grocery-item");

    if (items.length > 0) {
        items.forEach(function (item) {
            list.removeChild(item);
        });
    }
    container.classList.remove("show-container");
    displayAlert("empty list", "danger");
    setBackToDefault();
    localStorage.removeItem("list");
}

// set back to default
function setBackToDefault() {
    grocery.value = "";
    editFlag = false;
    editID = "";
    submitBtn.textContent = "submit";
}
//****LOCAL STORAGE  ************/
function addToLocalStorage(id, value) {
    const grocery = {id, value};
    let items = getLocalStorage();
    items.push(grocery);
    localStorage.setItem("list", JSON.stringify(items));
    // console.log("added to local storage");
}
function removeFromLocalStorage(id) {
    let items = getLocalStorage();
    items = items.filter(function(item) {
        if(item.id !==id) {
            return item;
        }
    }) 
    localStorage.setItem("list", JSON.stringify(items));
}
function editLocalStorage(id, value) {
    let items = getLocalStorage();
    items = items.map(function(item) {
        if(item.id === id) {
            item.value = value;
        }
        return item;
    });
    localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage() {
    return localStorage.getItem("list") ? JSON.parse(localStorage.getItem("list")) : [];
}
// localStorage.setItem("orange",JSON.stringify(["item","item2"]));
// const oranges = JSON.parse(localStorage.getItem("orange"));
// console.log(oranges);
// localStorage.removeItem("orange");
//**** SETUP ITEMS  ************/
// load items
window.addEventListener("DOMContentLoaded", setupItems);

function setupItems() {
    let items = getLocalStorage();
    if(items.length > 0) {
        items.forEach(function(items) {
            createListItem(items.id, items.value)
    })
    container.classList.add("show-container")
    }
}

function createListItem(id, value) {
    const element = document.createElement("article");       
    element.classList.add("grocery-item"); // add class
    const attr = document.createAttribute("data-id"); // add id
    attr.value = id;
    element.setAttributeNode(attr);
    element.innerHTML = `<p class="title">${value}</p>
        <div class="btn-container">
        <button type="button" class="edit-btn"> Edit </i> </button>
        <button type="button" class="delete-btn"> Delete </i> </button>
        </div>`;
    const deleteBtn = element.querySelector(".delete-btn");
    const editBtn = element.querySelector(".edit-btn");

    deleteBtn.addEventListener("click", deleteItem);
    editBtn.addEventListener("click", editItem);

    list.appendChild(element); // append child
}


