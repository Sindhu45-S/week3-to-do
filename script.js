// Add new task
// Add new task (API + local update)
async function addTask(text) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: text, completed: false })
  });
  const newTask = await res.json();
  tasks.push({ id: newTask.id, text: newTask.title, completed: false });
  renderTasks();
}

// Render tasks
function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks;
  if (currentFilter === "completed") {
    filteredTasks = tasks.filter(t => t.completed);
  } else if (currentFilter === "incomplete") {
    filteredTasks = tasks.filter(t => !t.completed);
  }

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    const taskWrapper = document.createElement("div");
    taskWrapper.className = "task-text";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const span = document.createElement("span");
    span.textContent = task.text;

    taskWrapper.appendChild(checkbox);
    taskWrapper.appendChild(span);

    const delBtn = document.createElement("span");
    delBtn.className = "delete-btn";
    delBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
    delBtn.addEventListener("click", () => {
      tasks = tasks.filter(t => t !== task);
      saveTasks();
      renderTasks();
    });

    li.appendChild(taskWrapper);
    li.appendChild(delBtn);
    taskList.appendChild(li);
  });
}




// Toggle complete (API)
async function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  task.completed = !task.completed;
  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...task, title: task.text })
  });
  renderTasks();
}

// Create main container
const container = document.createElement("div");
container.className = "container";
document.body.appendChild(container);

// Title
const title = document.createElement("h1");
title.textContent = "📝To-Do List";
container.appendChild(title);

// Input section
const inputSection = document.createElement("div");
inputSection.className = "input-section";
container.appendChild(inputSection);

const taskInput = document.createElement("input");
taskInput.type = "text";
taskInput.placeholder = "What To Do...";
inputSection.appendChild(taskInput);

const addBtn = document.createElement("button");
addBtn.textContent = "Drop In";
inputSection.appendChild(addBtn);

// Task list
const taskList = document.createElement("ul");
container.appendChild(taskList);

// Load from localStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Save to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Add new task
addBtn.addEventListener("click", () => {
  if (taskInput.value.trim() === "") return;
  tasks.push({ text: taskInput.value.trim(), completed: false });
  taskInput.value = "";
  saveTasks();
  renderTasks();
});
// Filter button

// Filter dropdown
const filterWrapper = document.createElement("div");
filterWrapper.className = "filter-wrapper";

const filterBtn = document.createElement("button");
filterBtn.innerHTML = '<i class="fa-solid fa-filter"></i>'; 
filterBtn.className = "filter-btn";

const filterMenu = document.createElement("ul");
filterMenu.className = "filter-menu";
filterMenu.style.display = "none";

//  New option: All
const allOption = document.createElement("li");
allOption.textContent = "All";
allOption.addEventListener("click", () => {
  currentFilter = "all";
  filterMenu.style.display = "none";
  renderTasks();
});

const completedOption = document.createElement("li");
completedOption.textContent = "Completed";
completedOption.addEventListener("click", () => {
  currentFilter = "completed";
  filterMenu.style.display = "none";
  renderTasks();
});

const incompleteOption = document.createElement("li");
incompleteOption.textContent = "Incomplete";
incompleteOption.addEventListener("click", () => {
  currentFilter = "incomplete";
  filterMenu.style.display = "none";
  renderTasks();
});

// Add them all to menu
filterMenu.appendChild(allOption);
filterMenu.appendChild(completedOption);
filterMenu.appendChild(incompleteOption);

filterWrapper.appendChild(filterBtn);
filterWrapper.appendChild(filterMenu);
inputSection.appendChild(filterWrapper);

// Toggle dropdown
filterBtn.addEventListener("click", () => {
  filterMenu.style.display = filterMenu.style.display === "none" ? "block" : "none";
});

let currentFilter = "all"; // default

function renderTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks;
  if (currentFilter === "completed") {
    filteredTasks = tasks.filter(t => t.completed);
  } else if (currentFilter === "incomplete") {
    filteredTasks = tasks.filter(t => !t.completed);
  }

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    const taskWrapper = document.createElement("div");
    taskWrapper.className = "task-text";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const span = document.createElement("span");
    span.textContent = task.text;

    taskWrapper.appendChild(checkbox);
    taskWrapper.appendChild(span);

    const delBtn = document.createElement("span");
    delBtn.className = "delete-btn";
    delBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
    delBtn.addEventListener("click", () => {
      tasks = tasks.filter(t => t !== task);
      saveTasks();
      renderTasks();
    });

    li.appendChild(taskWrapper);
    li.appendChild(delBtn);
    taskList.appendChild(li);
  });
}



// Initial render
renderTasks();
