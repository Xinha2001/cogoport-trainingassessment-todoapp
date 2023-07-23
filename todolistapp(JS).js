let tasks = [];
let completedTasks = [];
let pendingTasks = [];
let searchResults = [];
let reminderTasks = [];
function getTodoListFromLocalStorage() {
const storedTasks = localStorage.getItem("tasks");
if (storedTasks) {
tasks = JSON.parse(storedTasks);
}
}
window.addEventListener("DOMContentLoaded", () => {
getTodoListFromLocalStorage();
renderTasks();
});

const priorityInput = document.getElementById("priorityInput");
function changeHeaderColor() {
 const headerElement = document.querySelector(".header_css");
 const colors = ["red", "green", "blue", "orange", "purple", "yellow"]; 

 setInterval(() => {
   const randomIndex = Math.floor(Math.random() * colors.length);
   const randomColor = colors[randomIndex];
   headerElement.style.color = randomColor;
 }, 1000); 
}

changeHeaderColor();
function renderSubtasks(subtasks, taskId) {
let subtaskRows = "";
for (let i = 0; i < subtasks.length; i++) {
const subtask = subtasks[i];
subtaskRows += `
<tr data-subtask-id="${subtask.id}">
<td>${
subtask.isEditing
 ? `<input class="input" type="text" value="${subtask.taskDetails}" data-task-index="${taskId}" data-subtask-id="${subtask.id}" data-name="subtask" />`
 : subtask.taskDetails
}</td>
<td>${
subtask.isEditing
 ? `<input class="input" type="text" value="${subtask.category}" data-task-index="${taskId}" data-subtask-id="${subtask.id}" data-name="category" />`
 : subtask.category
}</td>
<td>
<button class="btn btnDone" onclick="toggleSubtaskStatus(${taskId}, ${
 subtask.id
})">
 ${subtask.isDone ? "Mark as Undone" : "Mark as Done"}
</button>
<button class="btn btnRemove" onclick="removeSubtask(${taskId}, ${
 subtask.id
})">Remove</button>
</td>
</tr>
`;
}
return subtaskRows;
}

function addSubtask(taskId) {
const taskIndex = tasks.findIndex((task) => task.id === taskId);
if (taskIndex !== -1 && !tasks[taskIndex].isDone) {
const subtaskId = Date.now();
tasks[taskIndex].subtasks = tasks[taskIndex].subtasks || [];

const subtaskInput = document.createElement("input");
subtaskInput.classList.add("input");
subtaskInput.setAttribute("type", "text");
subtaskInput.setAttribute("placeholder", "Enter subtask");
subtaskInput.setAttribute("data-name", "subtask");
subtaskInput.setAttribute("data-task-index", taskIndex);
subtaskInput.setAttribute("data-subtask-id", subtaskId);

const categoryInput = document.createElement("input");
categoryInput.classList.add("input");
categoryInput.setAttribute("type", "text");
categoryInput.setAttribute("placeholder", "Enter category");
categoryInput.setAttribute("data-name", "category");
categoryInput.setAttribute("data-task-index", taskIndex);
categoryInput.setAttribute("data-subtask-id", subtaskId);

const addSubtaskButton = document.createElement("button");
addSubtaskButton.classList.add("btn", "btnAddSubtask");
addSubtaskButton.setAttribute(
 "onclick",
 `saveSubtask(${taskId}, ${subtaskId})`
);
addSubtaskButton.innerText = "Save Subtask";

const cancelSubtaskButton = document.createElement("button");
cancelSubtaskButton.classList.add("btn", "btnRemove");
cancelSubtaskButton.setAttribute(
 "onclick",
 `cancelAddSubtask(${taskId}, ${subtaskId})`
);
cancelSubtaskButton.innerText = "Cancel";

const actionCell = document.createElement("td");
actionCell.setAttribute("colspan", "6");
actionCell.appendChild(subtaskInput);
actionCell.appendChild(categoryInput);
actionCell.appendChild(addSubtaskButton);
actionCell.appendChild(cancelSubtaskButton);

const newRow = document.createElement("tr");
newRow.appendChild(actionCell);

const subtaskRow = document.createElement("tr");
const subtaskCell = document.createElement("td");
subtaskCell.setAttribute("colspan", "6");
subtaskCell.innerHTML = `
<table>
<thead>
 <tr>
   <th>Subtask</th>
   <th>Category</th>
   <th>Action</th>
 </tr>
</thead>
<tbody>
 ${renderSubtasks(tasks[taskIndex].subtasks, taskId)}
</tbody>
</table>
`;
subtaskRow.appendChild(subtaskCell);

taskList.insertBefore(newRow, taskList.children[taskIndex + 1]);
taskList.insertBefore(subtaskRow, taskList.children[taskIndex + 2]);
}
}

