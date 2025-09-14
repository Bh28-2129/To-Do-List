const API_URL = "http://127.0.0.1:5000/tasks";
let hiddenCompleted = {}; // stores only the  deleted and completed tasks(frontend only not backend)

// Fetch tasks on page load when the page loads
window.onload = getTasks;
async function getTasks() {
  const res = await fetch(API_URL);
  const tasks = await res.json();
  renderTasks(tasks);
}

// Render tasks on page from the bavckend
function renderTasks(tasks, onlyCompleted = false) {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";
  tasks.forEach(task => {
    // Skip tasks deleted from frontend
    if (hiddenCompleted[task._id]) return;
    // Show only completed tasks if filter is enabled
    if (onlyCompleted && task.status !== "completed") return;
    const card = document.createElement("div");
    card.className = "card shadow-xl p-4";
    let taskHtml = `
      <h5 class="card-title">${task.task}</h5>
      <p>Status: <span class="${task.status === "completed" ? "text-green-600" : "text-red-600"}">${task.status}</span></p>`;
    if (task.completed_date) {
      taskHtml += `<p class="text-sm text-gray-500">Completed on: ${task.completed_date}</p>`;
    }
    taskHtml += `<div class="mt-3">`;
    
    // Show Completed / Pending buttons
    taskHtml += `
        <button class="btn btn-success me-2" onclick="updateTask('${task._id}', 'completed')">Completed</button>
        <button class="btn btn-warning me-2" onclick="updateTask('${task._id}', 'pending')">Pending</button>
    `;

    // If task is completed → show Delete button (frontend only)
    if (task.status === "completed") {
      taskHtml += `<button class="btn btn-danger" onclick="deleteFromFrontend('${task._id}')">Delete</button>`;
    }
    taskHtml += `</div>`;
    card.innerHTML = taskHtml;
    taskList.appendChild(card);
  });
}

// Add new task
async function addTask() {
  const taskInput = document.getElementById("taskInput");
  const task = taskInput.value.trim();
  if (!task) return alert("Enter a task!");
  await fetch(API_URL, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({task})
  });
  taskInput.value = "";
  getTasks();
}

// Update task status
async function updateTask(id, status) {
  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({status})
  });
  getTasks();
}

// Delete task from frontend only not from backend
function deleteFromFrontend(id) {
  hiddenCompleted[id] = true;
  getTasks();
}

// Show only completed tasks
async function showCompletedTasks() {
  const res = await fetch(API_URL);
  const tasks = await res.json();
  renderTasks(tasks, true);
}
