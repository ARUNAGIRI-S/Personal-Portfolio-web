console.log("js/admin.js: Script file loaded and parsed successfully.");

document.addEventListener('DOMContentLoaded', () => {
  console.log("js/admin.js: DOMContentLoaded event fired. Initializing admin panel logic.");
  // Select DOM Elements
  const loginOverlay = document.getElementById('adminLoginOverlay');
  const dashboardLayout = document.getElementById('adminDashboardLayout');
  const loginForm = document.getElementById('loginForm');
  const adminPasswordInput = document.getElementById('adminPasswordInput');
  const loginError = document.getElementById('loginError');
  const logoutBtn = document.getElementById('logoutBtn');
  
  // Navigation / Tabs
  const sidebarNavBtns = document.querySelectorAll('.sidebar-nav-btn');
  const adminPanels = document.querySelectorAll('.admin-panel');
  const adminTopbarTitle = document.getElementById('adminTopbarTitle');
  const mobileSidebarToggle = document.getElementById('mobileSidebarToggle');
  const adminSidebar = document.querySelector('.admin-sidebar');

  // Modals & Forms
  const projectModal = document.getElementById('projectModal');
  const projectForm = document.getElementById('projectForm');
  const addNewProjectBtn = document.getElementById('addNewProjectBtn');
  const closeProjModal = document.getElementById('closeProjModal');
  
  const certModal = document.getElementById('certModal');
  const certForm = document.getElementById('certForm');
  const addNewCertBtn = document.getElementById('addNewCertBtn');
  const closeCertModal = document.getElementById('closeCertModal');
  
  const viewMessageModal = document.getElementById('viewMessageModal');
  const closeMsgModal = document.getElementById('closeMsgModal');
  
  const refreshInboxBtn = document.getElementById('refreshInboxBtn');
  const profileForm = document.getElementById('profileForm');

  // Check Token on load
  let adminToken = localStorage.getItem('portfolio_admin_token');

  if (adminToken) {
    verifySession();
  } else {
    showLogin();
  }

  // ==========================================
  // AUTHENTICATION FLOW
  // ==========================================
  async function verifySession() {
    try {
      const res = await fetch('/api/auth', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      if (res.ok) {
        showDashboard();
      } else {
        localStorage.removeItem('portfolio_admin_token');
        showLogin();
      }
    } catch (err) {
      console.error("Session verification failed:", err);
      showLogin();
    }
  }

  function showLogin() {
    loginOverlay.style.display = 'flex';
    dashboardLayout.style.display = 'none';
  }

  function showDashboard() {
    loginOverlay.style.display = 'none';
    dashboardLayout.style.display = 'flex';
    loadDashboardData();
  }

  // Handle Login Submission
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginError.textContent = '';
    
    const password = adminPasswordInput.value;
    
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        adminToken = data.token;
        localStorage.setItem('portfolio_admin_token', adminToken);
        showDashboard();
        showToast("Access Granted. Decrypted Admin Session.", "success");
      } else {
        loginError.textContent = data.error || "Authentication failed.";
        showToast("Access Denied.", "error");
      }
    } catch (err) {
      loginError.textContent = "Server connection lost. Try again.";
    }
  });

  // Logout Handler
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('portfolio_admin_token');
    adminToken = null;
    showLogin();
    showToast("Session terminated.", "info");
  });

  // ==========================================
  // TAB NAVIGATION & PANELS
  // ==========================================
  sidebarNavBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle nav classes
      sidebarNavBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Get target and toggle panels
      const targetId = btn.dataset.target;
      adminPanels.forEach(panel => {
        panel.classList.remove('active');
        if (panel.id === targetId) {
          panel.classList.add('active');
        }
      });

      // Update Top Title
      const text = btn.innerText.trim();
      adminTopbarTitle.innerText = text + " Management";

      // Close mobile sidebar if open
      adminSidebar.classList.remove('active');
    });
  });

  // Mobile Sidebar Hamburger toggle
  mobileSidebarToggle.addEventListener('click', () => {
    adminSidebar.classList.toggle('active');
  });

  // ==========================================
  // DASHBOARD DATA LOADER
  // ==========================================
  function loadDashboardData() {
    loadStats();
    loadMessages();
    loadProjects();
    loadCertificates();
    loadProfileSettings();
  }

  // Toast Notification helper
  function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let iconClass = 'fa-solid fa-info-circle';
    if (type === 'success') iconClass = 'fa-solid fa-check-circle';
    else if (type === 'error') iconClass = 'fa-solid fa-circle-exclamation';
    
    toast.innerHTML = `
      <i class="${iconClass}"></i>
      <span>${message}</span>
    `;
    container.appendChild(toast);
    
    // Animate removal
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-20px)';
      setTimeout(() => {
        container.removeChild(toast);
      }, 300);
    }, 3500);
  }

  // ==========================================
  // 1. STATS LOADER
  // ==========================================
  async function loadStats() {
    try {
      const res = await fetch('/api/stats', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (res.ok) {
        const stats = await res.json();
        document.getElementById('statTotalMsgs').textContent = stats.messages.total;
        document.getElementById('statUnreadMsgs').textContent = stats.messages.unread;
        document.getElementById('statProjects').textContent = stats.projectsCount;
        document.getElementById('statCertifications').textContent = stats.certificatesCount;
        
        // Show badges
        const badge = document.getElementById('inboxUnreadBadge');
        if (stats.messages.unread > 0) {
          badge.textContent = stats.messages.unread;
          badge.style.display = 'inline-block';
        } else {
          badge.style.display = 'none';
        }
      }
    } catch (err) {
      console.error("Error loading stats:", err);
    }
  }

  // ==========================================
  // 2. INBOX MESSAGES MANAGER
  // ==========================================
  async function loadMessages() {
    const tableBody = document.querySelector('#inboxTable tbody');
    tableBody.innerHTML = '<tr><td colspan="6" class="text-center">Fetching inbox messages...</td></tr>';
    
    try {
      const res = await fetch('/api/contact', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      
      if (!res.ok) throw new Error("Could not retrieve inbox");
      const messages = await res.json();
      
      tableBody.innerHTML = '';
      if (messages.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center">No messages received yet.</td></tr>';
        return;
      }
      
      messages.forEach(msg => {
        const tr = document.createElement('tr');
        const readStatus = msg.read 
          ? '<span class="badge" style="background:rgba(255,255,255,0.05);color:var(--text-muted);">Read</span>'
          : '<span class="badge badge-danger">Unread</span>';
          
        const dateStr = new Date(msg.createdAt).toLocaleDateString(undefined, {
          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
        
        tr.innerHTML = `
          <td>${readStatus}</td>
          <td>${escapeHtml(msg.name)}</td>
          <td>${escapeHtml(msg.email)}</td>
          <td>${escapeHtml(msg.subject)}</td>
          <td>${dateStr}</td>
          <td>
            <div class="action-buttons-cell">
              <button class="btn-icon btn-view-msg" data-id="${msg._id}" title="Read message"><i class="fa-solid fa-envelope-open"></i></button>
              <button class="btn-icon btn-delete btn-delete-msg" data-id="${msg._id}" title="Delete Message"><i class="fa-solid fa-trash"></i></button>
            </div>
          </td>
        `;
        tableBody.appendChild(tr);
      });

      // Bind dynamic actions
      bindMessageActions();

    } catch (err) {
      tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Error: ${err.message}</td></tr>`;
    }
  }

  function bindMessageActions() {
    // View Message
    document.querySelectorAll('.btn-view-msg').forEach(btn => {
      btn.addEventListener('click', async () => {
        const msgId = btn.dataset.id;
        await openMessageDetails(msgId);
      });
    });

    // Delete Message
    document.querySelectorAll('.btn-delete-msg').forEach(btn => {
      btn.addEventListener('click', async () => {
        const msgId = btn.dataset.id;
        if (confirm("Are you sure you want to delete this message?")) {
          await deleteMessage(msgId);
        }
      });
    });
  }

  async function openMessageDetails(id) {
    try {
      // Mark as read first
      await fetch(`/api/contact?id=${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ read: true })
      });

      // Retrieve full list again to update status
      loadMessages();
      loadStats();

      // Get full details from UI row or re-fetch.
      // Re-fetching is safer, but since we have it, let's query db or fetch.
      // For simplicity, we can fetch all and query locally.
      const res = await fetch('/api/contact', {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const messages = await res.json();
      const msg = messages.find(m => m._id === id);

      if (msg) {
        document.getElementById('msgModalFrom').textContent = msg.name;
        document.getElementById('msgModalEmail').textContent = msg.email;
        document.getElementById('msgModalSubject').textContent = msg.subject;
        document.getElementById('msgModalDate').textContent = new Date(msg.createdAt).toLocaleString();
        document.getElementById('msgModalContent').textContent = msg.message;
        
        viewMessageModal.style.display = 'flex';
      }
    } catch (err) {
      showToast("Could not open message details.", "error");
    }
  }

  async function deleteMessage(id) {
    try {
      const res = await fetch(`/api/contact?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (res.ok) {
        showToast("Message deleted successfully.", "success");
        loadMessages();
        loadStats();
      } else {
        throw new Error();
      }
    } catch (err) {
      showToast("Failed to delete message.", "error");
    }
  }

  // Refresh Inbox
  refreshInboxBtn.addEventListener('click', () => {
    loadMessages();
    loadStats();
    showToast("Inbox refreshed.", "success");
  });

  // Close Message Modal
  closeMsgModal.addEventListener('click', () => viewMessageModal.style.display = 'none');

  // ==========================================
  // 3. PROJECTS MANAGER
  // ==========================================
  async function loadProjects() {
    const tableBody = document.querySelector('#projectsTable tbody');
    tableBody.innerHTML = '<tr><td colspan="6" class="text-center">Loading projects data...</td></tr>';

    try {
      const res = await fetch('/api/projects');
      if (!res.ok) throw new Error("Could not retrieve projects");
      projectsData = await res.json();

      tableBody.innerHTML = '';
      if (projectsData.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center">No projects registered.</td></tr>';
        return;
      }

      projectsData.forEach(proj => {
        const tr = document.createElement('tr');
        const imgTag = proj.image 
          ? `<img src="${proj.image}" alt="thumb" style="width:40px;height:40px;object-fit:cover;border-radius:4px;">`
          : '<span class="text-muted">None</span>';
        
        tr.innerHTML = `
          <td>${proj.order}</td>
          <td>${imgTag}</td>
          <td><strong>${escapeHtml(proj.title)}</strong></td>
          <td>${proj.tags.map(t => `<span class="project-tag" style="margin-right:4px;">${t}</span>`).join('')}</td>
          <td>
            <a href="${proj.githubLink}" target="_blank" style="margin-right:8px;" class="text-cyan"><i class="fa-brands fa-github"></i></a>
            <a href="${proj.liveLink}" target="_blank" class="text-purple"><i class="fa-solid fa-link"></i></a>
          </td>
          <td>
            <div class="action-buttons-cell">
              <button class="btn-icon btn-edit-proj" data-id="${proj._id}" title="Edit"><i class="fa-solid fa-pen-to-square"></i></button>
              <button class="btn-icon btn-delete btn-delete-proj" data-id="${proj._id}" title="Delete"><i class="fa-solid fa-trash"></i></button>
            </div>
          </td>
        `;
        tableBody.appendChild(tr);
      });

      bindProjectActions();

    } catch (err) {
      tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Error: ${err.message}</td></tr>`;
    }
  }

  function bindProjectActions() {
    // Edit
    document.querySelectorAll('.btn-edit-proj').forEach(btn => {
      btn.addEventListener('click', () => {
        const projId = btn.dataset.id;
        const proj = projectsData.find(p => p._id === projId);
        if (proj) {
          document.getElementById('projectModalTitle').textContent = "Edit Project";
          document.getElementById('projId').value = proj._id;
          document.getElementById('projTitle').value = proj.title;
          document.getElementById('projDesc').value = proj.description;
          document.getElementById('projDetails').value = proj.details.join('\n');
          document.getElementById('projTags').value = proj.tags.join(', ');
          document.getElementById('projGithub').value = proj.githubLink;
          document.getElementById('projLive').value = proj.liveLink;
          document.getElementById('projImage').value = proj.image;
          document.getElementById('projOrder').value = proj.order;
          
          projectModal.style.display = 'flex';
        }
      });
    });

    // Delete
    document.querySelectorAll('.btn-delete-proj').forEach(btn => {
      btn.addEventListener('click', async () => {
        const projId = btn.dataset.id;
        if (confirm("Are you sure you want to delete this project?")) {
          try {
            const res = await fetch(`/api/projects?id=${projId}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${adminToken}` }
            });
            if (res.ok) {
              showToast("Project deleted successfully.", "success");
              loadProjects();
              loadStats();
            } else {
              throw new Error();
            }
          } catch (err) {
            showToast("Failed to delete project.", "error");
          }
        }
      });
    });
  }

  // Open Add Project Modal
  addNewProjectBtn.addEventListener('click', () => {
    projectForm.reset();
    document.getElementById('projId').value = '';
    document.getElementById('projectModalTitle').textContent = "Add New Project";
    projectModal.style.display = 'flex';
  });

  closeProjModal.addEventListener('click', () => projectModal.style.display = 'none');

  // Submit Project Form (Add/Edit)
  projectForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('projId').value;
    const title = document.getElementById('projTitle').value.trim();
    const description = document.getElementById('projDesc').value.trim();
    const details = document.getElementById('projDetails').value.split('\n').map(d => d.trim()).filter(d => d);
    const tags = document.getElementById('projTags').value.split(',').map(t => t.trim()).filter(t => t);
    const githubLink = document.getElementById('projGithub').value.trim();
    const liveLink = document.getElementById('projLive').value.trim();
    const image = document.getElementById('projImage').value.trim();
    const order = parseInt(document.getElementById('projOrder').value) || 0;

    const payload = { title, description, details, tags, githubLink, liveLink, image, order };
    
    const url = id ? `/api/projects?id=${id}` : '/api/projects';
    const method = id ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showToast(id ? "Project updated successfully!" : "Project created successfully!", "success");
        projectModal.style.display = 'none';
        loadProjects();
        loadStats();
      } else {
        const data = await res.json();
        showToast(data.error || "Failed to save project.", "error");
      }
    } catch (err) {
      showToast("Network error saving project.", "error");
    }
  });

  // ==========================================
  // 4. CERTIFICATIONS MANAGER
  // ==========================================
  async function loadCertificates() {
    const tableBody = document.querySelector('#certsTable tbody');
    tableBody.innerHTML = '<tr><td colspan="6" class="text-center">Loading certificates...</td></tr>';

    try {
      const res = await fetch('/api/certificates');
      if (!res.ok) throw new Error("Could not retrieve certificates");
      certsData = await res.json();

      tableBody.innerHTML = '';
      if (certsData.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="text-center">No certificates registered.</td></tr>';
        return;
      }

      certsData.forEach(cert => {
        const tr = document.createElement('tr');
        
        tr.innerHTML = `
          <td>${cert.order}</td>
          <td><strong>${escapeHtml(cert.title)}</strong></td>
          <td>${escapeHtml(cert.issuer)}</td>
          <td>${escapeHtml(cert.issueDate)}</td>
          <td><a href="${cert.credentialUrl}" target="_blank" class="text-cyan">Verify Link <i class="fa-solid fa-arrow-up-right-from-square"></i></a></td>
          <td>
            <div class="action-buttons-cell">
              <button class="btn-icon btn-edit-cert" data-id="${cert._id}" title="Edit"><i class="fa-solid fa-pen-to-square"></i></button>
              <button class="btn-icon btn-delete btn-delete-cert" data-id="${cert._id}" title="Delete"><i class="fa-solid fa-trash"></i></button>
            </div>
          </td>
        `;
        tableBody.appendChild(tr);
      });

      bindCertActions();

    } catch (err) {
      tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-danger">Error: ${err.message}</td></tr>`;
    }
  }

  function bindCertActions() {
    // Edit
    document.querySelectorAll('.btn-edit-cert').forEach(btn => {
      btn.addEventListener('click', () => {
        const certId = btn.dataset.id;
        const cert = certsData.find(c => c._id === certId);
        if (cert) {
          document.getElementById('certModalTitle').textContent = "Edit Certificate";
          document.getElementById('certId').value = cert._id;
          document.getElementById('certTitle').value = cert.title;
          document.getElementById('certIssuer').value = cert.issuer;
          document.getElementById('certCredUrl').value = cert.credentialUrl;
          document.getElementById('certDate').value = cert.issueDate;
          document.getElementById('certOrder').value = cert.order;
          document.getElementById('certImage').value = cert.image || '';
          
          certModal.style.display = 'flex';
        }
      });
    });

    // Delete
    document.querySelectorAll('.btn-delete-cert').forEach(btn => {
      btn.addEventListener('click', async () => {
        const certId = btn.dataset.id;
        if (confirm("Are you sure you want to delete this certificate?")) {
          try {
            const res = await fetch(`/api/certificates?id=${certId}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${adminToken}` }
            });
            if (res.ok) {
              showToast("Certificate deleted successfully.", "success");
              loadCertificates();
              loadStats();
            } else {
              throw new Error();
            }
          } catch (err) {
            showToast("Failed to delete certificate.", "error");
          }
        }
      });
    });
  }

  addNewCertBtn.addEventListener('click', () => {
    certForm.reset();
    document.getElementById('certId').value = '';
    document.getElementById('certModalTitle').textContent = "Add Certificate";
    certModal.style.display = 'flex';
  });

  closeCertModal.addEventListener('click', () => certModal.style.display = 'none');

  // Submit Certificate Form (Add/Edit)
  certForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = document.getElementById('certId').value;
    const title = document.getElementById('certTitle').value.trim();
    const issuer = document.getElementById('certIssuer').value.trim();
    const credentialUrl = document.getElementById('certCredUrl').value.trim();
    const issueDate = document.getElementById('certDate').value.trim();
    const order = parseInt(document.getElementById('certOrder').value) || 0;
    const image = document.getElementById('certImage').value.trim();

    const payload = { title, issuer, credentialUrl, issueDate, order, image };
    const url = id ? `/api/certificates?id=${id}` : '/api/certificates';
    const method = id ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showToast(id ? "Certificate updated!" : "Certificate created!", "success");
        certModal.style.display = 'none';
        loadCertificates();
        loadStats();
      } else {
        const data = await res.json();
        showToast(data.error || "Failed to save certificate.", "error");
      }
    } catch (err) {
      showToast("Network error saving certificate.", "error");
    }
  });

  // ==========================================
  // 5. PROFILE MANAGER
  // ==========================================
  async function loadProfileSettings() {
    try {
      const res = await fetch('/api/profile');
      if (res.ok) {
        const profile = await res.json();
        document.getElementById('profName').value = profile.name || '';
        document.getElementById('profCgpa').value = profile.cgpa || '';
        document.getElementById('profTitle').value = profile.title || '';
        document.getElementById('profAbout').value = profile.about || '';
        document.getElementById('profGithub').value = profile.githubUrl || '';
        document.getElementById('profLinkedin').value = profile.linkedinUrl || '';
        document.getElementById('profEmail').value = profile.email || '';
        document.getElementById('profResume').value = profile.resumeUrl || '';
        
        // Counter variables
        if (profile.achievements) {
          document.getElementById('counterProjVal').value = profile.achievements.completedProjects || 0;
          document.getElementById('counterCertVal').value = profile.achievements.certificationsEarned || 0;
          document.getElementById('counterWorkVal').value = profile.achievements.workshopsAttended || 0;
          document.getElementById('counterHackVal').value = profile.achievements.hackathonsParticipated || 0;
        }
      }
    } catch (err) {
      console.error("Error loading profile settings:", err);
    }
  }

  profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Retain skills from database fetch, so we fetch profile again, update fields, and submit.
    try {
      const profileGetRes = await fetch('/api/profile');
      const profile = await profileGetRes.json();
      
      // Update form fields
      profile.name = document.getElementById('profName').value.trim();
      profile.cgpa = document.getElementById('profCgpa').value.trim();
      profile.title = document.getElementById('profTitle').value.trim();
      profile.about = document.getElementById('profAbout').value.trim();
      profile.githubUrl = document.getElementById('profGithub').value.trim();
      profile.linkedinUrl = document.getElementById('profLinkedin').value.trim();
      profile.email = document.getElementById('profEmail').value.trim();
      profile.resumeUrl = document.getElementById('profResume').value.trim();
      
      profile.achievements = {
        completedProjects: parseInt(document.getElementById('counterProjVal').value) || 0,
        certificationsEarned: parseInt(document.getElementById('counterCertVal').value) || 0,
        workshopsAttended: parseInt(document.getElementById('counterWorkVal').value) || 0,
        hackathonsParticipated: parseInt(document.getElementById('counterHackVal').value) || 0
      };

      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(profile)
      });

      if (res.ok) {
        showToast("Profile settings saved successfully!", "success");
        loadProfileSettings();
        loadStats();
      } else {
        const data = await res.json();
        showToast(data.error || "Failed to update profile.", "error");
      }
    } catch (err) {
      showToast("Error sending profile updates.", "error");
    }
  });

  // Utility HTML Escape
  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
});
