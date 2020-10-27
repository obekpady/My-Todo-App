//store todo items
let todoItems = [];
//function to create new todo items and render on the page.
function renderTodo(todo) {
    //store todo items into browser storage.
    localStorage.setItem("todoItem", JSON.stringify(todoItems));
    //get reference of required elements.
    const list = document.querySelector(".js-todo-list");
    const item = document.querySelector(`[data-key='${todo.id}']`);

    //Runs a check for deleted items and update the DOM.
    if (todo.deleted) {
        item.remove();
        if (todoItems.length === 0) list.innerHTML = "";
        return;
    }
    //Evaluate the done state of a todo entry
    const isChecked = todo.checked ? "done" : "";
    //create a list item that holds todo entry.
    const listItemElement = document.createElement("li");

    // set class and data-key attributes to the todo entry.
    listItemElement.setAttribute("class", `todo-item ${isChecked}`);
    listItemElement.setAttribute("data-key", todo.id);
    //populate the todo entry with required values.
    listItemElement.innerHTML = `
    <input id ="${todo.id}" type="checkbox"/>
    <label for="${todo.id}" class="tick js-tick"></label>
    <span>${todo.text}</span>
    <button class="delete-todo js-delete-todo">
    &times;
    </button>
    `;
    //Run condition to append the created item to the page.
    if (item) {
        list.replaceChild(listItemElement, item);
    }
    else {
        list.append(listItemElement);
    }
}
// define function to create a  new todo entry.
function addTodo(text) {
    //define todo entry object structure.
    const todo = {
        text,
        checked: false,
        id: Date.now(),
    };
    //add new todo entry to the array collection
    todoItems.push(todo);
    //trigger page update by invoking renderTodo function
    renderTodo(todo);
}
//get reference of todo entry form element.
const form = document.querySelector(".js-form");
//bind an event listener on form submission.
form.addEventListener("submit", (event) => {
    //prevent default behaviour of form submission.
    event.preventDefault();
    //get reference of the input element
    const input = document.querySelector(".js-todo-input");
    //remove whitespace on both ends of a todo entry strings
    const text = input.value.trim();
    //check for empty value and create todo items
    if (text !== "") {
        //invoke addTodo function to commit change.
        addTodo(text);
        //Reset the value of the input element.
        input.value = "";
        //Set focus to the inpute element
        input.focus();

    }
});
//define function to toggle the done state of a todo entry.
function toggleDone(key) {
    //Retrieve the index of the toggle entry in the collection.
    const index = todoItems.findIndex((item) => item.id === Number(key));
    //toggle the checked attributes values of the todo entry
    todoItems[index].checked = !todoItems[index].checked;
    //trigger page update by invoking the renderTodo Function.
    renderTodo(todoItems[index]);
}
//Define function to delete a todo entry.
function deleteTodo(key) {
    //Retrieve the index of the todo entry in the collection.   
    const index = todoItems.findIndex((item) => item.id === Number(key));
    //Set delete attribute to true for todo entry
    const todo = {
        deleted: true,
        ...todoItems[index],

    };
    todoItems = todoItems.filter((item) => item.id !== Number(key));
    // console.table(todoItems)
    //trigger page update by invoking renderTodo function.
    renderTodo(todo);
}
//get reference to ulElement
const list = document.querySelector(".js-todo-list");
//bind click event listener ulElement.
list.addEventListener("click", (event) => {
    //traverse the DOM to check for the class name 'js-tick' aand invoke the toggledone function if check  return true
    if (event.target.classList.contains("js-tick")) {
        //retrieve the data key attribute value.  
        const itemKey = event.target.parentElement.dataset.key;
        //invoke the toggledone function to update todo entry state.
        toggleDone(itemKey);
    }
    //traverse the DOM to check for the class name 'js-delete-todo' and invoke the deleteTodo function if check return true.
    if (event.target.classList.contains("js-delete-todo")) {
        // console.log(event.target)
        //retrieve data key attribute value
        const itemKey = event.target.parentElement.dataset.key;
        // console.log(itemKey)
        
        //invoke to deleteTodo function.
        deleteTodo(itemKey);
    }
});
//bind event listener of DOM content loaded to document object
document.addEventListener("DOMContentLoaded", () => {
    //get stored todo entry from browser local storage.
    const ref = localStorage.getItem("todoItem");
    //check that we have entry on the local storage.
    if (ref) {
        //converts todo entries to an array collection
        todoItems = JSON.parse(ref);
        //iterate through the collection and update the web page.
        todoItems.forEach((t) => {
            //invoke renderTodo function.
            renderTodo(t);
        });
    }
});