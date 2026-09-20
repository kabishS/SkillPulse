/**
 * SkillPulse - User Portal & Home JavaScript (SIH26135)
 * Dynamic cross-portal synchronization via localStorage
 */

// Storage Keys
const STORAGE_JOBS_KEY = 'skillpulse_jobs';
const STORAGE_USERS_KEY = 'skillpulse_users';
const STORAGE_CURRENT_USER = 'skillpulse_current_user';
const STORAGE_NOTIFS_KEY = 'skillpulse_company_notifs';

// Active User State
let currentUser = null;

// Initialize User State on Load
document.addEventListener('DOMContentLoaded', () => {
    const savedUser = localStorage.getItem(STORAGE_CURRENT_USER);
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
        } catch (e) {
            currentUser = null;
        }
    }
    renderUserDashboard();
});

// Cross-tab synchronization listener
window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_JOBS_KEY) {
        renderOpportunities();
        renderMatchedCompanies();
        updateDashboardStats();
    }
});

// Modal Controls
function showAuthModal(portalName) {
    if (portalName === 'Company') {
        window.location.href = 'company.html';
        return;
    }
    document.getElementById('authModalTitle').innerText = portalName + " Portal Authentication";
    document.getElementById('authModal').classList.remove('hidden');
}

function hideAuthModal() {
    document.getElementById('authModal').classList.add('hidden');
}

function toggleAuthMode(mode) {
    if (mode === 'signup') {
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('signupForm').classList.remove('hidden');
        document.getElementById('authModalTitle').innerText = "Create SkillPulse Candidate Account";
    } else {
        document.getElementById('signupForm').classList.add('hidden');
        document.getElementById('loginForm').classList.remove('hidden');
        document.getElementById('authModalTitle').innerText = "Candidate Login";
    }
}

function toggleEmpFields(show) {
    const empDiv = document.getElementById('employeeFields');
    if (show) empDiv.classList.remove('hidden');
    else empDiv.classList.add('hidden');
}

// User Registration
function handleSignupSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const password = document.getElementById('regPassword').value;
    const gender = document.getElementById('regGender').value;
    const college = document.getElementById('regCollege').value.trim();
    const degree = document.getElementById('regDegree').value.trim();
    const gradYear = document.getElementById('regGradYear').value.trim();
    const eduLevel = document.getElementById('regEduLevel').value;
    
    const isEmp = document.querySelector('input[name="empStatus"]:checked').value === 'employee';
    let company = "", salary = "", empId = "";
    if (isEmp) {
        company = document.getElementById('regCompany').value.trim();
        salary = document.getElementById('regSalary').value.trim();
        empId = document.getElementById('regEmpId').value.trim();
    }

    const rawSkills = document.getElementById('regSkills').value;
    const skills = rawSkills ? rawSkills.split(',').map(s => s.trim().toLowerCase()).filter(s => s) : [];

    const projTitle = document.getElementById('regProjTitle').value.trim();
    const projDesc = document.getElementById('regProjDesc').value.trim();
    const projLink = document.getElementById('regProjLink').value.trim();

    const projects = projTitle ? [{
        title: projTitle,
        desc: projDesc || "Showcases candidate technical skills",
        link: projLink || "#"
    }] : [];

    let resumeName = "resume.pdf";
    const resumeInput = document.getElementById('regResume');
    if (resumeInput && resumeInput.files && resumeInput.files[0]) {
        resumeName = resumeInput.files[0].name;
    }

    currentUser = {
        name,
        email,
        phone,
        password,
        gender,
        college,
        degree,
        gradYear,
        eduLevel,
        isEmployee: isEmp,
        company,
        salary,
        empId,
        skills,
        projects,
        resume: resumeName,
        registeredAt: new Date().toLocaleDateString()
    };

    // Save to users list in localStorage
    saveUserToDirectory(currentUser);

    // Save active session
    localStorage.setItem(STORAGE_CURRENT_USER, JSON.stringify(currentUser));

    hideAuthModal();
    loginSuccess();
}

