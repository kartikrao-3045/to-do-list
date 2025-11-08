// === Select Elements ===
const addBtn = document.getElementById("add-btn");
const taskInput = document.getElementById("task-input");
const categorySelect = document.getElementById("category");
const prioritySelect = document.getElementById("priority");
const taskList = document.getElementById("task-list");
const filterCategory = document.getElementById("filter-category");

// === Event Listeners ===
document.addEventListener("DOMContentLoaded", loadTasks);
addBtn.addEventListener("click", addTask);
filterCategory.addEventListener("change", filterTasks);

// === Add Task ===
function addTask() {
  const text = taskInput.value.trim();
  if (text === "") {
    alert("Please enter a task!");
    return;
  }

  const task = {
    text,
    category: categorySelect.value,
    priority: prioritySelect.value,
    completed: false,
  };

  const li = createTaskElement(task);
  taskList.appendChild(li);

  saveTasks();
  taskInput.value = "";
}

// === Create Task Element ===
function createTaskElement(task) {
  const li = document.createElement("li");
  li.classList.add(`priority-${task.priority.toLowerCase()}`);
  if (task.completed) li.classList.add("completed");

  const taskInfo = document.createElement("div");
  taskInfo.classList.add("task-info");
  taskInfo.innerHTML = `
  <strong>${task.text}</strong>
  <div class="task-meta">${task.category} • ${task.priority}</div>
`;

  const buttons = document.createElement("div");
  buttons.classList.add("action-btns");
  buttons.innerHTML = `
  <button class="complete-btn">✔️</button>
  <button class="edit-btn">✏️</button>
  <button class="delete-btn">❌</button>
`;

  // === Button Actions ===
  buttons.querySelector(".complete-btn").addEventListener("click", () => {
    li.classList.toggle("completed");
    saveTasks();
  });

  buttons.querySelector(".edit-btn").addEventListener("click", () => {
    const newText = prompt("Edit your task:", task.text);
    if (newText && newText.trim() !== "") {
      li.querySelector("strong").textContent = newText.trim();
      saveTasks();
    }
  });

  buttons.querySelector(".delete-btn").addEventListener("click", () => {
    li.remove();
    saveTasks();
  });

  li.appendChild(taskInfo);
  li.appendChild(buttons);

  // Store metadata
  li.dataset.category = task.category;
  li.dataset.priority = task.priority;

  return li;
}

// === Save Tasks ===
function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#task-list li").forEach((li) => {
    tasks.push({
      text: li.querySelector("strong").textContent,
      category: li.dataset.category,
      priority: li.dataset.priority,
      completed: li.classList.contains("completed"),
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// === Load Tasks ===
function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
  savedTasks.forEach((task) => {
    const li = createTaskElement(task);
    taskList.appendChild(li);
  });
}

// === Filter by Category ===
function filterTasks() {
  const selected = filterCategory.value;
  document.querySelectorAll("#task-list li").forEach((li) => {
    li.style.display =
      selected === "All" || li.dataset.category === selected ? "flex" : "none";
  });
}