function toggleSubtaskStatus(taskId, subtaskId) {
const taskIndex = tasks.findIndex((task) => task.id === taskId);
if (taskIndex !== -1) {
const subtaskIndex = tasks[taskIndex].subtasks.findIndex(
 (subtask) => subtask.id === subtaskId
);
if (subtaskIndex !== -1 && !tasks[taskIndex].isEditing) {
 tasks[taskIndex].subtasks[subtaskIndex].isDone =
   !tasks[taskIndex].subtasks[subtaskIndex].isDone;
 renderTasks();
}
}
}

function removeSubtask(taskId, subtaskId) {
const taskIndex = tasks.findIndex((task) => task.id === taskId);
if (taskIndex !== -1) {
const subtaskIndex = tasks[taskIndex].subtasks.findIndex(
 (subtask) => subtask.id === subtaskId
);
if (subtaskIndex !== -1 && !tasks[taskIndex].isEditing) {
 tasks[taskIndex].subtasks.splice(subtaskIndex, 1);
 renderTasks();
}
}
}

function cancelAddSubtask(taskId, subtaskId) {
const taskIndex = tasks.findIndex((task) => task.id === taskId);
if (taskIndex !== -1) {
const subtaskIndex = tasks[taskIndex].subtasks.findIndex(
 (subtask) => subtask.id === subtaskId
);
if (subtaskIndex !== -1) {
 tasks[taskIndex].subtasks.splice(subtaskIndex, 1);
 renderTasks();
}
}
}

function renderTasks() {
const taskList = document.getElementById("taskList");
taskList.innerHTML = "";

for (let i = 0; i < tasks.length; i++) {
const task = tasks[i];

const row = document.createElement("tr");
row.innerHTML = `
 <td>${
   task.isEditing
     ? '<input class="input" type="text" value="' +
       task.taskDetails +
       '" data-name="taskDetails" />'
     : task.taskDetails
 }</td>
 <td>${
   task.isEditing
     ? '<input class="input" type="text" value="' +
       task.category +
       '" data-name="category" />'
     : task.category
 }</td>
 <td>${
   task.isEditing
     ? '<input class="input" type="date" value="' +
       task.dueDate +
       '" data-name="dueDate" />'
     : task.dueDate
 }</td>
 <td>${
   task.isEditing
     ? `<select class="input" data-name="priority">
         <option value="Low" ${
           task.priority === "Low" ? "selected" : ""
         }>Low</option>
         <option value="Medium" ${
           task.priority === "Medium" ? "selected" : ""
         }>Medium</option>
         <option value="High" ${
           task.priority === "High" ? "selected" : ""
         }>High</option>
       </select>`
     : task.priority
 }</td>
 <td>${task.isDone ? "Done" : "Undone"}</td>
 <td>${task.tag}</td>
 <td>
   <button class="btn btnDone" onclick="toggleTaskStatus(${task.id})">${
 task.isDone ? "Mark as Undone" : "Mark as Done"
}</button>
   <button class="btn btnRemove" onclick="removeTask(${
 task.id
})">Remove</button>
   <button class="btn btnEdit" onclick="${
 task.isEditing
   ? "saveTask(" + task.id + ")"
   : "editTask(" + task.id + ")"
}">${task.isEditing ? "Save" : "Edit"}</button>
   ${
 task.isEditing
   ? ""
   : '<button class="btn btnAddSubtask" onclick="addSubtask(' +
     task.id +
     ')">Add Subtask</button>'
}
 </td>
`;

row.setAttribute("data-task-index", i);

if (task.isEditing) {
 row.classList.add("editing");
}

if (task.subtasks && task.subtasks.length > 0) {
 const subtaskRow = document.createElement("tr");
 const subtaskCell = document.createElement("td");
 subtaskCell.setAttribute("colspan", "7"); 
 subtaskCell.innerHTML = `
   <table>
     <thead>
       <tr>
         <th>Subtask</th>
         <th>Category</th>
         <th>Action</th>
       </tr>
     </thead>
     <tbody>
       ${renderSubtasks(task.subtasks, task.id)}
     </tbody>
   </table>
 `;
 subtaskRow.appendChild(subtaskCell);
 taskList.appendChild(subtaskRow);
}

taskList.appendChild(row);
}

}

function createInput(name, value) {
return `<input class="inputRender" type="text" value="${value}" data-name="${name}" />`;
}