// User Login
function handleLoginSubmit(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    
    // Check if user exists in registered list
    const users = getUsersFromDirectory();
    let found = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!found) {
        // Create user from login email
        const namePart = email.split('@')[0];
        const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        found = {
            name: formattedName,
            email: email,
            phone: "+91 98765 00000",
            gender: "Not specified",
            college: "Engineering College",
            degree: "B.Tech Computer Science",
            gradYear: "2026",
            eduLevel: "Undergraduate",
            isEmployee: false,
            skills: ["python", "sql", "ai"],
            projects: [{
                title: "Portfolio Project",
                desc: "Demonstrates core technical competencies",
                link: "#"
            }],
            resume: `${namePart}_resume.pdf`
        };
        saveUserToDirectory(found);
    }

    currentUser = found;
    localStorage.setItem(STORAGE_CURRENT_USER, JSON.stringify(currentUser));

    hideAuthModal();
    loginSuccess();
}

function loginAsDemoUser() {
    // Quick login for testing
    let users = getUsersFromDirectory();
    let demoUser = users.find(u => u.email === "srikar@skillpulse.org");

    if (!demoUser) {
        demoUser = {
            name: "Srikar",
            email: "srikarmaringanti1@gmail.com",
            phone: "9704386933",
            gender: "Male",
            college: "gpcet",
            degree: "cse",
            gradYear: "2012",
            eduLevel: "Undergraduate",
            isEmployee: false,
            skills: ["python", "c", "ai", "ml", "dl"],
            projects: [{
                title: "portfolio web site",
                desc: "it showcases our skills",
                link: "#"
            }],
            resume: "resume of srikar.pdf"
        };
        saveUserToDirectory(demoUser);
    }

    currentUser = demoUser;
    localStorage.setItem(STORAGE_CURRENT_USER, JSON.stringify(currentUser));
    loginSuccess();
}

function loginSuccess() {
    renderUserDashboard();
    document.getElementById('landingView').classList.add('hidden');
    document.getElementById('dashboardView').classList.remove('hidden');
    switchTab('dashboard');
}

function handleLogout() {
    localStorage.removeItem(STORAGE_CURRENT_USER);
    currentUser = null;
    document.getElementById('dashboardView').classList.add('hidden');
    document.getElementById('landingView').classList.remove('hidden');
}

