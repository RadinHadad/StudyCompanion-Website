  let tasks = [];

const storedTasks = localStorage.getItem("tasks");
if (storedTasks) {
  tasks = JSON.parse(storedTasks);
}



document.addEventListener("DOMContentLoaded", () => {
  
 let flashcardsPerTask = JSON.parse(localStorage.getItem("flashcards")) || {};

const flashcardModal = document.getElementById("flashcard-modal");
const closeFlashcardModal = document.getElementById("close-flashcard-modal");
const flashcardTaskTitle = document.getElementById("flashcard-task-title");

const addTab = document.getElementById("add-tab");
const viewTab = document.getElementById("view-tab");
const addSection = document.getElementById("add-flashcard-section");
const viewSection = document.getElementById("view-flashcard-section");

const newFlashcardText = document.getElementById("new-flashcard-text");
const saveFlashcardBtn = document.getElementById("save-flashcard-btn");

const flashcardDisplay = document.getElementById("flashcard-display");
const prevCard = document.getElementById("prev-card");
const nextCard = document.getElementById("next-card");

let currentFlashcardIndex = 0;
let currentTaskName = "";


addTab.addEventListener("click", () => {
  addTab.classList.add("active");
  viewTab.classList.remove("active");
  addSection.style.display = "block";
  viewSection.style.display = "none";
});

viewTab.addEventListener("click", () => {
  viewTab.classList.add("active");
  addTab.classList.remove("active");
  addSection.style.display = "none";
  viewSection.style.display = "block";
  displayFlashcard(currentTaskName);
});

function openFlashcardModal(taskName) {
  currentTaskName = taskName;
  flashcardTaskTitle.textContent = `Flashcards – ${taskName}`;
  flashcardModal.style.display = "flex";
  newFlashcardText.value = "";
  currentFlashcardIndex = 0;
  addTab.click();
}

saveFlashcardBtn.addEventListener("click", () => {
  const text = newFlashcardText.value.trim();

  if (!text) {
    alert("Flashcard text cannot be empty.");
    return;
  }

  

  if (!flashcardsPerTask[currentTaskName]) {
    flashcardsPerTask[currentTaskName] = [];
  }

  flashcardsPerTask[currentTaskName].push(text);
  localStorage.setItem("flashcards", JSON.stringify(flashcardsPerTask));

  newFlashcardText.value = "";
  alert("Flashcard saved!");
});


let isShuffle = false;
let shuffleOrder = [];

function displayFlashcard(taskName, direction = "next") {
  const cards = flashcardsPerTask[taskName] || [];
  if (cards.length === 0) {
    document.getElementById("flashcard-content").textContent = "No flashcards available.";
    return;
  }

  const card = document.getElementById("flashcard-content");
  const inner = document.getElementById("swipe-inner");


  inner.style.transition = "none";
  inner.style.transform = `translateX(${direction === "next" ? '100%' : '-100%'})`;
  setTimeout(() => {
    inner.style.transition = "transform 0.4s ease";
    inner.style.transform = "translateX(0)";
    card.textContent = cards[currentFlashcardIndex];
  }, 10);
}

nextCard.addEventListener("click", () => {
  const cards = flashcardsPerTask[currentTaskName] || [];
  if (cards.length === 0) return;

  if (isShuffle) {
    currentFlashcardIndex = (currentFlashcardIndex + 1) % shuffleOrder.length;
    displayFlashcard(currentTaskName, "next");
  } else {
    currentFlashcardIndex = (currentFlashcardIndex + 1) % cards.length;
    displayFlashcard(currentTaskName, "next");
  }
});

prevCard.addEventListener("click", () => {
  const cards = flashcardsPerTask[currentTaskName] || [];
  if (cards.length === 0) return;

  if (isShuffle) {
    currentFlashcardIndex = (currentFlashcardIndex - 1 + shuffleOrder.length) % shuffleOrder.length;
    displayFlashcard(currentTaskName, "prev");
  } else {
    currentFlashcardIndex = (currentFlashcardIndex - 1 + cards.length) % cards.length;
    displayFlashcard(currentTaskName, "prev");
  }
});
document.getElementById("shuffleToggle").addEventListener("click", () => {
  isShuffle = !isShuffle;

  const btn = document.getElementById("shuffleToggle");
  btn.textContent = `Shuffle: ${isShuffle ? "On" : "Off"}`;

  const cards = flashcardsPerTask[currentTaskName] || [];
  if (isShuffle) {
    shuffleOrder = shuffleArray([...Array(cards.length).keys()]);
    currentFlashcardIndex = 0;
  } else {
    currentFlashcardIndex = 0;
  }

  displayFlashcard(currentTaskName, "next");
});

// Fisher-Yates shuffle
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}



closeFlashcardModal.addEventListener("click", () => {
  flashcardModal.style.display = "none";
});


    const progressChartBtn = document.getElementById('progress-chart-btn');
  const chartModal = document.getElementById('chart-modal');
  const chartGrid = document.getElementById('chart-grid');
  const closeChartSpan = chartModal.querySelector('.close');


  function openChartModal() {
    chartGrid.innerHTML = '';

    if (tasks.length === 0) {
      chartGrid.innerHTML = `<p style="color:#666; text-align:center; padding: 2rem;">No tasks available to display progress charts.</p>`;
    } else {
      tasks.forEach(task => {
        const logs = task.logs || [];
        if (logs.length === 0) {
          const noLogsDiv = document.createElement('div');
          noLogsDiv.className = 'chart-box';
          noLogsDiv.innerHTML = `<h4>${task.name}</h4><p>No progress logs available.</p>`;
          chartGrid.appendChild(noLogsDiv);
          return;
        }

        const chartBox = document.createElement('div');
        chartBox.classList.add('chart-box');

        const title = document.createElement('h4');
        title.textContent = task.name;
        chartBox.appendChild(title);

        const canvas = document.createElement('canvas');
        chartBox.appendChild(canvas);
        chartGrid.appendChild(chartBox);

        const labels = logs.map(log => log.timestamp);
        const dataPoints = logs.map(log => log.percent);

        new Chart(canvas.getContext('2d'), {
          type: 'line',
          data: {
            labels: labels,
            datasets: [{
              label: '% Progress',
              data: dataPoints,
              borderColor: '#8c81ed',
              backgroundColor: 'rgba(140, 129, 237, 0.2)',
              fill: true,
              tension: 0.3,
              pointRadius: 5,
            }]
          },
          options: {
            scales: {
              x: {
                title: { display: true, text: 'Date', color: '#666' }
              },
              y: {
                min: 0,
                max: 100,
                title: { display: true, text: 'Progress (%)', color: '#666' }
              }
            },
            plugins: { legend: { display: false } }
          }
        });
      });
    }

    chartModal.style.display = 'flex';
  }

  
  if (progressChartBtn && chartModal && closeChartSpan && chartGrid) {
    progressChartBtn.addEventListener('click', openChartModal);

    closeChartSpan.addEventListener('click', () => {
      chartModal.style.display = 'none';
      chartGrid.innerHTML = '';
    });

    window.addEventListener('click', e => {
      if (e.target === chartModal) {
        chartModal.style.display = 'none';
        chartGrid.innerHTML = '';
      }
    });
  }

  const addTaskBtn = document.getElementById("add-task-btn");
  const removeTaskBtn = document.getElementById("remove-task-btn");
  const updateProgressBtn = document.getElementById("update-progress-btn");
  const editTaskBtn = document.getElementById("edit-task-btn");
  const emptyMsg = document.getElementById("empty-msg");
  const thisWeek = document.getElementById("this-week");
  const upcoming = document.getElementById("upcoming");
  const todayDate = document.getElementById("today-date");
  const taskModal = document.getElementById("task-modal");
  const progressModal = document.getElementById("progress-modal");

  const closeButtons = document.querySelectorAll(".close");
  const taskForm = document.getElementById("task-form");
  const progressForm = document.getElementById("progress-form");

  const progressTaskSelect = document.getElementById("progress-task-select");
  const progressText = document.getElementById("progress-text");
  const confidenceInput = document.getElementById("confidence");
  const percentInput = document.getElementById("percent");



  todayDate.textContent = new Date().toISOString().split("T")[0];

  function renderTasks() {
    thisWeek.innerHTML = "";
    upcoming.innerHTML = "";
    progressTaskSelect.innerHTML = "";

    if (tasks.length === 0) {
      emptyMsg.style.display = "block";
    } else {
      emptyMsg.style.display = "none";
    }
    
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    tasks.forEach((task, index) => {
      const due = new Date(task.date);
      due.setHours(0, 0, 0, 0);
      const timeDiff = due - now;
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

      const section = (daysDiff >= 0 && daysDiff <= 7) ? thisWeek : upcoming;

      const taskDiv = document.createElement("div");
      taskDiv.className = "task";

   taskDiv.innerHTML = `
  <div class="task-left">
    <span class="task-days"><strong>&nbsp ${daysDiff} Days</strong></span>
    <span class="task-name">${task.name}</span>
  </div>
  <div class="task-buttons">
   <span class="priority" style="margin-left: 10px;">${task.priority}</span>
    <button class="percent-btn styled-button" data-index="${index}">
      ${task.percent || 0}%
    </button>
   
    <button class="flashcard-btn styled-button" data-task="${task.name}">
      Flashcards
    </button>
  </div>
`;


 

      section.appendChild(taskDiv);
      progressTaskSelect.innerHTML += `<option value="${index}">${task.name}</option>`;
      localStorage.setItem("tasks", JSON.stringify(tasks));

    });
           document.querySelectorAll(".flashcard-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          openFlashcardModal(btn.dataset.task);
        });
      });
    document.querySelectorAll(".percent-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const task = tasks[btn.dataset.index];
        const logs = task.logs || [];

        const logEntries = logs.map(log => `
          <div class="log-entry">
            <strong>${log.timestamp}</strong><br>
            Progress: ${log.progress}<br>
            Confidence: ${log.confidence}/10<br>
            Complete: ${log.percent}%
          </div>
        `).join("") || "<p>No progress logs available yet.</p>";

        const popup = document.createElement("div");
        popup.className = "progress-popup";
        popup.innerHTML = `
          <div class="popup-content">
            <h3>${task.name} – Progress Logs</h3>
            ${logEntries}
            <button class="close-popup">Close</button>
          </div>
        `;

        document.body.appendChild(popup);

        popup.querySelector(".close-popup").addEventListener("click", () => {
          popup.remove();
        });
      });
    });
  }

  function handleProgressSubmit(e) {
    e.preventDefault();

    const index = +progressTaskSelect.value;
    const task = tasks[index];

    const log = {
      progress: progressText.value,
      confidence: Math.min(10, Math.max(1, +confidenceInput.value)),
      percent: Math.min(100, Math.max(0, +percentInput.value)),
      timestamp: new Date().toLocaleString()
    };

    task.logs = task.logs || [];
    task.logs.push(log);

    task.progress = log.progress;
    task.confidence = log.confidence;
    task.percent = log.percent;

    renderTasks();
    progressForm.reset();
    progressModal.style.display = "none";
  }
 
  addTaskBtn.addEventListener("click", () => taskModal.style.display = "flex");
  updateProgressBtn.addEventListener("click", () => progressModal.style.display = "flex");
   window.addEventListener("click", (e) => {
    if (e.target === taskModal) {
      taskModal.style.display = "none";
    };
  })
  closeButtons.forEach(btn => btn.addEventListener("click", () => {
    taskModal.style.display = "none";
    progressModal.style.display = "none";
  }));

  taskForm.addEventListener("submit", e => {
    e.preventDefault();
    const [date, name, priority] = taskForm.querySelectorAll("input");
    tasks.push({
      date: date.value,
      name: name.value,
      priority: Math.min(10, Math.max(1, +priority.value)),
      percent: 0,
      logs: []
    });
    taskForm.reset();
    taskModal.style.display = "none";
    renderTasks();
  });