function addTask() {
const taskInput = document.getElementById("taskInput");
const categoryInput = document.getElementById("categoryInput");
const dueDateInput = document.getElementById("dueDateInput");
const priorityInput = document.getElementById("priorityInput");
const tagInput = document.getElementById("tagInput"); 
const taskDetails = taskInput.value.trim();
const category = categoryInput.value.trim() || "N.A";
const dueDate = dueDateInput.value.trim() || "N.A";
const priority = priorityInput.value;
const tag = tagInput.value.trim(); 

if (taskDetails !== "" && category !== "") {
const taskId = Date.now();
const newTask = {
 taskDetails,
 category,
 dueDate,
 priority,
 tag, 
 id: taskId,
 isEditing: false,
 isDone: false,
};

tasks.push(newTask);
taskInput.value = "";
categoryInput.value = "";
dueDateInput.value = "";
tagInput.value = ""; 
renderTasks();
saveTodoListToLocalStorage();
renderTasks();
}
}

function removeTask(taskId) {
const taskIndex = tasks.findIndex((task) => task.id === taskId);

if (taskIndex !== -1) {
tasks.splice(taskIndex, 1);
saveTodoListToLocalStorage();
renderTasks();
}
}

function toggleTaskStatus(taskId) {
const taskIndex = tasks.findIndex((task) => task.id === taskId);

if (taskIndex !== -1 && !tasks[taskIndex].isEditing) {
tasks[taskIndex].isDone = !tasks[taskIndex].isDone;
saveTodoListToLocalStorage();
renderTasks();
}
}

function editTask(taskId) {
const taskIndex = tasks.findIndex((task) => task.id === taskId);
if (taskIndex !== -1 && !tasks[taskIndex].isDone) {
tasks[taskIndex].isEditing = !tasks[taskIndex].isEditing;
renderTasks();
}
}
function sortTasks() {
const sortOption = document.getElementById("sortOption").value;
if (sortOption === "Date") {
 tasks.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
} else if (sortOption === "Priority") {
 tasks.sort((a, b) => {
   const priorityOrder = { "High": 3, "Medium": 2, "Low": 1 };
   return priorityOrder[b.priority] - priorityOrder[a.priority];
 });
}
renderTasks();
}
function groupByTag() {
 const groupTagInput = document.getElementById("groupTagInput");
 const groupTag = groupTagInput.value.trim().toLowerCase();

 if (groupTag === "") {
   renderTasks(); 
   return;
 }

 const matchingTasks = [];
 const nonMatchingTasks = [];

 for (const task of tasks) {
   const taskTag = task.tag.trim().toLowerCase();
   if (taskTag === groupTag) {
     matchingTasks.push(task);
   } else {
     nonMatchingTasks.push(task);
   }
 }

 
 const groupedTasks = matchingTasks.concat(nonMatchingTasks);

 tasks = groupedTasks;
 renderTasks();
}
function saveTask(taskId) {
const taskIndex = tasks.findIndex((task) => task.id === taskId);
if (taskIndex !== -1) {
const taskInput = document.querySelector(`[data-name="taskDetails"]`);
const categoryInput = document.querySelector(
 `[data-name="category"]`
);
const dueDateInput = document.querySelector(`[data-name="dueDate"]`);
const priorityInput = document.querySelector(
 `[data-name="priority"]`
);
const taskDetails = taskInput.value.trim();
const category = categoryInput.value.trim() || "N.A";
const dueDate = dueDateInput.value.trim() || "N.A";
const priority = priorityInput.value;

if (taskDetails !== "" && category !== "") {
 tasks[taskIndex].taskDetails = taskDetails;
 tasks[taskIndex].category = category;
 tasks[taskIndex].dueDate = dueDate;
 tasks[taskIndex].priority = priority;
 tasks[taskIndex].isEditing = false;
 renderTasks();
}
}
}
function renderSearchResults() {
 const taskList = document.getElementById("taskList");
 taskList.innerHTML = "";

 for (const task of searchResults) {
   const row = createTaskRow(task);
   taskList.appendChild(row);
 }
}
function searchTasks() {
 const searchInput = document.getElementById("searchInput").value.trim().toLowerCase();
 if (searchInput === "") {
   searchResults = [];
   renderTasks();
 } else {
   searchResults = tasks.filter(
     task =>
       task.taskDetails.toLowerCase().includes(searchInput) ||
       task.category.toLowerCase().includes(searchInput)
   );
   renderSearchResults();
 }
}
function changeBackgroundColor() {
const colors = ["pink", "#ffc8dd", "#faedcd", "#c8b6ff", "#f1fae0", "#a8dadc", "#8ecae6", "#e5e5e5"];
const todoContainer = document.querySelector(".todo-container");

let currentIndex = 0;

setInterval(() => {
 todoContainer.style.transition = "background-color 1s ease";
 todoContainer.style.backgroundColor = colors[currentIndex];
 currentIndex = (currentIndex + 1) % colors.length;
}, 2000);
}

