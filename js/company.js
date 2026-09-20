/**
 * SkillPulse - Company Portal JavaScript (SIH26135)
 * Dynamic cross-portal synchronization via localStorage
 */

// Storage Keys
const STORAGE_JOBS_KEY = 'skillpulse_jobs';
const STORAGE_USERS_KEY = 'skillpulse_users';
const STORAGE_NOTIFS_KEY = 'skillpulse_company_notifs';
const STORAGE_ACTIVE_COMPANY = 'skillpulse_active_company';

// Active Company State
let currentCompany = {
    name: "TechCorp Solutions",
    email: "hr@techcorp.com",
    industry: "Information Technology & AI",
    size: "50-200 Employees",
    website: "https://techcorp.example.com",
    contactPerson: "Pooja Hegde",
    phone: "+91 98765 43210",
    location: "Bengaluru, Karnataka, India",
    description: "Building next-generation enterprise AI and analytics platforms for high-growth sectors."
};

// Initialize Company State on Load
document.addEventListener('DOMContentLoaded', () => {
    const savedComp = localStorage.getItem(STORAGE_ACTIVE_COMPANY);
    if (savedComp) {
        try { currentCompany = JSON.parse(savedComp); } catch (e) {}
    }
    renderJobs();
    renderCandidates();
    renderNotifications();
    updateCompanyUI();
});

// Cross-tab synchronization listener
window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_USERS_KEY || e.key === STORAGE_NOTIFS_KEY) {
        renderCandidates();
        renderNotifications();
    }
});