function openRemoveTaskModal() {
  const select = document.getElementById("removeTaskSelect");
  select.innerHTML = "";

  // Populate dropdown
  tasks.forEach(task => {
    const option = document.createElement("option");
    option.value = task.name;
    option.textContent = task.name;
    select.appendChild(option);
  });

  document.getElementById("removeTaskModal").style.display = "block";
}

function closeRemoveTaskModal() {
  document.getElementById("removeTaskModal").style.display = "none";
}
removeTaskBtn.addEventListener("click", () => {
  if (tasks.length === 0) {
    alert("No tasks to remove.");
    return;
  }
  openRemoveTaskModal();
});

document.getElementById("confirmRemoveTaskBtn").addEventListener("click", () => {
  const selectedName = document.getElementById("removeTaskSelect").value;
  const index = tasks.findIndex(t => t.name === selectedName);
  if (index !== -1) {
    tasks.splice(index, 1);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    renderTasks();
    closeRemoveTaskModal();
  } else {
    alert("Task not found!");
  }
});
window.addEventListener("click", (event) => {
  const modal = document.getElementById("removeTaskModal");
  if (event.target === modal) {
    closeRemoveTaskModal();
  }
});
window.addEventListener("click", (event) => {
  const modal = document.getElementById("progress-modal");
  if (event.target === modal) {
     progressModal.style.display = "none";;
  }
});
function openEditTaskModal() {
  const select = document.getElementById("editTaskSelect");
  select.innerHTML = "";

  tasks.forEach(task => {
    const option = document.createElement("option");
    option.value = task.name;
    option.textContent = task.name;
    select.appendChild(option);
  });

  if (tasks.length > 0) {
    document.getElementById("editTaskName").value = tasks[0].name;
    document.getElementById("editTaskPriority").value = tasks[0].priority;
  }

  document.getElementById("editTaskModal").style.display = "block";
}

