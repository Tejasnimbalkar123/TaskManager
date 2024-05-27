document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskTable = document.getElementById('task-table');
    const taskList = document.getElementById('task-list');
  
    // Load tasks from local storage
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  
    // Display tasks
    if (tasks.length > 0) {
      taskTable.classList.remove('hidden');
      tasks.forEach((task, index) => addTaskToDOM(task, index));
    }
  
    taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const taskInput = document.getElementById('task-input');
      const taskAssignee = document.getElementById('task-assignee');
      const taskDate = document.getElementById('task-date');
      const task = {
        id: Date.now(),
        text: taskInput.value,
        assignee: taskAssignee.value,
        date: taskDate.value,
        completed: false
      };
      tasks.push(task);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      addTaskToDOM(task, tasks.length - 1);
      taskInput.value = '';
      taskAssignee.value = '';
      taskDate.value = '';
  
      // Show the table if it was hidden
      if (taskTable.classList.contains('hidden')) {
        taskTable.classList.remove('hidden');
      }
    });
  
    taskList.addEventListener('click', (e) => {
      const target = e.target;
      if (target.classList.contains('delete')) {
        const id = target.parentElement.parentElement.dataset.id;
        removeTask(id);
      }
      if (target.classList.contains('toggle-complete')) {
        const id = target.parentElement.parentElement.dataset.id;
        toggleTaskCompletion(id);
      }
      if (target.classList.contains('edit')) {
        const id = target.parentElement.parentElement.dataset.id;
        enableEditing(id);
      }
      if (target.classList.contains('save')) {
        const id = target.parentElement.parentElement.dataset.id;
        saveTask(id);
      }
    });
  
    function addTaskToDOM(task, index) {
      const row = document.createElement('tr');
      row.dataset.id = task.id;
      row.classList.toggle('completed', task.completed);
      const taskIndex = document.createElement('td');
      taskIndex.textContent = index + 1;
      const taskText = document.createElement('td');
      taskText.textContent = task.text;
      const taskAssignee = document.createElement('td');
      taskAssignee.textContent = task.assignee;
      const taskDate = document.createElement('td');
      taskDate.textContent = task.date;
      const actionButtons = document.createElement('td');
      actionButtons.classList.add('action-buttons');
      const toggleCompleteButton = document.createElement('button');
      toggleCompleteButton.textContent = task.completed ? 'Undo' : 'Complete';
      toggleCompleteButton.classList.add('toggle-complete');
      const editButton = document.createElement('button');
      editButton.textContent = 'Edit';
      editButton.classList.add('edit');
      const saveButton = document.createElement('button');
      saveButton.textContent = 'Save';
      saveButton.classList.add('save');
      saveButton.style.display = 'none';
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.classList.add('delete');
      actionButtons.append(toggleCompleteButton, editButton, saveButton, deleteButton);
      row.append(taskIndex, taskText, taskAssignee, taskDate, actionButtons);
      taskList.appendChild(row);
    }
  
    function removeTask(id) {
      const index = tasks.findIndex(task => task.id == id);
      tasks.splice(index, 1);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      renderTasks();
  
      // Hide the table if no tasks left
      if (tasks.length === 0) {
        taskTable.classList.add('hidden');
      }
    }
  
    function toggleTaskCompletion(id) {
      const task = tasks.find(task => task.id == id);
      task.completed = !task.completed;
      localStorage.setItem('tasks', JSON.stringify(tasks));
      renderTasks();
    }
  
    function enableEditing(id) {
      const task = tasks.find(task => task.id == id);
      const row = document.querySelector(`tr[data-id='${id}']`);
      row.children[1].innerHTML = `<input type="text" class="edit-input" value="${task.text}">`;
      row.children[2].innerHTML = `<input type="text" class="edit-input" value="${task.assignee}">`;
      row.children[3].innerHTML = `<input type="date" class="edit-input" value="${task.date}">`;
      row.querySelector('.edit').style.display = 'none';
      row.querySelector('.save').style.display = 'inline-block';
    }
  
    function saveTask(id) {
      const row = document.querySelector(`tr[data-id='${id}']`);
      const task = tasks.find(task => task.id == id);
      const newText = row.children[1].querySelector('input').value;
      const newAssignee = row.children[2].querySelector('input').value;
      const newDate = row.children[3].querySelector('input').value;
      task.text = newText;
      task.assignee = newAssignee;
      task.date = newDate;
      localStorage.setItem('tasks', JSON.stringify(tasks));
      renderTasks();
    }
  
    function renderTasks() {
      taskList.innerHTML = '';
      tasks.forEach((task, index) => addTaskToDOM(task, index));
    }
  });