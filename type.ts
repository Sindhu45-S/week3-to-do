document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // Types
  // =========================
  interface Task {
    id?: number;       // Optional (API tasks have id, local may not)
    text: string;
    completed: boolean;
  }

  // =========================
  // Global variables
  // =========================
  const API_URL: string = "https://jsonplaceholder.typicode.com/todos"; // Example API
  let tasks: Task[] = JSON.parse(localStorage.getItem("tasks") || "[]");
  let currentFilter: "all" | "completed" | "incomplete" = "all";

  // =========================
  // Save & Load
  // =========================
  function saveTasks(): void {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // =========================
  // Add new task (API + local update)
  // =========================
  async function addTask(text: string): Promise<void> {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: text, completed: false })
    });

    const newTask: { id: number; title: string } = await res.json();
    tasks.push({ id: newTask.id, text: newTask.title, completed: false });
    saveTasks();
    renderTasks();
  }

  // =========================
  // Toggle complete (API)
  // =========================
  async function toggleTask(id: number): Promise<void> {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    task.completed = !task.completed;

    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...task, title: task.text })
    });

    saveTasks();
    renderTasks();
  }

  // =========================
  // Render tasks
  // =========================
  function renderTasks(): void {
    taskList.innerHTML = "";

    let filteredTasks: Task[] = tasks;
    if (currentFilter === "completed") {
      filteredTasks = tasks.filter(t => t.completed);
    } else if (currentFilter === "incomplete") {
      filteredTasks = tasks.filter(t => !t.completed);
    }

    filteredTasks.forEach((task: Task) => {
      const li: HTMLLIElement = document.createElement("li");
      if (task.completed) li.classList.add("completed");

      const taskWrapper: HTMLDivElement = document.createElement("div");
      taskWrapper.className = "task-text";

      const checkbox: HTMLInputElement = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.completed;
      checkbox.addEventListener("change", () => {
        task.completed = checkbox.checked;
        saveTasks();
        renderTasks();
      });

      const span: HTMLSpanElement = document.createElement("span");
      span.textContent = task.text;

      taskWrapper.appendChild(checkbox);
      taskWrapper.appendChild(span);

      const delBtn: HTMLSpanElement = document.createElement("span");
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

  // =========================
  // UI Setup
  // =========================
  const container: HTMLDivElement = document.createElement("div");
  container.className = "container";
  document.body.appendChild(container);

  // Only one title now
  const appTitle: HTMLHeadingElement = document.createElement("h1");
  appTitle.textContent = "📝 To-Do List";
  container.appendChild(appTitle);

  const inputSection: HTMLDivElement = document.createElement("div");
  inputSection.className = "input-section";
  container.appendChild(inputSection);

  const taskInput: HTMLInputElement = document.createElement("input");
  taskInput.type = "text";
  taskInput.placeholder = "What To Do...";
  inputSection.appendChild(taskInput);

  const addBtn: HTMLButtonElement = document.createElement("button");
  addBtn.textContent = "Drop In";
  inputSection.appendChild(addBtn);

  const taskList: HTMLUListElement = document.createElement("ul");
  container.appendChild(taskList);

  addBtn.addEventListener("click", () => {
    if (taskInput.value.trim() === "") return;
    tasks.push({ text: taskInput.value.trim(), completed: false });
    taskInput.value = "";
    saveTasks();
    renderTasks();
  });

  // =========================
  // Filter dropdown
  // =========================
  const filterWrapper: HTMLDivElement = document.createElement("div");
  filterWrapper.className = "filter-wrapper";

  const filterBtn: HTMLButtonElement = document.createElement("button");
  filterBtn.innerHTML = '<i class="fa-solid fa-filter"></i>';
  filterBtn.className = "filter-btn";

  const filterMenu: HTMLUListElement = document.createElement("ul");
  filterMenu.className = "filter-menu";
  filterMenu.style.display = "none";

  const allOption: HTMLLIElement = document.createElement("li");
  allOption.textContent = "All";
  allOption.addEventListener("click", () => {
    currentFilter = "all";
    filterMenu.style.display = "none";
    renderTasks();
  });

  const completedOption: HTMLLIElement = document.createElement("li");
  completedOption.textContent = "Completed";
  completedOption.addEventListener("click", () => {
    currentFilter = "completed";
    filterMenu.style.display = "none";
    renderTasks();
  });

  const incompleteOption: HTMLLIElement = document.createElement("li");
  incompleteOption.textContent = "Incomplete";
  incompleteOption.addEventListener("click", () => {
    currentFilter = "incomplete";
    filterMenu.style.display = "none";
    renderTasks();
  });

  filterMenu.appendChild(allOption);
  filterMenu.appendChild(completedOption);
  filterMenu.appendChild(incompleteOption);

  filterWrapper.appendChild(filterBtn);
  filterWrapper.appendChild(filterMenu);
  inputSection.appendChild(filterWrapper);

  filterBtn.addEventListener("click", () => {
    filterMenu.style.display = filterMenu.style.display === "none" ? "block" : "none";
  });

  // =========================
  // Initial render
  // =========================
  renderTasks();
});