function closeEditTaskModal() {
  document.getElementById("editTaskModal").style.display = "none";
}
document.getElementById("editTaskSelect").addEventListener("change", function () {
  const selectedName = this.value;
  const task = tasks.find(t => t.name === selectedName);
  if (task) {
    document.getElementById("editTaskName").value = task.name;
    document.getElementById("editTaskPriority").value = task.priority;
  }
});
editTaskBtn.addEventListener("click", () => {
  if (tasks.length === 0) {
    alert("No tasks available to edit.");
    return;
  }
  openEditTaskModal();
});

document.getElementById("confirmEditTaskBtn").addEventListener("click", () => {
  const selectedName = document.getElementById("editTaskSelect").value;
  const task = tasks.find(t => t.name === selectedName);
  if (!task) {
    alert("Task not found!");
    return;
  }

  const newName = document.getElementById("editTaskName").value.trim();
  const newPriority = parseInt(document.getElementById("editTaskPriority").value);

  if (newName) task.name = newName;
  if (!isNaN(newPriority)) task.priority = Math.min(10, Math.max(1, newPriority));

  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
  closeEditTaskModal();
});
window.addEventListener("click", (event) => {
  const modal = document.getElementById("editTaskModal");
  if (event.target === modal) {
    closeEditTaskModal();
  }
});

  progressForm.addEventListener("submit", handleProgressSubmit);

  renderTasks();
});




