// Access DOM elements
const input = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todo-list');

function loadTaks () {
    try{
        const tasksfromStorage = localStorage.getItem('tasks');
        if(tasksfromStorage) return JSON.parse(tasksfromStorage)
        return [];
    }
    catch(error){
        console.error('Error parsing tasks from localStorage', error)
        return [];
    }
}
//Initialize tasks array to hold to-do items
let tasks = loadTaks();

let selectedTaskIndex = -1; // To keep track of selected task

// Add task
const addTask = () => {
    const newtask = input.value.trim();
    if(newtask && newtask !== ''){
        tasks.push({title: newtask, completed : false})
        input.value = '';
        selectedTaskIndex = tasks.length-1;
        renderTasks();
    }
    else{
        console.log("Please add task in the box");
    }
}

const editTask = (index) => {
    const newTitle = prompt('Edit Task:', tasks[index].title);
    if(newTitle){
        tasks[index].title = newTitle.trim();
        renderTasks();
    }
}

const clearTasks = () => {
    // Confirm with the user before clearing all tasks
    const confirmClear = confirm('Are you sure you want to clear all tasks?');
    if(confirmClear){
        tasks = [];
        localStorage.removeItem('tasks');
        renderTasks();
    }

}

const deleteTask = (index) => {
    tasks.splice(index, 1);
    selectedTaskIndex = Math.min(selectedTaskIndex, tasks.length-1)
    renderTasks();
}

// const clearTasks = () =>{
    
// }

const renderTasks = () => {
    // clear current List Items
    todoList.innerHTML = '';
    // Loop through tasks and add them to li tag
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span ${task.completed ? 'style="text-decoration: line-through"' : ''}>${task.title}</span>
            <div>
                <button onclick="editTask(${index})">Edit</button>
                <button onclick="deleteTask(${index})">Delete</button>
            </div>
        `
        if(index === selectedTaskIndex){
            li.classList.add('selected');
        }
        else{
            li.classList.remove('selected');
        }
        todoList.appendChild(li);
    });

    localStorage.setItem('tasks', JSON.stringify(tasks))

}

// select task using up and down arrows
const selectTask = (direction) => {
    if(tasks.length === 0) return;
    if(direction === 'up'){
        selectedTaskIndex = (selectedTaskIndex > 0) ? selectedTaskIndex -1 : tasks.length-1;
    } else if(direction === 'down'){
        selectedTaskIndex = (selectedTaskIndex < tasks.length-1) ? selectedTaskIndex + 1 : 0;
    }
    renderTasks()
}

// Handle Keyboard actions
document.addEventListener('keydown', (e) => {
    switch(e.key){
        case 'Enter':
            if(document.activeElement === input){
                addTask();
            }
            break;
        case 'e':
            if(selectedTaskIndex > 0){
                editTask(selectedTaskIndex);
            }
            break;
        case 'Delete':
        case 'Backkspace':
            if(selectedTaskIndex > 0){
                deleteTask(selectedTaskIndex);
            }
            break;
        case 'ArrowUp':
            selectTask('up');
            break;
        case 'ArrowDown':
            selectTask('down');
            break;
    }
})

// Event listener for adding a task via button click
addTaskBtn.addEventListener('click', addTask);

// Initial render of tasks (from localStorage)
renderTasks();