// Helpers for localStorage User directory
function getUsersFromDirectory() {
    try {
        const raw = localStorage.getItem(STORAGE_USERS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

function saveUserToDirectory(user) {
    const users = getUsersFromDirectory();
    const idx = users.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
    if (idx >= 0) {
        users[idx] = user;
    } else {
        users.unshift(user);
    }
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));

    // Notify company side
    notifyCompanyDirectoryUpdate(user);
}

function notifyCompanyDirectoryUpdate(user) {
    try {
        let notifs = JSON.parse(localStorage.getItem(STORAGE_NOTIFS_KEY) || "[]");
        notifs.unshift({
            icon: "fa-user-plus",
            title: `New Candidate Registered: ${user.name}`,
            time: "Just now",
            desc: `${user.name} (${user.degree}, ${user.college}) logged in. Verified skills: ${user.skills.join(', ')}.`
        });
        localStorage.setItem(STORAGE_NOTIFS_KEY, JSON.stringify(notifs.slice(0, 20)));
    } catch (e) {}
}

function getCompanyJobs() {
    try {
        const raw = localStorage.getItem(STORAGE_JOBS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch (e) {
        return [];
    }
}

// Render Dashboard Data & Views
function renderUserDashboard() {
    if (!currentUser) return;

    const initial = currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U';
    const avatarEl = document.getElementById('userAvatarCircle');
    if (avatarEl) avatarEl.innerText = initial;
    
    const nameBrief = document.getElementById('userNameBrief');
    if (nameBrief) nameBrief.innerText = currentUser.name;

    const emailBrief = document.getElementById('userEmailBrief');
    if (emailBrief) emailBrief.innerText = currentUser.email;

    document.querySelectorAll('.usr-name').forEach(el => el.innerText = currentUser.name);

    // Render Skills
    const skillHTML = currentUser.skills && currentUser.skills.length > 0
        ? currentUser.skills.map(s => `<span class="skill-pill">${s}</span>`).join('')
        : '<p style="color: var(--text-muted); font-size: 0.85rem;">No skills added yet.</p>';
    
    const skillsListEl = document.getElementById('userSkillsList');
    if (skillsListEl) skillsListEl.innerHTML = skillHTML;
    
    const profSkillsEl = document.getElementById('profSkillsWrap');
    if (profSkillsEl) profSkillsEl.innerHTML = skillHTML;

    // Stat: Skills Count
    const statSkillsEl = document.getElementById('statSkillsCount');
    if (statSkillsEl) statSkillsEl.innerText = currentUser.skills ? currentUser.skills.length : 0;

    // Render Projects
    const projectsListEl = document.getElementById('userProjectsList');
    if (projectsListEl) {
        if (currentUser.projects && currentUser.projects.length > 0) {
            projectsListEl.innerHTML = currentUser.projects.map(p => `
                <div class="project-item">
                    <h4>${p.title}</h4>
                    <p>${p.desc}</p>
                    ${p.link && p.link !== '#' ? `<a href="${p.link}" target="_blank" class="project-link"><i class="fa-solid fa-link"></i> View project</a>` : ''}
                </div>
            `).join('');
        } else {
            projectsListEl.innerHTML = '<p style="color: var(--text-muted); font-size: 0.85rem;">No projects added yet.</p>';
        }
    }

    // Profile Details
    const pAvatar = document.getElementById('profAvatar');
    if (pAvatar) pAvatar.innerText = initial;
    const pName = document.getElementById('profName');
    if (pName) pName.innerText = currentUser.name;
    const pEmailSub = document.getElementById('profEmailSub');
    if (pEmailSub) pEmailSub.innerText = currentUser.email;
    const pFullName = document.getElementById('profFullName');
    if (pFullName) pFullName.innerText = currentUser.name;
    const pEmail = document.getElementById('profEmail');
    if (pEmail) pEmail.innerText = currentUser.email;
    const pPhone = document.getElementById('profPhone');
    if (pPhone) pPhone.innerText = currentUser.phone || "Not provided";
    const pCollege = document.getElementById('profCollege');
    if (pCollege) pCollege.innerText = currentUser.college || "Not provided";
    const pDegree = document.getElementById('profDegree');
    if (pDegree) pDegree.innerText = currentUser.degree || "Not provided";
    const pGradYear = document.getElementById('profGradYear');
    if (pGradYear) pGradYear.innerText = currentUser.gradYear || "2026";
    const pResume = document.getElementById('profResume');
    if (pResume) pResume.innerText = currentUser.resume || "No resume uploaded";

    renderOpportunities();
    renderMatchedCompanies();
    updateDashboardStats();
}

// Compute Match Percentage
function calculateSkillMatch(jobSkills) {
    if (!currentUser || !currentUser.skills || currentUser.skills.length === 0 || !jobSkills || jobSkills.length === 0) {
        return 0;
    }
    const userSkills = currentUser.skills.map(s => s.toLowerCase());
    let matchCount = 0;
    jobSkills.forEach(req => {
        if (userSkills.some(us => us.includes(req.toLowerCase()) || req.toLowerCase().includes(us))) {
            matchCount++;
        }
    });
    return Math.round((matchCount / jobSkills.length) * 100);
}

// Render Available Opportunities (Dynamic from Company Posts)
function renderOpportunities(filterQuery = "") {
    const container = document.getElementById('opportunitiesContainer');
    if (!container) return;

    const jobs = getCompanyJobs();

    if (jobs.length === 0) {
        container.innerHTML = `
            <div class="empty-card" style="grid-column: span 2;">
                <div class="empty-icon"><i class="fa-solid fa-briefcase"></i></div>
                <h3>No opportunities posted yet</h3>
                <p>When companies publish jobs or internships in the Company Portal, they will dynamically appear here with your personalized skill match score.</p>
                <a href="company.html" class="btn btn-secondary btn-sm" style="margin-top: 10px;">
                    <i class="fa-solid fa-building"></i> Switch to Company Portal to Post a Job
                </a>
            </div>
        `;
        return;
    }

    let filtered = jobs;
    if (filterQuery) {
        const q = filterQuery.toLowerCase();
        filtered = jobs.filter(j => 
            j.title.toLowerCase().includes(q) ||
            (j.company && j.company.toLowerCase().includes(q)) ||
            (j.skills && j.skills.some(s => s.toLowerCase().includes(q)))
        );
    }

    container.innerHTML = filtered.map(job => {
        const matchScore = calculateSkillMatch(job.skills || []);
        return `
            <div class="opp-card">
                <div class="flex-between">
                    <span class="opp-badge ${job.type === 'Internship' ? 'internship' : 'job'}">${job.type}</span>
                    <span class="skill-pill" style="font-weight: 700; ${matchScore >= 50 ? 'background:#dcfce7; color:#166534;' : ''}">
                        ${matchScore}% Match
                    </span>
                </div>
                <h3>${job.title}</h3>
                <p class="opp-company"><i class="fa-solid fa-building"></i> ${job.company || "Hiring Company"}</p>
                <div class="opp-meta-grid">
                    <span><i class="fa-solid fa-location-dot"></i> ${job.location}</span>
                    <span><i class="fa-solid fa-money-bill-wave"></i> ${job.salary}</span>
                    <span><i class="fa-solid fa-graduation-cap"></i> ${job.qualification || 'Any Degree'}</span>
                    <span><i class="fa-solid fa-briefcase"></i> ${job.experience || '0-1 yrs'}</span>
                </div>
                <p class="opp-desc">${job.desc || "Exciting opportunity to work with our dynamic technical team."}</p>
                <div class="skills-wrap" style="margin-bottom: 16px;">
                    ${(job.skills || []).map(s => `<span class="skill-pill">${s}</span>`).join('')}
                </div>
                <button class="btn btn-primary btn-sm" onclick="applyToJob(${job.id}, '${job.title}', '${job.company || "Company"}')">
                    Apply Now <i class="fa-solid fa-paper-plane"></i>
                </button>
            </div>
        `;
    }).join('');
}

// Render Matched Companies (50%+ match)
function renderMatchedCompanies() {
    const container = document.getElementById('matchedCompaniesContainer');
    if (!container) return;

    const jobs = getCompanyJobs();
    const matched = jobs.filter(j => calculateSkillMatch(j.skills || []) >= 50);

    if (matched.length === 0) {
        container.innerHTML = `
            <div class="empty-card" style="width: 100%;">
                <div class="empty-icon"><i class="fa-solid fa-bullseye"></i></div>
                <h3>No suitable opportunity found</h3>
                <p>You don't have any opportunities matching at 50% or above yet. Once companies post roles matching your skills, they will appear here.</p>
                <button class="btn btn-primary" onclick="switchTab('recommended-courses')">
                    View recommended courses
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="opp-grid">
            ${matched.map(job => {
                const matchScore = calculateSkillMatch(job.skills || []);
                return `
                    <div class="opp-card">
                        <div class="flex-between">
                            <span class="opp-badge job">${job.type}</span>
                            <span class="match-tag" style="background:#16a34a; color:#fff; padding:4px 10px; border-radius:20px; font-weight:700; font-size:0.82rem;">
                                ${matchScore}% Match
                            </span>
                        </div>
                        <h3>${job.title}</h3>
                        <p class="opp-company"><i class="fa-solid fa-building"></i> ${job.company || "Partner Company"}</p>
                        <p class="opp-desc">${job.desc}</p>
                        <div class="skills-wrap" style="margin-bottom: 14px;">
                            ${(job.skills || []).map(s => `<span class="skill-pill verified"><i class="fa-solid fa-check"></i> ${s}</span>`).join('')}
                        </div>
                        <button class="btn btn-primary btn-sm" onclick="applyToJob(${job.id}, '${job.title}', '${job.company || "Company"}')">
                            Apply Now
                        </button>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

// Apply to Job
function applyToJob(jobId, jobTitle, companyName) {
    if (!currentUser) return;
    alert(`Application submitted for "${jobTitle}" at ${companyName}! Tech recruiters have been notified.`);

    // Record notification for company
    try {
        let notifs = JSON.parse(localStorage.getItem(STORAGE_NOTIFS_KEY) || "[]");
        notifs.unshift({
            icon: "fa-user-check",
            title: `${currentUser.name} applied for ${jobTitle}`,
            time: "Just now",
            desc: `Candidate ${currentUser.name} (${currentUser.degree}) submitted an application with a ${calculateSkillMatch([])}% matching profile.`
        });
        localStorage.setItem(STORAGE_NOTIFS_KEY, JSON.stringify(notifs.slice(0, 20)));
    } catch (e) {}
}

// Update Dashboard Numbers
function updateDashboardStats() {
    const jobs = getCompanyJobs();
    const matchedCount = jobs.filter(j => calculateSkillMatch(j.skills || []) >= 50).length;

    const matchedOppStat = document.getElementById('statMatchedOpps');
    if (matchedOppStat) matchedOppStat.innerText = matchedCount;

    // Empty state on Dashboard
    const emptyDashBox = document.getElementById('dashboardEmptyBox');
    if (emptyDashBox) {
        if (matchedCount === 0) {
            emptyDashBox.innerHTML = `
                <div class="empty-card">
                    <div class="empty-icon"><i class="fa-solid fa-bullseye"></i></div>
                    <h3>No suitable opportunity found</h3>
                    <p>We couldn't find any opportunities matching your skills above 50%. Check out recommended courses or wait for new company job postings.</p>
                    <button class="btn btn-primary" onclick="switchTab('recommended-courses')">
                        View recommended courses
                    </button>
                </div>
            `;
        } else {
            emptyDashBox.innerHTML = `
                <div style="background: var(--white); border: 1px solid var(--border-blue); border-radius: 16px; padding: 24px; margin-bottom: 28px; box-shadow: var(--shadow-sm);">
                    <div class="flex-between" style="margin-bottom: 12px;">
                        <h4 style="color: var(--navy-blue); font-size: 1.1rem; font-weight: 700;">
                            <i class="fa-solid fa-circle-check" style="color: #16a34a;"></i> ${matchedCount} Active Opportunit${matchedCount > 1 ? 'ies' : 'y'} Matched!
                        </h4>
                        <button class="btn btn-primary btn-sm" onclick="switchTab('opportunities')">Browse Opportunities</button>
                    </div>
                    <p style="color: var(--text-muted); font-size: 0.9rem;">Roles from hiring companies match 50%+ of your verified skills.</p>
                </div>
            `;
        }
    }
}

// Tab Switching
function switchTab(tabId) {
    const tabs = ['dashboard', 'profile', 'resume-analyzer', 'opportunities', 'matched-companies', 'recommended-courses', 'notifications', 'settings'];
    tabs.forEach(t => {
        const tabEl = document.getElementById('tab-' + t);
        const menuEl = document.getElementById('menu-' + t);
        if (tabEl) tabEl.classList.add('hidden');
        if (menuEl) menuEl.classList.remove('active');
    });

    const targetTab = document.getElementById('tab-' + tabId);
    const targetMenu = document.getElementById('menu-' + tabId);
    if (targetTab) targetTab.classList.remove('hidden');
    if (targetMenu) targetMenu.classList.add('active');

    if (tabId === 'opportunities') renderOpportunities();
    if (tabId === 'matched-companies') renderMatchedCompanies();
}

// Resume Analyzer Simulation
function runResumeAnalyzer() {
    const role = document.getElementById('targetJobRole').value;
    const resDiv = document.getElementById('analyzerResult');
    resDiv.innerHTML = `
        <h4 style="color: var(--primary-blue); font-size: 1rem; margin-bottom: 8px;"><i class="fa-solid fa-circle-check"></i> SkillPulse Analysis for: ${role}</h4>
        <p style="font-size: 0.9rem;">Skill Match Score: <strong>88%</strong></p>
        <div class="skills-wrap" style="margin-top: 10px;">
            <span class="skill-pill" style="background:#dcfce7; color:#166534;">Matched Skills: Python, ML, AI, C</span>
            <span class="skill-pill" style="background:#fee2e2; color:#991b1b;">Recommended Skill Gap: PyTorch, Docker, Kubernetes</span>
        </div>
    `;
    resDiv.classList.remove('hidden');
}

function filterOpportunities(q) {
    renderOpportunities(q);
}