const calendarBtn = document.getElementById("calendar-btn");
const calendarModal = document.getElementById("calendar-modal");
const closeCalendarBtn = document.getElementById("close-calendar-modal");
const calendarDiv = document.getElementById("calendar");


function renderCalendar() {
  const calendarMonth = document.getElementById("calendar-month");
  const now = new Date();
  const monthName = now.toLocaleString("default", { month: "long", year: "numeric" });
  calendarMonth.textContent = monthName;
  

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const firstDay = new Date(year, month, 1).getDay(); // Day of week
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  calendarDiv.innerHTML = "";

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  dayNames.forEach(day => {
    const dayDiv = document.createElement("div");
    dayDiv.innerHTML = `<strong>${day}</strong>`;
    calendarDiv.appendChild(dayDiv);
  });

  for (let i = 0; i < firstDay; i++) {
    calendarDiv.appendChild(document.createElement("div")); 
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day).toISOString().split("T")[0];

    const dayDiv = document.createElement("div");
    dayDiv.textContent = day;

    const hasTask = tasks.some(task => task.date === date);
    if (hasTask) {
      dayDiv.style.backgroundColor = "#8c81ed";
      dayDiv.style.color = "#fff";
    }

    calendarDiv.appendChild(dayDiv);
    dayDiv.addEventListener('click', () => {
      document.getElementById('calendar-modal').style.display = "none";

  const dayTasks = tasks.filter(task => task.date === date);
  const taskList = document.getElementById('calendar-task-list');
  taskList.innerHTML = "";

  if (dayTasks.length === 0) {
    taskList.innerHTML = "<li>No tasks due on this day.</li>";
  } else {
    dayTasks.forEach(task => {
      const li = document.createElement('li');
      li.textContent = `${task.name} (Priority: ${task.priority})`;
      taskList.appendChild(li);
    });
  }

  document.getElementById('calendar-task-modal').style.display = "block";
});

  }
}


calendarBtn.addEventListener("click", () => {
  renderCalendar();
  calendarModal.style.display = "flex";
});

document.getElementById('close-calendar-task-modal').addEventListener('click', () => {
  document.getElementById('calendar-task-modal').style.display = "none";
});
function formatDate(dateStr) {
  const options = { month: 'short', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString(undefined, options);
}

  window.addEventListener('click', e => {
      if (e.target === calendarModal) {
        calendarModal.style.display = 'none';
     
      }
    });