// Storage Helpers
function getStoredJobs() {
    try {
        const raw = localStorage.getItem(STORAGE_JOBS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

function saveStoredJobs(jobs) {
    localStorage.setItem(STORAGE_JOBS_KEY, JSON.stringify(jobs));
}

function getRegisteredUsers() {
    try {
        const raw = localStorage.getItem(STORAGE_USERS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

function getStoredNotifications() {
    try {
        const raw = localStorage.getItem(STORAGE_NOTIFS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

// Authentication Modal Controls
function showAuthModal(mode) {
    toggleAuthMode(mode || 'login');
    document.getElementById('authModal').classList.remove('hidden');
}

function hideAuthModal() {
    document.getElementById('authModal').classList.add('hidden');
}

function toggleAuthMode(mode) {
    const loginForm = document.getElementById('companyLoginForm');
    const signupForm = document.getElementById('companySignupForm');
    const modalTitle = document.getElementById('authModalTitle');

    if (mode === 'signup') {
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
        modalTitle.innerText = "Register SkillPulse Employer Account";
    } else {
        signupForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        modalTitle.innerText = "Company Portal Login";
    }
}

// Auth Handlers
function handleCompanyLoginSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    if (email) currentCompany.email = email;
    localStorage.setItem(STORAGE_ACTIVE_COMPANY, JSON.stringify(currentCompany));
    hideAuthModal();
    loginSuccess();
}

function handleCompanySignupSubmit(e) {
    e.preventDefault();
    currentCompany.name = document.getElementById('compName').value.trim() || "TechCorp Solutions";
    currentCompany.email = document.getElementById('compEmail').value.trim() || "hr@techcorp.com";
    currentCompany.industry = document.getElementById('compIndustry').value;
    currentCompany.size = document.getElementById('compSize').value;
    currentCompany.contactPerson = document.getElementById('compContactPerson').value.trim() || "HR Lead";
    currentCompany.location = document.getElementById('compLocation').value.trim() || "Bengaluru, India";

    localStorage.setItem(STORAGE_ACTIVE_COMPANY, JSON.stringify(currentCompany));
    hideAuthModal();
    loginSuccess();
}

function demoQuickLogin() {
    localStorage.setItem(STORAGE_ACTIVE_COMPANY, JSON.stringify(currentCompany));
    loginSuccess();
}

function loginSuccess() {
    updateCompanyUI();
    document.getElementById('landingView').classList.add('hidden');
    document.getElementById('dashboardView').classList.remove('hidden');
    switchTab('dashboard');
    renderJobs();
    renderCandidates();
    renderNotifications();
}

function handleCompanyLogout() {
    document.getElementById('dashboardView').classList.add('hidden');
    document.getElementById('landingView').classList.remove('hidden');
}

// Tab Switching
function switchTab(tabId) {
    const tabs = ['dashboard', 'post-job', 'match-user', 'notification', 'settings'];
    tabs.forEach(t => {
        const el = document.getElementById('tab-' + t);
        const menuEl = document.getElementById('menu-' + t);
        if (el) el.classList.add('hidden');
        if (menuEl) menuEl.classList.remove('active');
    });

    const activeEl = document.getElementById('tab-' + tabId);
    const activeMenu = document.getElementById('menu-' + tabId);
    if (activeEl) activeEl.classList.remove('hidden');
    if (activeMenu) activeMenu.classList.add('active');

    if (tabId === 'match-user') renderCandidates();
    if (tabId === 'dashboard') renderJobs();
}

// UI Updating
function updateCompanyUI() {
    const initial = currentCompany.name ? currentCompany.name.charAt(0).toUpperCase() : 'T';
    const avatarEl = document.getElementById('companyAvatarCircle');
    if (avatarEl) avatarEl.innerText = initial;
    
    const nameBrief = document.getElementById('companyNameBrief');
    if (nameBrief) nameBrief.innerText = currentCompany.name;

    const emailBrief = document.getElementById('companyEmailBrief');
    if (emailBrief) emailBrief.innerText = currentCompany.email;

    const welcomeEl = document.getElementById('compWelcomeName');
    if (welcomeEl) welcomeEl.innerText = currentCompany.name;

    // Settings fields
    const sName = document.getElementById('setCompName');
    const sEmail = document.getElementById('setCompEmail');
    const sPerson = document.getElementById('setCompPerson');
    const sLoc = document.getElementById('setCompLoc');
    const sBio = document.getElementById('setCompBio');

    if (sName) sName.value = currentCompany.name;
    if (sEmail) sEmail.value = currentCompany.email;
    if (sPerson) sPerson.value = currentCompany.contactPerson;
    if (sLoc) sLoc.value = currentCompany.location;
    if (sBio) sBio.value = currentCompany.description;
}

// Render Published Jobs
function renderJobs() {
    const container = document.getElementById('companyJobsList');
    if (!container) return;

    const jobs = getStoredJobs();
    const users = getRegisteredUsers();

    const statActive = document.getElementById('statActiveJobs');
    if (statActive) statActive.innerText = jobs.length;

    const statApplicants = document.getElementById('statTotalApplicants');
    if (statApplicants) statApplicants.innerText = users.length > 0 ? users.length * 2 : 0;

    const statMatched = document.getElementById('statMatchedCandidates');
    if (statMatched) statMatched.innerText = users.length;

    if (jobs.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; background: var(--bg-light); border-radius: 12px; border: 1px dashed #cbd5e1;">
                <i class="fa-solid fa-briefcase" style="font-size: 2.2rem; color: #94a3b8; margin-bottom: 12px;"></i>
                <h4 style="color: var(--navy-blue); margin-bottom: 6px;">No Active Job Requisitions Yet</h4>
                <p style="color: var(--text-muted); font-size: 0.88rem; max-width: 480px; margin: 0 auto 16px;">
                    When you post a job, it will automatically publish to the User Portal for candidates to discover and apply.
                </p>
                <button class="btn btn-primary btn-sm" onclick="switchTab('post-job')">
                    <i class="fa-solid fa-plus"></i> Post Your First Job
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = jobs.map(job => `
        <div class="job-item">
            <div class="job-info">
                <h4>${job.title}</h4>
                <p><i class="fa-solid fa-location-dot"></i> ${job.location} &nbsp;|&nbsp; <i class="fa-solid fa-money-bill-wave"></i> ${job.salary} &nbsp;|&nbsp; Posted ${job.postedDate}</p>
                <div class="skills-wrap" style="margin-top: 8px;">
                    ${(job.skills || []).map(s => `<span class="skill-pill">${s}</span>`).join('')}
                </div>
            </div>
            <div style="text-align: right;">
                <span class="status-badge active">${job.status || 'Active'}</span>
                <p style="font-size: 0.82rem; color: var(--primary-blue); font-weight: 600; margin-top: 6px;">
                    <i class="fa-solid fa-users"></i> ${job.applicants || 0} Applicants
                </p>
            </div>
        </div>
    `).join('');
}

// Post New Job Handler (Published into localStorage for User Portal)
function handlePostJobSubmit(e) {
    e.preventDefault();

    const title = document.getElementById('jobTitle').value.trim();
    const type = document.getElementById('jobType').value;
    const location = document.getElementById('jobLocation').value.trim();
    const salary = document.getElementById('jobSalary').value.trim();
    const exp = document.getElementById('jobExp').value;
    const skillsRaw = document.getElementById('jobSkills').value.trim();
    const qual = document.getElementById('jobQual').value.trim();
    const desc = document.getElementById('jobDesc').value.trim();

    const skillsArr = skillsRaw.split(',').map(s => s.trim()).filter(s => s);

    const newJob = {
        id: Date.now(),
        company: currentCompany.name,
        title: title,
        type: type,
        location: location,
        salary: salary,
        experience: exp,
        skills: skillsArr.length ? skillsArr : ["General Skills"],
        qualification: qual,
        status: "Active",
        applicants: 0,
        postedDate: "Today",
        desc: desc
    };

    const jobs = getStoredJobs();
    jobs.unshift(newJob);
    saveStoredJobs(jobs);

    // Add Notification
    let notifs = getStoredNotifications();
    notifs.unshift({
        icon: "fa-circle-check",
        title: `Job Requisition Published: ${title}`,
        time: "Just now",
        desc: `New ${type} posted for ${location}. Live on SkillPulse User Portal for candidates.`
    });
    localStorage.setItem(STORAGE_NOTIFS_KEY, JSON.stringify(notifs.slice(0, 20)));

    alert(`Job Requisition "${title}" published successfully! It is now live on the User Portal.`);
    document.getElementById('postJobForm').reset();
    renderJobs();
    renderNotifications();
    switchTab('dashboard');
}

// Compute Match Score between Candidate and Company Jobs
function calculateCandidateMatch(candidateSkills) {
    const jobs = getStoredJobs();
    if (jobs.length === 0 || !candidateSkills || candidateSkills.length === 0) {
        return { bestJob: "General Profile", score: 75 };
    }

    let bestJob = jobs[0].title;
    let highestScore = 0;

    jobs.forEach(job => {
        if (!job.skills || job.skills.length === 0) return;
        let matchCount = 0;
        job.skills.forEach(req => {
            if (candidateSkills.some(cs => cs.toLowerCase().includes(req.toLowerCase()) || req.toLowerCase().includes(cs.toLowerCase()))) {
                matchCount++;
            }
        });
        const score = Math.round((matchCount / job.skills.length) * 100);
        if (score >= highestScore) {
            highestScore = score;
            bestJob = job.title;
        }
    });

    return { bestJob, score: Math.max(highestScore, 65) };
}

// Render Candidate Matches (Dynamic from User Portal Signups/Logins)
function renderCandidates(filterQuery = "") {
    const container = document.getElementById('candidatesContainer');
    if (!container) return;

    const registeredUsers = getRegisteredUsers();

    if (registeredUsers.length === 0) {
        container.innerHTML = `
            <div class="empty-card" style="grid-column: span 2;">
                <div class="empty-icon"><i class="fa-solid fa-users-slash"></i></div>
                <h3>No candidates registered yet</h3>
                <p>Once candidates sign up or log in on the SkillPulse User Portal, their verified skills, degree, and credentials will automatically appear here for transparent matching.</p>
                <a href="index.html" class="btn btn-secondary btn-sm" style="margin-top: 10px;">
                    <i class="fa-solid fa-user"></i> Open User Portal to Register a Candidate
                </a>
            </div>
        `;
        return;
    }

    let filtered = registeredUsers;
    if (filterQuery) {
        const q = filterQuery.toLowerCase();
        filtered = registeredUsers.filter(c => 
            (c.name && c.name.toLowerCase().includes(q)) || 
            (c.skills && c.skills.some(s => s.toLowerCase().includes(q))) ||
            (c.degree && c.degree.toLowerCase().includes(q)) ||
            (c.college && c.college.toLowerCase().includes(q))
        );
    }

    container.innerHTML = filtered.map(c => {
        const match = calculateCandidateMatch(c.skills || []);
        const firstLetter = c.name ? c.name.charAt(0).toUpperCase() : 'C';
        const projectDesc = c.projects && c.projects.length > 0 ? `${c.projects[0].title} - ${c.projects[0].desc}` : 'Technical Portfolio';

        return `
            <div class="candidate-card">
                <div>
                    <div class="candidate-header">
                        <div style="display: flex; align-items: center;">
                            <div class="candidate-avatar">${firstLetter}</div>
                            <div class="candidate-meta">
                                <h4>${c.name}</h4>
                                <p><i class="fa-solid fa-graduation-cap"></i> ${c.degree || 'Degree'} (${c.college || 'Institute'})</p>
                                <p><i class="fa-solid fa-envelope"></i> ${c.email}</p>
                            </div>
                        </div>
                        <span class="match-tag ${match.score >= 80 ? 'high' : 'medium'}">${match.score}% Match</span>
                    </div>

                    <div style="background: #f8fafc; padding: 10px 14px; border-radius: 10px; margin-bottom: 12px; font-size: 0.82rem;">
                        <strong>Target Fit:</strong> <span style="color: var(--primary-blue); font-weight: 600;">${match.bestJob}</span><br>
                        <strong>Status:</strong> <span style="color: #16a34a;"><i class="fa-solid fa-circle-check"></i> Active Candidate</span>
                    </div>

                    <div style="margin-bottom: 12px;">
                        <h5 style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 6px;">Verified Skill Badges:</h5>
                        <div class="skills-wrap">
                            ${(c.skills || []).map(s => `<span class="skill-pill verified"><i class="fa-solid fa-check"></i> ${s}</span>`).join('')}
                        </div>
                    </div>

                    <div style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 16px;">
                        <i class="fa-solid fa-laptop-code"></i> <strong>Project:</strong> ${projectDesc}
                    </div>
                </div>

                <div style="display: flex; gap: 10px; border-top: 1px solid #f1f5f9; padding-top: 14px;">
                    <button class="btn btn-primary btn-sm" style="flex: 1;" onclick="shortlistCandidate('${c.name}')">
                        <i class="fa-solid fa-user-plus"></i> Shortlist Candidate
                    </button>
                    <button class="btn btn-outline btn-sm" onclick="alert('Viewing verified resume: ${c.resume || "resume.pdf"}')">
                        <i class="fa-solid fa-file-pdf"></i> Resume
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function shortlistCandidate(name) {
    alert(`Candidate ${name} has been added to ${currentCompany.name}'s shortlisted interview pipeline!`);
}

function filterCandidatesInput(val) {
    renderCandidates(val);
}

// Render Notifications
function renderNotifications() {
    const container = document.getElementById('companyNotifList');
    if (!container) return;

    const notifs = getStoredNotifications();

    if (notifs.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 30px; color: var(--text-muted); font-size: 0.9rem;">
                <i class="fa-solid fa-bell-slash" style="font-size: 1.8rem; margin-bottom: 10px; color: #cbd5e1;"></i>
                <p>No notifications yet. When candidates apply or register, alerts will appear here.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = notifs.map(n => `
        <div class="notif-item">
            <div class="notif-icon"><i class="fa-solid ${n.icon}"></i></div>
            <div>
                <h4 style="font-size: 0.95rem; font-weight: 600; color: var(--navy-blue);">${n.title}</h4>
                <p style="font-size: 0.82rem; color: var(--text-muted); margin-bottom: 4px;">${n.desc}</p>
                <span style="font-size: 0.75rem; color: var(--primary-blue); font-weight: 500;">${n.time}</span>
            </div>
        </div>
    `).join('');
}

function saveCompanySettings(e) {
    e.preventDefault();
    currentCompany.name = document.getElementById('setCompName').value.trim();
    currentCompany.email = document.getElementById('setCompEmail').value.trim();
    currentCompany.contactPerson = document.getElementById('setCompPerson').value.trim();
    currentCompany.location = document.getElementById('setCompLoc').value.trim();
    currentCompany.description = document.getElementById('setCompBio').value.trim();

    localStorage.setItem(STORAGE_ACTIVE_COMPANY, JSON.stringify(currentCompany));
    updateCompanyUI();
    alert("Company settings saved successfully!");
}