// Call the function to start the background color change effect
changeBackgroundColor();
function toggleTaskStatus(taskId) {
 const taskIndex = tasks.findIndex((task) => task.id === taskId);

 if (taskIndex !== -1 && !tasks[taskIndex].isEditing) {
   tasks[taskIndex].isDone = !tasks[taskIndex].isDone;
   saveTodoListToLocalStorage();

   if (tasks[taskIndex].isDone) {
     completedTasks.push(tasks[taskIndex]);
     pendingTasks = pendingTasks.filter((task) => task.id !== taskId);
   } else {
     pendingTasks.push(tasks[taskIndex]);
     completedTasks = completedTasks.filter((task) => task.id !== taskId);
   }

   renderTasks();
 }
}
function viewCompletedTasks() {
 taskList.innerHTML = "";
 for (const task of completedTasks) {
   const row = createTaskRow(task);
   taskList.appendChild(row);
 }
}
function viewPendingTasks() {
 taskList.innerHTML = "";
 for (const task of pendingTasks) {
   const row = createTaskRow(task);
   taskList.appendChild(row);
 }
}
function handleKeyPress(event) {
if (event.keyCode === 13) {
 addTask(); 
}
}
function createTaskRow(task) {
 const row = document.createElement("tr");
 row.innerHTML = `

   <td>${task.isEditing ? createInput("taskDetails", task.taskDetails) : task.taskDetails}</td>
   <td>${task.isEditing ? createInput("category", task.category) : task.category}</td>
   <td>${task.isEditing ? createInput("dueDate", task.dueDate) : task.dueDate}</td>
   <td>${task.isEditing ? createPrioritySelect(task.priority) : task.priority}</td>
   <td>${task.isDone ? "Done" : "Undone"}</td>
   <td>
     <button class="btn btnDone" onclick="toggleTaskStatus(${task.id})">${task.isDone ? "Mark as Undone" : "Mark as Done"}</button>
     <button class="btn btnRemove" onclick="removeTask(${task.id})">Remove</button>
     <button class="btn btnEdit" onclick="${task.isEditing ? `saveTask(${task.id})` : `editTask(${task.id})`}">${task.isEditing ? "Save" : "Edit"}</button>
     ${task.isEditing ? "" : `<button class="btn btnAddSubtask" onclick="addSubtask(${task.id})">Add Subtask</button>`}
   </td>
   <td>${task.tag}</td>
 `;
 row.setAttribute("data-task-index", tasks.indexOf(task));
 if (task.isEditing) {
   row.classList.add("editing");
 }

 return row;
}
function saveTodoListToLocalStorage() {
localStorage.setItem("tasks", JSON.stringify(tasks));
}

function saveSubtask(taskId, subtaskId) {
const taskIndex = tasks.findIndex((task) => task.id === taskId);

if (taskIndex !== -1) {
const taskInput = document.querySelector(
 `[data-subtask-id="${subtaskId}"][data-name="subtask"]`
);
const categoryInput = document.querySelector(
 `[data-subtask-id="${subtaskId}"][data-name="category"]`
);

const taskDetails = taskInput.value.trim();
const category = categoryInput.value.trim() || "N.A";

if (taskDetails !== "" && category !== "") {
 const subtaskIndex = tasks[taskIndex].subtasks.findIndex(
   (subtask) => subtask.id === subtaskId
 );

 if (subtaskIndex !== -1) {
   tasks[taskIndex].subtasks[subtaskIndex].taskDetails = taskDetails;
   tasks[taskIndex].subtasks[subtaskIndex].category = category;
   tasks[taskIndex].subtasks[subtaskIndex].isEditing = false;
   const subtaskRow = document.querySelector(
     `[data-subtask-id="${subtaskId}"]`
   );
   const newSubtaskRow = document.createElement("tr");
   newSubtaskRow.innerHTML = `
 <td>${taskDetails}</td>
 <td>${category}</td>
 <td>
   <button class="btn btnDone" onclick="toggleSubtaskStatus(${taskId}, ${subtaskId})">
     ${
       tasks[taskIndex].subtasks[subtaskIndex].isDone
         ? "Mark as Undone"
         : "Mark as Done"
     }
   </button>
   <button class="btn btnRemove" onclick="removeSubtask(${taskId}, ${subtaskId})">Remove</button>
 </td>
`;
   newSubtaskRow.setAttribute("data-subtask-id", subtaskId);
   subtaskRow.replaceWith(newSubtaskRow);
   renderTasks();
 } else {
   const newSubtask = {
     id: subtaskId,
     taskDetails,
     category,
     isEditing: false,
     isDone: false,
   };

   tasks[taskIndex].subtasks.push(newSubtask);
   renderTasks();
 }
}
}
}

renderTasks(); 
