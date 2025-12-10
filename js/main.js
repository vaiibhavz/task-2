// main.js - Contact form validation + helpers
document.addEventListener('DOMContentLoaded', function () {
  // Elements
  const form = document.getElementById('contactForm');
  const nameEl = document.getElementById('name');
  const emailEl = document.getElementById('email');
  const messageEl = document.getElementById('message');
  const formMsg = document.getElementById('formMsg');
  const resetBtn = document.getElementById('resetBtn');

  if (!form || !nameEl || !emailEl || !messageEl || !formMsg || !resetBtn) {
    console.error('Form elements not found');
    return;
  }
  /* Auto-grow textarea logic */
  messageEl.addEventListener('input', function () {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
  });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

  function showMessage(text, type = 'error') {
    formMsg.textContent = text;
    formMsg.classList.remove('error', 'success');
    formMsg.classList.add(type === 'success' ? 'success' : 'error');
  }

  function clearMessage() {
    formMsg.textContent = '';
    formMsg.classList.remove('error', 'success');
  }

  function setInvalid(el, invalid = true) {
    if (invalid) el.classList.add('invalid');
    else el.classList.remove('invalid');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearMessage();

    const name = nameEl.value.trim();
    const email = emailEl.value.trim();
    const message = messageEl.value.trim();

    // Reset invalid states
    [nameEl, emailEl, messageEl].forEach(el => setInvalid(el, false));

    // Validate
    if (!name) {
      setInvalid(nameEl, true);
      showMessage('Please enter your name.');
      nameEl.focus();
      return;
    }

    if (!email) {
      setInvalid(emailEl, true);
      showMessage('Please enter your email address.');
      emailEl.focus();
      return;
    }

    if (!emailRegex.test(email)) {
      setInvalid(emailEl, true);
      showMessage('Please enter a valid email address.');
      emailEl.focus();
      return;
    }

    if (!message) {
      setInvalid(messageEl, true);
      showMessage('Please enter a message.');
      messageEl.focus();
      return;
    }

    // Passed validation
    // showMessage('Message sent successfully. (Demo mode — not actually sent.)', 'success');
    showToast('Message sent successfully!');

    form.reset();
  });

  let toastTimeout; // Variable to store timeout ID

  function showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');

    // Clear previous timeout if exists
    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }

    // After 3 seconds, remove the show class
    toastTimeout = setTimeout(function () {
      toast.classList.remove('show');
    }, 3000);
  }

  resetBtn.addEventListener('click', function () {
    form.reset();
    clearMessage();
    [nameEl, emailEl, messageEl].forEach(el => setInvalid(el, false));
    nameEl.focus();
  });
});

/* ===== To-Do app ===== */
/* ===== To-Do app ===== */
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const clearAllBtn = document.getElementById('clearAllBtn');

// Key for localStorage
const TASK_KEY = 'webdev_tasks_v1';

// Load tasks from localStorage or empty array
function loadTasks() {
  try {
    const raw = localStorage.getItem(TASK_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveTasks(tasks) {
  localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
}

// Render the tasks array to DOM
function renderTasks() {
  const tasks = loadTasks();
  taskList.innerHTML = '';

  if (tasks.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'task-empty';
    empty.textContent = 'No tasks yet. Add your first task above.';
    taskList.appendChild(empty);
    return;
  }

  tasks.forEach((task, idx) => {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.dataset.index = idx;

    const left = document.createElement('div');
    left.className = 'task-left';
    left.style.display = 'flex';
    left.style.alignItems = 'center';
    left.style.gap = '10px';

    // Checkbox for completion
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed || false;
    checkbox.className = 'task-checkbox';
    checkbox.setAttribute('aria-label', `Mark task as completed: ${task.text}`);

    const span = document.createElement('span');
    span.className = 'task-text';
    if (task.completed) {
      span.classList.add('completed');
    }
    span.textContent = task.text;

    left.appendChild(checkbox);
    left.appendChild(span);

    const del = document.createElement('button');
    del.className = 'delete-btn';
    del.type = 'button';
    del.setAttribute('aria-label', `Delete task: ${task.text}`);
    del.innerHTML = '&times;';

    li.appendChild(left);
    li.appendChild(del);
    taskList.appendChild(li);
  });
}

// Add a new task
function addTask() {
  const text = (taskInput.value || '').trim();
  if (!text) {
    taskInput.focus();
    taskInput.classList.add('invalid');
    setTimeout(() => taskInput.classList.remove('invalid'), 700);
    return;
  }
  const tasks = loadTasks();
  // Add new task with completed: false
  tasks.push({ text, completed: false, created: Date.now() });
  saveTasks(tasks);
  taskInput.value = '';
  taskInput.focus();
  renderTasks();
}

// Toggle task completion
function toggleTask(index) {
  const tasks = loadTasks();
  if (tasks[index]) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks(tasks);
    renderTasks();
  }
}

// Delete task by index
function deleteTask(index) {
  const tasks = loadTasks();
  tasks.splice(index, 1);
  saveTasks(tasks);
  renderTasks();
}

// Event listeners
addTaskBtn && addTaskBtn.addEventListener('click', addTask);

// Allow Enter to add
taskInput && taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    addTask();
  }
});

// Delegated handler for delete AND toggle
taskList && taskList.addEventListener('click', (e) => {
  const li = e.target.closest('li.task-item');
  if (!li) return;
  const index = Number(li.dataset.index);
  if (!Number.isFinite(index)) return;

  // Handle delete
  if (e.target.closest('.delete-btn')) {
    deleteTask(index);
    return;
  }

  // Handle checkbox toggle
  if (e.target.classList.contains('task-checkbox')) {
    toggleTask(index);
    return;
  }
});

// Clear all
clearAllBtn && clearAllBtn.addEventListener('click', () => {
  if (!confirm('Clear all tasks?')) return;
  saveTasks([]);
  renderTasks();
});

// Initial render
renderTasks();
