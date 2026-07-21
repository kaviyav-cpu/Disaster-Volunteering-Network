// ==========================================
// Admin Dashboard Functions
// ==========================================
function filterLogs() {
  const input = document.getElementById("logSearch").value.toUpperCase();
  const rows = document.getElementById("logTable").getElementsByTagName("tr");
  for (let i = 1; i < rows.length; i++) {
    let text = rows[i].textContent || rows[i].innerText;
    rows[i].style.display = text.toUpperCase().indexOf(input) > -1 ? "" : "none";
  }
}

// ==========================================
// Home Page Audio Control Functions
// ==========================================
function playAudio() {
  const audio = document.getElementById('homeAudio');
  if (audio) {
    audio.play();
  }
}

function pauseAudio() {
  const audio = document.getElementById('homeAudio');
  if (audio) {
    audio.pause();
  }
}

// ==========================================
// Login Page Functions
// ==========================================
function togglePasswordVisibility(checkbox) {
  const passInput = document.getElementById('password');
  if (passInput) {
    passInput.type = checkbox.checked ? 'text' : 'password';
  }
}

function handleLoginSubmit(event) {
  event.preventDefault();
  const toast = document.getElementById('toast');
  if (toast) {
    toast.className = 'show';
    setTimeout(() => {
      window.location.href = 'volunteer-dashboard.html';
    }, 1500);
  }
}

// ==========================================
// NGO Dashboard Functions
// ==========================================
function initNgoCanvas() {
  const canvas = document.getElementById('ngoCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0d9488';
    ctx.fillRect(10, 20, 40, 80);
    ctx.fillRect(60, 40, 40, 60);
    ctx.fillRect(110, 10, 40, 90);
  }
}

function addNewDeployment() {
  const name = prompt("Enter Task Title:", "Emergency Water Supply");
  if (name) {
    const table = document.getElementById('deploymentTable').getElementsByTagName('tbody')[0];
    const newRow = table.insertRow();
    newRow.innerHTML = `<td>${name}</td><td>0 / 5 Assigned</td><td><button onclick="removeRow(this)" style="background:#ef4444; color:white; border:none; padding:2px 8px; border-radius:4px; cursor:pointer;">Close</button></td>`;
  }
}

function removeRow(btn) {
  const row = btn.parentNode.parentNode;
  row.parentNode.removeChild(row);
}

// ==========================================
// Profile Page Functions
// ==========================================
function addSkill() {
  const skill = prompt("Enter new skill certification:", "Shelter Logistics");
  if (skill) {
    const container = document.getElementById('badgeContainer');
    if (container) {
      const newBadge = document.createElement('span');
      newBadge.className = 'badge';
      newBadge.innerText = skill;
      container.appendChild(newBadge);
    }
  }
}

// ==========================================
// Registration Page Functions
// ==========================================
function handleRoleChange(selectElement) {
  const ngoField = document.getElementById('ngoRegField');
  if (ngoField) {
    if (selectElement.value === 'ngo') {
      ngoField.style.display = 'block';
    } else {
      ngoField.style.display = 'none';
    }
  }
}

function handleRegisterSubmit(event) {
  event.preventDefault();
  alert('Registration successful! Please login.');
  window.location.href = 'login.html';
}

// ==========================================
// Skill Task Matching Functions
// ==========================================
function filterBySkill(skill) {
  const audio = document.getElementById('matchSound');
  if (audio) {
    audio.play().catch(e => console.log('Audio autoplay prevented'));
  }

  const tasks = document.getElementsByClassName('task-card');
  for (let task of tasks) {
    if (skill === 'all' || task.getAttribute('data-skill') === skill) {
      task.style.display = 'block';
    } else {
      task.style.display = 'none';
    }
  }
}

// ==========================================
// Task Details Functions
// ==========================================
function applyForTask() {
  const btn = document.getElementById('applyBtn');
  if (btn) {
    btn.innerText = 'Application Submitted ✓';
    btn.style.backgroundColor = '#166534';
    btn.disabled = true;
  }
}

function playSpeed(speed) {
  const audio = document.getElementById('fieldBriefing');
  if (audio) {
    audio.playbackRate = speed;
    alert(`Audio playback set to ${speed}x`);
  }
}

// ==========================================
// Upload Proof Functions
// ==========================================
function updateOutput(val) {
  const output = document.getElementById('hourOutput');
  if (output) {
    output.value = val;
  }
}

function previewImage(event) {
  const reader = new FileReader();
  reader.onload = function() {
    const output = document.getElementById('imgPreview');
    if (output) {
      output.src = reader.result;
      output.style.display = 'block';
    }
  };
  if (event.target.files && event.target.files[0]) {
    reader.readAsDataURL(event.target.files[0]);
  }
}

function handleUploadSubmit(event) {
  event.preventDefault();
  alert('Verification proof submitted to coordinator!');
  window.location.href = 'volunteer-dashboard.html';
}