// =============================================================
//  DessertWall Studio — Shared Application Logic
// =============================================================

// ------ WhatsApp Helper (kept ONLY for bottom button & contact page) ------
function openWhatsApp(message) {
  const num = (appData && appData.business && appData.business.whatsapp) || "7667305677";
  const url = `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

// ------ Navbar scroll effect ------
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
});

// ------ Hamburger menu ------
function toggleNav() {
  const links = document.getElementById('nav-links');
  const ham = document.getElementById('hamburger');
  if (links) links.classList.toggle('open');
  if (ham) ham.classList.toggle('open');
}

// ------ Toast notifications ------
function showToast(msg, type = '') {
  let c = document.getElementById('toast-container');
  if (!c) {
    c = document.createElement('div');
    c.id = 'toast-container';
    document.body.appendChild(c);
  }
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => t.style.opacity = '0', 2800);
  setTimeout(() => t.remove(), 3200);
}

// =============================================================
//  Running Offer Bar (Car) Below Navbar
// =============================================================
function initRunningOfferBar() {
  const track = document.getElementById('offer-marquee-track');
  if (!track || !appData || !appData.offers) return;

  const activeOffers = appData.offers.filter(o => o.active !== false);
  if (!activeOffers.length) {
    const bar = document.getElementById('running-offer-bar');
    if (bar) bar.style.display = 'none';
    return;
  }

  // Render items and duplicate them for seamless loop
  const buildItemsHtml = (offers) => {
    return offers.map(o => `
      <a href="menu.html${o.linkCategory ? '?cat=' + encodeURIComponent(o.linkCategory) : ''}" class="offer-item" title="${o.description || o.title}">
        <span class="offer-pill">${o.badge || 'OFFER'}</span>
        <span class="offer-text">${o.discountText || o.title}</span>
        <span class="offer-cta">${o.linkText || 'Explore'}</span>
      </a>
      <span class="offer-sep">•</span>
    `).join('');
  };

  const html = buildItemsHtml(activeOffers) + buildItemsHtml(activeOffers);
  track.innerHTML = html;
}

// =============================================================
//  User Authentication System (Login / Sign-up / Profile)
// =============================================================
const DEFAULT_USERS = [
  {
    id: "usr_1",
    name: "Priya Sharma",
    phone: "9845012345",
    email: "priya.sharma@example.com",
    password: "password123",
    address: "Flat 402, Green Glen Layout, Bellandur, Bangalore 560103",
    createdAt: "2026-01-15T10:00:00.000Z"
  },
  {
    id: "usr_2",
    name: "Arjun Mehta",
    phone: "9741288990",
    email: "arjun.m@example.com",
    password: "password123",
    address: "100ft Road, HAL 2nd Stage, Indiranagar, Bangalore 560038",
    createdAt: "2026-02-10T14:30:00.000Z"
  }
];

function getRegisteredUsers() {
  try {
    const s = localStorage.getItem('hds_users');
    if (s) {
      const users = JSON.parse(s);
      if (Array.isArray(users) && users.length > 0) {
        let changed = false;
        users.forEach(u => {
          if (!u.password) {
            u.password = 'password123';
            changed = true;
          }
          if (!u.id) {
            u.id = 'usr_' + Math.random().toString(36).substr(2, 9);
            changed = true;
          }
        });
        if (changed) saveRegisteredUsers(users);
        return users;
      }
    }
  } catch (e) { }
  saveRegisteredUsers(DEFAULT_USERS);
  return DEFAULT_USERS;
}

function saveRegisteredUsers(users) {
  try {
    localStorage.setItem('hds_users', JSON.stringify(users));
  } catch (e) { }
}

function getCurrentUser() {
  try {
    const s = localStorage.getItem('hds_current_user');
    if (s) {
      const user = JSON.parse(s);
      if (user && !user.password) {
        const users = getRegisteredUsers();
        const found = users.find(u =>
          (user.id && u.id === user.id) ||
          (user.phone && u.phone && u.phone.replace(/\D/g, '') === user.phone.replace(/\D/g, '')) ||
          (user.email && u.email && u.email.toLowerCase() === user.email.toLowerCase())
        );
        user.password = found ? found.password : 'password123';
      }
      return user;
    }
  } catch (e) { }
  return null;
}

function setCurrentUser(user) {
  if (user) {
    if (!user.id) user.id = 'usr_' + Date.now();
    localStorage.setItem('hds_current_user', JSON.stringify(user));
    // Synchronize into hds_users list
    const users = getRegisteredUsers();
    const userDigits = (user.phone || '').replace(/\D/g, '').slice(-10);
    const idx = users.findIndex(u =>
      (user.id && u.id === user.id) ||
      (userDigits && (u.phone || '').replace(/\D/g, '').slice(-10) === userDigits) ||
      (user.email && u.email && u.email.toLowerCase() === user.email.toLowerCase())
    );
    if (idx >= 0) {
      users[idx] = { ...users[idx], ...user };
    } else {
      users.push(user);
    }
    saveRegisteredUsers(users);
  } else {
    localStorage.removeItem('hds_current_user');
  }
  updateUserAuthUI();
}

function updateUserAuthUI() {
  const user = getCurrentUser();
  const authContainer = document.getElementById('nav-user-container');
  if (!authContainer) return;

  if (user) {
    const initial = (user.name || 'U').charAt(0).toUpperCase();
    authContainer.innerHTML = `
      <div class="nav-user-wrap">
        <button class="nav-user-logged" onclick="toggleUserDropdown(event)" aria-label="User Account">
          <div class="user-avatar-circle">${initial}</div>
          <span>${user.name.split(' ')[0]}</span>
          <span style="font-size:.7rem;margin-left:2px;">▾</span>
        </button>
        <div class="user-dropdown-menu hidden" id="user-dropdown-menu">
          <div style="padding:12px 18px 8px; font-size:.82rem; color:var(--c-text-muted);">
            Signed in as<br><strong style="color:var(--c-brown);font-size:.92rem;">${user.name}</strong>
            <div style="font-size:.74rem;color:var(--c-text-soft);margin-top:2px;">${user.phone}</div>
          </div>
          <div class="user-dropdown-divider"></div>
          <div class="user-dropdown-item" onclick="openProfileModal()">
            <img src="images/edit.svg" style="width:20px"> Edit Profile & Details
          </div>
          <div class="user-dropdown-item" onclick="openMyOrdersModal()">
            <img src="images/orders.svg"> My Orders History
          </div>
          <div class="user-dropdown-item" onclick="openCart()">
            <img src="images/cart.svg"> View My Cart
          </div>
          <div class="user-dropdown-divider"></div>
          <div class="user-dropdown-item" onclick="logoutUser()" style="color:#c33;font-weight:600;">
            <img src="images/logout.svg"> Sign Out
          </div>
        </div>
      </div>
    `;
  } else {
    authContainer.innerHTML = `
      <button class="nav-user-btn" onclick="openAuthModal('signin')" aria-label="Sign In">
        <span>👤</span> <span>Sign In</span>
      </button>
    `;
  }
}

function toggleUserDropdown(e) {
  if (e) e.stopPropagation();
  const menu = document.getElementById('user-dropdown-menu');
  if (menu) menu.classList.toggle('hidden');
}

document.addEventListener('click', (e) => {
  const menu = document.getElementById('user-dropdown-menu');
  if (menu && !menu.classList.contains('hidden')) {
    if (!e.target.closest('.nav-user-wrap')) {
      menu.classList.add('hidden');
    }
  }
  // Backdrop click closes auth modal
  const authModal = document.getElementById('auth-modal');
  if (authModal && !authModal.classList.contains('hidden') && e.target === authModal) {
    closeAuthModal();
  }
  // Backdrop click closes profile modal
  const profileModal = document.getElementById('profile-modal');
  if (profileModal && !profileModal.classList.contains('hidden') && e.target === profileModal) {
    closeProfileModal();
  }
  // Backdrop click closes my-orders modal
  const myOrdersModal = document.getElementById('my-orders-modal');
  if (myOrdersModal && !myOrdersModal.classList.contains('hidden') && e.target === myOrdersModal) {
    closeMyOrdersModal();
  }
  // Backdrop click closes track-order modal
  const trackModal = document.getElementById('track-order-modal');
  if (trackModal && !trackModal.classList.contains('hidden') && e.target === trackModal) {
    closeTrackOrderModal();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const authModal = document.getElementById('auth-modal');
    if (authModal && !authModal.classList.contains('hidden')) closeAuthModal();
    const profileModal = document.getElementById('profile-modal');
    if (profileModal && !profileModal.classList.contains('hidden')) closeProfileModal();
    const myOrdersModal = document.getElementById('my-orders-modal');
    if (myOrdersModal && !myOrdersModal.classList.contains('hidden')) closeMyOrdersModal();
    const trackModal = document.getElementById('track-order-modal');
    if (trackModal && !trackModal.classList.contains('hidden')) closeTrackOrderModal();
    const cancelDlg = document.getElementById('cancel-order-dialog');
    if (cancelDlg && !cancelDlg.classList.contains('hidden')) closeCancelDialog();
  }
});

// Modal injection guarantee
function ensureModalsExist() {
  // 1. Ensure modern Auth Modal
  let authModal = document.getElementById('auth-modal');
  if (!authModal) {
    authModal = document.createElement('div');
    authModal.id = 'auth-modal';
    authModal.className = 'hidden';
    authModal.setAttribute('role', 'dialog');
    authModal.setAttribute('aria-modal', 'true');
    document.body.appendChild(authModal);
  }

  // Check if authModal contains tab switcher or needs upgraded markup
  if (!authModal.querySelector('.auth-tabs-wrap')) {
    authModal.innerHTML = `
      <div class="auth-card">
        <div class="auth-header">
          <div class="auth-header-text">
            <h3 id="auth-modal-title">Welcome Back</h3>
            <p id="auth-modal-subtitle">Sign in with your mobile / email and password</p>
          </div>
          <button class="auth-close-btn" onclick="closeAuthModal()" aria-label="Close sign-in">×</button>
        </div>
        <div class="auth-body">

          <!-- Tab Switcher -->
          <div class="auth-tabs-wrap">
            <button type="button" class="auth-tab-btn active" id="auth-tab-signin" onclick="switchAuthTab('signin')">
              Sign In
            </button>
            <button type="button" class="auth-tab-btn" id="auth-tab-signup" onclick="switchAuthTab('signup')">
              Create Account
            </button>
          </div>

          <!-- SIGN IN PANEL -->
          <div id="auth-panel-signin">
            <form id="login-form" onsubmit="handleUserLogin(event)">
              <div class="auth-form-group">
                <label>Mobile Number or Email *</label>
                <input type="text" id="login-identifier" placeholder="e.g. 9845012345 or priya@example.com" required autocomplete="username" />
              </div>
              <div class="auth-form-group">
                <label>Password *</label>
                <div class="password-input-wrap">
                  <input type="password" id="login-password" placeholder="Enter your account password" required autocomplete="current-password" />
                  <button type="button" class="password-toggle-btn" onclick="togglePasswordVisibility('login-password', this)" aria-label="Toggle password visibility">👁️</button>
                </div>
              </div>
              <button type="submit" class="btn btn-primary btn-block" style="width:100%;justify-content:center;margin-top:10px;">
                Sign In to Account
              </button>
              <div class="auth-switch-prompt">
                Don't have an account yet? <button type="button" onclick="switchAuthTab('signup')">Sign Up Here</button>
              </div>
            </form>
          </div>

          <!-- SIGN UP PANEL -->
          <div id="auth-panel-signup" class="hidden">
            <form id="signup-form" onsubmit="handleUserSignup(event)">
              <div class="auth-form-group">
                <label>Full Name *</label>
                <input type="text" id="signup-name" placeholder="e.g. Sneha Patel" required autocomplete="name" />
              </div>
              <div class="auth-form-group">
                <label>Mobile Number (10 digits) *</label>
                <input type="tel" id="signup-phone" placeholder="e.g. 9876543210" required autocomplete="tel" />
              </div>
              <div class="auth-form-group">
                <label>Email Address *</label>
                <input type="email" id="signup-email" placeholder="e.g. sneha@example.com" required autocomplete="email" />
              </div>
              <div class="auth-form-group">
                <label>Create Password *</label>
                <div class="password-input-wrap">
                  <input type="password" id="signup-password" placeholder="Minimum 6 characters" minlength="6" required autocomplete="new-password" />
                  <button type="button" class="password-toggle-btn" onclick="togglePasswordVisibility('signup-password', this)" aria-label="Toggle password visibility">👁️</button>
                </div>
                <div class="auth-field-hint">🔒 Minimum 6 characters</div>
              </div>
              <div class="auth-form-group">
                <label>Confirm Password *</label>
                <div class="password-input-wrap">
                  <input type="password" id="signup-confirm-password" placeholder="Re-enter your password" minlength="6" required autocomplete="new-password" />
                  <button type="button" class="password-toggle-btn" onclick="togglePasswordVisibility('signup-confirm-password', this)" aria-label="Toggle password visibility">👁️</button>
                </div>
              </div>
              <div class="auth-form-group">
                <label>Default Delivery Address (Optional)</label>
                <textarea id="signup-address" placeholder="Flat, Building, Area, Landmark, Bangalore..." rows="2" autocomplete="street-address"></textarea>
              </div>
              <button type="submit" class="btn btn-primary btn-block" style="width:100%;justify-content:center;margin-top:10px;">
                Create Account & Sign In
              </button>
              <div class="auth-switch-prompt">
                Already registered? <button type="button" onclick="switchAuthTab('signin')">Sign In Instead</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    `;
  }

  // 2. Ensure Profile Edit Modal
  let profileModal = document.getElementById('profile-modal');
  if (!profileModal) {
    profileModal = document.createElement('div');
    profileModal.id = 'profile-modal';
    profileModal.className = 'hidden';
    profileModal.setAttribute('role', 'dialog');
    profileModal.setAttribute('aria-modal', 'true');
    profileModal.innerHTML = `
      <div class="profile-card">
        <div class="profile-header">
          <div class="profile-header-user">
            <div class="profile-avatar-circle-lg" id="profile-avatar-circle">P</div>
            <div class="profile-header-text">
              <h3 id="profile-header-name">My Account Profile</h3>
              <p><span id="profile-header-phone">98450 12345</span> • Verified Customer</p>
            </div>
          </div>
          <button class="auth-close-btn" onclick="closeProfileModal()" aria-label="Close profile">×</button>
        </div>
        <div class="profile-body">
          <form id="profile-form" onsubmit="handleProfileUpdate(event)">
            <div class="auth-form-group">
              <label>Full Name *</label>
              <input type="text" id="profile-name" required placeholder="Your full name" />
            </div>
            <div class="auth-form-group">
              <label>Mobile Number *</label>
              <input type="tel" id="profile-phone" required placeholder="10-digit mobile number" />
            </div>
            <div class="auth-form-group">
              <label>Email Address</label>
              <input type="email" id="profile-email" placeholder="name@example.com" />
            </div>
            <div class="auth-form-group">
              <label>Default Delivery Address</label>
              <textarea id="profile-address" rows="2" placeholder="Apartment / Villa, Street, Locality, Bangalore..."></textarea>
            </div>

            <!-- Optional Password Update -->
            <div class="profile-section-divider">Security & Password</div>
            <div style="background:var(--c-cream);padding:14px;border-radius:var(--radius-sm);border:1px solid var(--c-border);margin-bottom:16px;">
              <div style="font-size:.78rem;color:var(--c-text-muted);margin-bottom:10px;">
                Leave password fields blank if you do not want to change your password.
              </div>
              <div class="auth-form-group" style="margin-bottom:10px;">
                <label style="font-size:.75rem;">Current Password (required to change password)</label>
                <div class="password-input-wrap">
                  <input type="password" id="profile-current-pass" placeholder="Enter current password" />
                  <button type="button" class="password-toggle-btn" onclick="togglePasswordVisibility('profile-current-pass', this)" aria-label="Toggle password visibility">👁️</button>
                </div>
              </div>
              <div class="auth-form-group" style="margin-bottom:10px;">
                <label style="font-size:.75rem;">New Password</label>
                <div class="password-input-wrap">
                  <input type="password" id="profile-new-pass" placeholder="Min. 6 characters" minlength="6" />
                  <button type="button" class="password-toggle-btn" onclick="togglePasswordVisibility('profile-new-pass', this)" aria-label="Toggle password visibility">👁️</button>
                </div>
              </div>
              <div class="auth-form-group" style="margin-bottom:0;">
                <label style="font-size:.75rem;">Confirm New Password</label>
                <div class="password-input-wrap">
                  <input type="password" id="profile-confirm-new-pass" placeholder="Re-type new password" minlength="6" />
                  <button type="button" class="password-toggle-btn" onclick="togglePasswordVisibility('profile-confirm-new-pass', this)" aria-label="Toggle password visibility">👁️</button>
                </div>
              </div>
            </div>

            <div class="profile-actions">
              <button type="button" class="btn btn-outline" onclick="closeProfileModal()">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Profile Changes</button>
            </div>
          </form>
        </div>
      </div>
    `;
    document.body.appendChild(profileModal);
  }

  // 3. Ensure Track Order Modal
  ensureTrackOrderModal();
  // 4. Ensure My Orders Modal
  ensureMyOrdersModal();
  // 5. Ensure Cancel Dialog
  ensureCancelDialog();
}

function switchAuthTab(tab) {
  const signinPanel = document.getElementById('auth-panel-signin');
  const signupPanel = document.getElementById('auth-panel-signup');
  const signinTab = document.getElementById('auth-tab-signin');
  const signupTab = document.getElementById('auth-tab-signup');
  const title = document.getElementById('auth-modal-title');
  const subtitle = document.getElementById('auth-modal-subtitle');

  if (tab === 'signup') {
    if (signinPanel) signinPanel.classList.add('hidden');
    if (signupPanel) signupPanel.classList.remove('hidden');
    if (signinTab) signinTab.classList.remove('active');
    if (signupTab) signupTab.classList.add('active');
    if (title) title.textContent = 'Create New Account';
    if (subtitle) subtitle.textContent = 'Join DessertWall Studio for instant ordering & order tracking';
    const firstInput = document.getElementById('signup-name');
    if (firstInput) setTimeout(() => firstInput.focus(), 60);
  } else {
    if (signinPanel) signinPanel.classList.remove('hidden');
    if (signupPanel) signupPanel.classList.add('hidden');
    if (signinTab) signinTab.classList.add('active');
    if (signupTab) signupTab.classList.remove('active');
    if (title) title.textContent = 'Welcome Back';
    if (subtitle) subtitle.textContent = 'Sign in with your mobile / email and password';
    const firstInput = document.getElementById('login-identifier');
    if (firstInput) setTimeout(() => firstInput.focus(), 60);
  }
}

function openAuthModal(defaultTab = 'signin') {
  ensureModalsExist();
  const modal = document.getElementById('auth-modal');
  if (modal) {
    switchAuthTab(defaultTab);
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closeAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) modal.classList.add('hidden');
  document.body.style.overflow = '';
}

function togglePasswordVisibility(inputId, btnEl) {
  const input = document.getElementById(inputId);
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    if (btnEl) btnEl.textContent = '🙈';
    if (btnEl) btnEl.setAttribute('aria-label', 'Hide password');
  } else {
    input.type = 'password';
    if (btnEl) btnEl.textContent = '👁️';
    if (btnEl) btnEl.setAttribute('aria-label', 'Show password');
  }
}

function handleUserLogin(e) {
  if (e) e.preventDefault();
  const rawId = (document.getElementById('login-identifier')?.value || document.getElementById('auth-phone')?.value || '').trim();
  const password = document.getElementById('login-password')?.value || '';

  if (!rawId) {
    showToast('Please enter your mobile number or email.', 'error');
    return;
  }

  if (!password) {
    showToast('Please enter your password to sign in.', 'error');
    return;
  }

  const users = getRegisteredUsers();
  const cleanEmail = rawId.toLowerCase();
  const digitsOnly = rawId.replace(/\D/g, '');
  const last10 = digitsOnly.length >= 10 ? digitsOnly.slice(-10) : digitsOnly;

  const user = users.find(u => {
    const uPhoneDigits = (u.phone || '').replace(/\D/g, '');
    const uLast10 = uPhoneDigits.length >= 10 ? uPhoneDigits.slice(-10) : uPhoneDigits;
    const phoneMatch = Boolean(last10 && uLast10 && last10 === uLast10);
    const emailMatch = Boolean(u.email && u.email.toLowerCase() === cleanEmail);
    return phoneMatch || emailMatch;
  });

  if (!user) {
    showToast('No account found with this mobile or email. Please create an account.', 'error');
    switchAuthTab('signup');
    const nameInput = document.getElementById('signup-name');
    if (nameInput) nameInput.focus();
    return;
  }

  const expectedPassword = user.password || 'password123';
  if (password !== expectedPassword) {
    showToast('Incorrect password. Please try again.', 'error');
    const passInput = document.getElementById('login-password');
    if (passInput) {
      passInput.focus();
      passInput.select();
    }
    return;
  }

  setCurrentUser(user);
  closeAuthModal();
  document.getElementById('login-form')?.reset();
  showToast(`Welcome back, ${user.name}! 👋`, 'success');
}

function handleUserSignup(e) {
  if (e) e.preventDefault();
  const name = document.getElementById('signup-name')?.value.trim();
  const phone = document.getElementById('signup-phone')?.value.trim();
  const email = document.getElementById('signup-email')?.value.trim();
  const password = document.getElementById('signup-password')?.value || '';
  const confirmPassword = document.getElementById('signup-confirm-password')?.value || '';
  const address = document.getElementById('signup-address')?.value.trim() || '';

  if (!name || !phone || !email || !password) {
    showToast('Please fill in all required fields.', 'error');
    return;
  }

  // Mobile validation (at least 10 digits)
  const phoneDigits = phone.replace(/\D/g, '');
  if (phoneDigits.length < 10) {
    showToast('Please enter a valid 10-digit mobile number.', 'error');
    return;
  }

  // Password validation
  if (password.length < 6) {
    showToast('Password must be at least 6 characters long.', 'error');
    return;
  }

  if (password !== confirmPassword) {
    showToast('Passwords do not match. Please verify.', 'error');
    return;
  }

  // Duplicate check
  const users = getRegisteredUsers();
  const last10 = phoneDigits.slice(-10);
  const existing = users.find(u => {
    const uDigits = (u.phone || '').replace(/\D/g, '');
    const phoneMatch = Boolean(uDigits.length >= 10 && uDigits.slice(-10) === last10);
    const emailMatch = Boolean(u.email && u.email.toLowerCase() === email.toLowerCase());
    return phoneMatch || emailMatch;
  });

  if (existing) {
    showToast('An account with this phone or email already exists. Please sign in.', 'error');
    switchAuthTab('signin');
    const idInput = document.getElementById('login-identifier');
    if (idInput) idInput.value = phone;
    return;
  }

  const newUser = {
    id: 'usr_' + Date.now(),
    name,
    phone,
    email,
    password,
    address,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveRegisteredUsers(users);
  setCurrentUser(newUser);

  closeAuthModal();
  document.getElementById('signup-form')?.reset();
  showToast(`Account created successfully! Welcome, ${name}! 🎉`, 'success');
}

// ------ Editable User Profile System ------
function openProfileModal() {
  ensureModalsExist();
  const user = getCurrentUser();
  if (!user) {
    openAuthModal('signin');
    return;
  }

  const modal = document.getElementById('profile-modal');
  if (!modal) return;

  // Pre-fill user values
  const nameEl = document.getElementById('profile-name');
  const phoneEl = document.getElementById('profile-phone');
  const emailEl = document.getElementById('profile-email');
  const addrEl = document.getElementById('profile-address');

  if (nameEl) nameEl.value = user.name || '';
  if (phoneEl) phoneEl.value = user.phone || '';
  if (emailEl) emailEl.value = user.email || '';
  if (addrEl) addrEl.value = user.address || '';

  // Avatar and headers
  const avatarEl = document.getElementById('profile-avatar-circle');
  if (avatarEl) avatarEl.textContent = (user.name || 'U').charAt(0).toUpperCase();

  const titleName = document.getElementById('profile-header-name');
  if (titleName) titleName.textContent = user.name || 'Customer Profile';

  const phoneBadge = document.getElementById('profile-header-phone');
  if (phoneBadge) phoneBadge.textContent = user.phone || '';

  // Reset password fields
  const currPass = document.getElementById('profile-current-pass');
  const newPass = document.getElementById('profile-new-pass');
  const confirmPass = document.getElementById('profile-confirm-new-pass');
  if (currPass) currPass.value = '';
  if (newPass) newPass.value = '';
  if (confirmPass) confirmPass.value = '';

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeProfileModal() {
  const modal = document.getElementById('profile-modal');
  if (modal) modal.classList.add('hidden');
  document.body.style.overflow = '';
}

function handleProfileUpdate(e) {
  if (e) e.preventDefault();
  const user = getCurrentUser();
  if (!user) return;

  const name = document.getElementById('profile-name')?.value.trim();
  const phone = document.getElementById('profile-phone')?.value.trim();
  const email = document.getElementById('profile-email')?.value.trim() || '';
  const address = document.getElementById('profile-address')?.value.trim() || '';

  if (!name || !phone) {
    showToast('Name and mobile number are required.', 'error');
    return;
  }

  const phoneDigits = phone.replace(/\D/g, '');
  if (phoneDigits.length < 10) {
    showToast('Please enter a valid 10-digit mobile number.', 'error');
    return;
  }

  // Check if another registered user has this phone or email
  const allUsers = getRegisteredUsers();
  const last10 = phoneDigits.slice(-10);
  const isSameUser = (u) => {
    if (user.id && u.id) return user.id === u.id;
    const uDigits = (u.phone || '').replace(/\D/g, '');
    if (uDigits && uDigits.slice(-10) === last10) return true;
    if (user.email && u.email) return user.email.toLowerCase() === (u.email || '').toLowerCase();
    return false;
  };

  const duplicate = allUsers.find(u =>
    !isSameUser(u) && (
      ((u.phone || '').replace(/\D/g, '').slice(-10) === last10) ||
      (email && u.email && u.email.toLowerCase() === email.toLowerCase())
    )
  );

  if (duplicate) {
    showToast('Another account is already registered with this phone number or email.', 'error');
    return;
  }

  // Password change handling (optional)
  const currentPass = document.getElementById('profile-current-pass')?.value || '';
  const newPass = document.getElementById('profile-new-pass')?.value || '';
  const confirmNewPass = document.getElementById('profile-confirm-new-pass')?.value || '';

  if (newPass || currentPass || confirmNewPass) {
    if (!currentPass) {
      showToast('Please enter your current password to authorize changing it.', 'error');
      return;
    }
    const expectedPass = user.password || 'password123';
    if (currentPass !== expectedPass) {
      showToast('Current password does not match.', 'error');
      return;
    }
    if (newPass.length < 6) {
      showToast('New password must be at least 6 characters long.', 'error');
      return;
    }
    if (newPass !== confirmNewPass) {
      showToast('New passwords do not match.', 'error');
      return;
    }
    user.password = newPass;
  }

  // Update user fields
  user.name = name;
  user.phone = phone;
  user.email = email;
  user.address = address;

  setCurrentUser(user);

  // Sync open checkout fields if open
  const chName = document.getElementById('checkout-name');
  const chPhone = document.getElementById('checkout-phone');
  const chEmail = document.getElementById('checkout-email');
  const chAddr = document.getElementById('checkout-address');
  if (chName) chName.value = name;
  if (chPhone) chPhone.value = phone;
  if (chEmail) chEmail.value = email;
  if (chAddr) chAddr.value = address;

  closeProfileModal();
  showToast('Profile details updated successfully!', 'success');
}

function logoutUser() {
  const user = getCurrentUser();
  setCurrentUser(null);
  showToast(user ? `Signed out successfully. Goodbye, ${user.name}!` : 'Logged out', 'success');
}

// ------ Customer Orders History Modal ------
function openMyOrdersModal() {
  const user = getCurrentUser();
  if (!user) {
    openAuthModal();
    return;
  }

  ensureMyOrdersModal();
  const modal = document.getElementById('my-orders-modal');
  const container = document.getElementById('my-orders-list');
  if (!container || !modal) return;

  const getUserOrders = () => {
    const allOrders = typeof getOrders === 'function' ? getOrders() : [];
    const userDigits = (user.phone || '').replace(/\D/g, '').slice(-10);
    const userEmail = (user.email || '').trim().toLowerCase();
    const userName = (user.name || '').trim().toLowerCase();

    return allOrders.filter(o => {
      const custDigits = (o.customer && o.customer.phone ? o.customer.phone.replace(/\D/g, '').slice(-10) : '');
      const custEmail = (o.customer && o.customer.email ? o.customer.email.trim().toLowerCase() : '');
      const custName = (o.customer && o.customer.name ? o.customer.name.trim().toLowerCase() : '');

      const phoneMatch = Boolean(userDigits && custDigits && userDigits === custDigits);
      const emailMatch = Boolean(userEmail && custEmail && userEmail === custEmail);
      const nameMatch = Boolean(userName && custName && userName === custName);

      return phoneMatch || emailMatch || nameMatch;
    });
  };

  const renderUserOrders = () => {
    const userOrders = getUserOrders();
    if (!userOrders.length) {
      container.innerHTML = `
        <div style="text-align:center;padding:40px 20px;color:var(--c-text-soft);">
          <div style="font-size:2.5rem;margin-bottom:8px;"><img src="images/orders.svg"></div>
          <h4>No Orders Found Yet</h4>
          <p style="font-size:.85rem;margin-top:4px;">You haven't placed an order with this account yet.</p>
          <button class="btn btn-primary btn-sm" onclick="closeMyOrdersModal(); window.location.href='menu.html'" style="margin-top:14px;">Browse Menu</button>
        </div>
      `;
    } else {
      container.innerHTML = userOrders.map(o => {
        const statusClass = `status-${(o.status || 'Pending').toLowerCase().replace(/\s+/g, '-')}`;
        const canCancel = !['Cancelled', 'Completed'].includes(o.status);
        const cancelledInfo = o.status === 'Cancelled' ? `
          <div style="background:#FFF5F5;border:1px solid #FFCDD2;border-radius:6px;padding:8px 10px;margin-top:8px;font-size:.78rem;">
            <span style="color:#C62828;font-weight:700;">Cancelled</span>
            ${o.cancelledAt ? `<div style="color:#9E1515;margin-top:2px;">${o.cancelledAt}</div>` : ''}
            ${o.cancelReason ? `<div style="color:#7F1D1D;margin-top:2px;font-style:italic;">"${o.cancelReason}"</div>` : ''}
          </div>` : '';
        return `
          <div class="customer-order-card" id="my-order-card-${o.id}">
            <div class="customer-order-card-header">
              <div>
                <strong style="color:var(--c-brown);font-size:1.02rem;">${o.id}</strong>
                <div style="font-size:.75rem;color:var(--c-text-muted);">${o.date || ''}</div>
              </div>
              <span class="status-badge ${statusClass}">${o.status}</span>
            </div>
            <div style="font-size:.85rem;margin-bottom:10px;">
              ${(o.items || []).map(i => `
                <div style="display:flex;justify-content:space-between;margin-bottom:3px;">
                  <span>• ${i.quantity}x ${i.name} (${i.size || 'Standard'})</span>
                  <strong>₹${((i.price || 0) * (i.quantity || 1)).toLocaleString()}</strong>
                </div>
              `).join('')}
            </div>
            ${cancelledInfo}
            <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px dashed var(--c-border);padding-top:8px;margin-top:8px;font-size:.85rem;flex-wrap:wrap;gap:8px;">
              <span>Mode: <strong>${(o.customer && o.customer.deliveryType === 'delivery') ? 'Home Delivery' : 'Studio Pickup'}</strong></span>
              <span style="font-weight:700;color:var(--c-brown);font-size:1rem;">Total: ₹${(o.total || 0).toLocaleString()}</span>
            </div>
            <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;">
              <button class="btn btn-primary btn-sm" onclick="trackOrderFromMyOrders('${o.id}')" style="flex:1;font-size:.82rem;display:inline-flex;align-items:center;justify-content:center;gap:6px;">Track Order
              </button>
              ${canCancel ? `<button class="btn-outline-danger" onclick="promptCancelOrder('${o.id}')" style="flex:1;font-size:.8rem;">✕ Cancel Order</button>` : ''}
            </div>
          </div>
        `;
      }).join('');
    }
  };

  renderUserOrders();
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function trackOrderFromMyOrders(orderId) {
  closeMyOrdersModal();
  setTimeout(() => {
    openTrackOrderModal(orderId, true);
  }, 50);
}

function closeMyOrdersModal() {
  const modal = document.getElementById('my-orders-modal');
  if (modal) modal.classList.add('hidden');
  document.body.style.overflow = '';
}

// =============================================================
//  TRACK ORDER MODAL
// =============================================================
const ORDER_STATUS_STEPS = [
  { key: 'Pending',          label: 'Order Placed',        icon: '📝', desc: 'Your order has been received and is awaiting confirmation.' },
  { key: 'Confirmed',        label: 'Order Confirmed',      icon: '👩‍🍳', desc: 'Our baker has confirmed your order.' },
  { key: 'Preparing',        label: 'Being Prepared',      icon: '🧁', desc: 'Your desserts are being freshly baked and decorated.' },
  { key: 'Ready',            label: 'Ready for Dispatch',   icon: '📦', desc: 'Packed and ready for delivery or pickup.' },
  { key: 'Out for Delivery', label: 'Out for Delivery',     icon: '🛵', desc: 'On the way to your address right now!' },
  { key: 'Completed',        label: 'Delivered!',           icon: '🎉', desc: 'Order completed. Thank you for choosing DessertWall Studio!' }
];

let _trackOrderUnsubscribe = null;
let _currentTrackedOrderId = null;

function openTrackOrderModal(orderId, fromMyOrders = false) {
  ensureTrackOrderModal();
  const modal = document.getElementById('track-order-modal');
  if (!modal) return;
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  if (orderId) {
    trackOrderById(orderId, fromMyOrders);
  } else {
    const user = typeof getCurrentUser === 'function' ? getCurrentUser() : null;
    if (user) {
      // Auto-fill search with user's phone
      const inp = document.getElementById('track-search-input');
      if (inp) inp.value = user.phone || '';
      // Try auto-search
      const orders = typeof getOrders === 'function' ? getOrders() : [];
      const userDigits = (user.phone || '').replace(/\D/g, '').slice(-10);
      const userOrders = orders.filter(o =>
        (userDigits && o.customer && o.customer.phone && o.customer.phone.replace(/\D/g, '').slice(-10) === userDigits) ||
        (user.name && o.customer && o.customer.name && o.customer.name.toLowerCase().includes(user.name.toLowerCase()))
      );
      if (userOrders.length === 1) {
        trackOrderById(userOrders[0].id, fromMyOrders);
      } else if (userOrders.length > 0) {
        renderTrackSearchResults(userOrders);
      }
    }
  }

  // Subscribe to live order updates
  if (_trackOrderUnsubscribe) _trackOrderUnsubscribe();
  if (typeof subscribeToOrderUpdates === 'function') {
    _trackOrderUnsubscribe = subscribeToOrderUpdates((msg) => {
      if (_currentTrackedOrderId) {
        const updatedOrder = (typeof getOrders === 'function' ? getOrders() : []).find(o => o.id === _currentTrackedOrderId);
        if (updatedOrder) renderTrackOrderDetails(updatedOrder, fromMyOrders);
      }
    });
  }
}

function trackOrderById(orderId, fromMyOrders = false) {
  ensureTrackOrderModal();
  const modal = document.getElementById('track-order-modal');
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
  const orders = typeof getOrders === 'function' ? getOrders() : [];
  const order = orders.find(o => o.id === orderId);
  if (order) {
    _currentTrackedOrderId = orderId;
    const inp = document.getElementById('track-search-input');
    if (inp) inp.value = orderId;
    renderTrackOrderDetails(order, fromMyOrders);
  } else {
    // Show not found in results area
    const resultsEl = document.getElementById('track-order-results');
    if (resultsEl) {
      resultsEl.innerHTML = `
        <div style="text-align:center;padding:36px 20px;color:var(--c-text-muted);">
          <h4 style="color:var(--c-brown);margin-bottom:6px;">Order Not Found</h4>
          <p style="font-size:.85rem;">No order found with ID: <strong>${orderId}</strong></p>
          <div style="margin-top:14px;">
            <button class="btn btn-primary btn-sm" onclick="closeTrackOrderModal(); openMyOrdersModal();">
              Back to My Orders
            </button>
          </div>
        </div>`;
    }
  }
}

function doTrackSearch() {
  const inp = document.getElementById('track-search-input');
  const q = inp ? inp.value.trim() : '';
  if (!q) { showToast('Please enter an Order ID or phone number', 'error'); return; }
  const found = typeof findOrderByIdOrPhone === 'function' ? findOrderByIdOrPhone(q) : [];
  const resultsEl = document.getElementById('track-order-results');
  if (!resultsEl) return;
  if (!found.length) {
    resultsEl.innerHTML = `
      <div style="text-align:center;padding:36px 20px;color:var(--c-text-muted);">
        <h4 style="color:var(--c-brown);margin-bottom:6px;">No Orders Found</h4>
        <p style="font-size:.85rem;">No orders match "${q}". Try your full Order ID (e.g., ORD-2026-101) or registered phone number.</p>
      </div>`;
    _currentTrackedOrderId = null;
  } else if (found.length === 1) {
    _currentTrackedOrderId = found[0].id;
    renderTrackOrderDetails(found[0]);
  } else {
    renderTrackSearchResults(found);
  }
}

function renderTrackSearchResults(orders) {
  const resultsEl = document.getElementById('track-order-results');
  if (!resultsEl) return;
  resultsEl.innerHTML = `
    <div style="font-size:.85rem;color:var(--c-text-muted);margin-bottom:12px;font-weight:600;">
      ${orders.length} order${orders.length > 1 ? 's' : ''} found — select to track:
    </div>
    ${orders.map(o => {
      const sc = `status-${o.status.toLowerCase().replace(/\s+/g, '-')}`;
      return `
        <div class="track-card-overview" onclick="_currentTrackedOrderId='${o.id}'; renderTrackOrderDetails(getOrders().find(x=>x.id==='${o.id}'))" style="cursor:pointer;margin-bottom:10px;">
          <div class="track-card-top">
            <div class="track-order-id-label">${o.id}</div>
            <span class="status-badge ${sc}">${o.status}</span>
          </div>
          <div style="font-size:.82rem;color:var(--c-text-muted);">📅 ${o.date} &nbsp;|&nbsp; ${o.customer.name} &nbsp;|&nbsp; ₹${o.total.toLocaleString()}</div>
        </div>`;
    }).join('')}`;
}

function renderTrackOrderDetails(order) {
  const resultsEl = document.getElementById('track-order-results');
  if (!resultsEl || !order) return;

  const statusClass = `status-${order.status.toLowerCase().replace(/\s+/g, '-')}`;
  const isCancelled = order.status === 'Cancelled';
  const isCompleted = order.status === 'Completed';
  const canCancel = !isCancelled && !isCompleted;

  // Build stepper
  const currentStepIdx = ORDER_STATUS_STEPS.findIndex(s => s.key === order.status);
  const stepperHtml = !isCancelled ? `
    <div class="track-stepper-container">
      <div class="stepper-header-meta">
        <span class="stepper-title">Delivery Progress</span>
        <span class="live-sync-pill"><span class="pulse-dot"></span> Live</span>
      </div>
      <div class="track-steps-list">
        ${ORDER_STATUS_STEPS.map((step, idx) => {
          let nodeClass = '';
          if (idx < currentStepIdx) nodeClass = 'completed';
          else if (idx === currentStepIdx) nodeClass = 'active';
          const icon = idx < currentStepIdx ? '✓' : step.icon;
          return `
            <div class="step-node ${nodeClass}">
              <div class="step-icon-wrap">${icon}</div>
              <div class="step-info">
                <div class="step-label">${step.label}</div>
                <div class="step-desc">${idx === currentStepIdx ? '<strong>' + step.desc + '</strong>' : step.desc}</div>
              </div>
            </div>`;
        }).join('')}
      </div>
    </div>` : `
    <div class="cancelled-order-banner">
      <div class="cancelled-banner-text">
        <h4>Order Cancelled</h4>
        <p>${order.cancelReason || 'This order was cancelled.'}</p>
        ${order.cancelledAt ? `&nbsp;<span class="cancelled-meta-pill">${order.cancelledAt}</span>` : ''}
      </div>
    </div>`;

  // Build items list
  const itemsList = (order.items || []).map(i =>
    `<div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px dashed var(--c-border);font-size:.85rem;">
      <span>${i.quantity}x ${i.name} (${i.size || 'Standard'})</span>
      <strong>₹${(i.price * i.quantity).toLocaleString()}</strong>
    </div>`
  ).join('');

  resultsEl.innerHTML = `
    <div class="track-card-overview">
      <div class="track-card-top">
        <div>
          <div class="track-order-id-label">${order.id}</div>
          <div style="font-size:.76rem;color:var(--c-text-muted);margin-top:4px;">Placed on ${order.date}</div>
        </div>
        <div style="text-align:right;">
          <span class="status-badge ${statusClass}">${order.status}</span>
          <div style="font-size:.75rem;color:var(--c-text-muted);margin-top:4px;">${order.customer.deliveryType === 'delivery' ? 'Home Delivery' : 'Pickup'}</div>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:.82rem;">
        <div><span style="color:var(--c-text-muted);">Customer</span><br><strong>${order.customer.name}</strong></div>
        <div><span style="color:var(--c-text-muted);">Preferred Date</span><br><strong>${order.customer.preferredDate || 'ASAP'}</strong> (${order.customer.timeSlot || '—'})</div>
        <div><span style="color:var(--c-text-muted);">Payment</span><br><strong>${order.paymentMethod || 'UPI'}</strong></div>
        <div><span style="color:var(--c-text-muted);">Total</span><br><strong style="color:var(--c-brown);font-size:1rem;">₹${order.total.toLocaleString()}</strong></div>
      </div>
    </div>

    ${stepperHtml}

    <div class="track-card-overview">
      <div style="font-size:.88rem;font-weight:700;color:var(--c-brown);margin-bottom:8px;font-family:'Playfair Display',serif;">🛍️ Items Ordered</div>
      ${itemsList}
    </div>

    ${canCancel ? `
    <div style="display:flex;justify-content:flex-end;margin-top:4px;">
      <button class="btn-outline-danger" onclick="promptCancelOrder('${order.id}')" id="btn-cancel-${order.id}">
        ✕ Cancel This Order
      </button>
    </div>` : ''}

    <div style="display:flex;gap:10px;justify-content:center;margin-top:14px;flex-wrap:wrap;">
      <button class="btn btn-primary btn-sm" onclick="closeTrackOrderModal(); openMyOrdersModal();" style="font-size:.82rem;">
        Back to My Orders
      </button>
    </div>`;
}

function closeTrackOrderModal() {
  const modal = document.getElementById('track-order-modal');
  if (modal) modal.classList.add('hidden');
  document.body.style.overflow = '';
  _currentTrackedOrderId = null;
  if (_trackOrderUnsubscribe) { _trackOrderUnsubscribe(); _trackOrderUnsubscribe = null; }
}

// =============================================================
//  CANCEL ORDER
// =============================================================
let _pendingCancelOrderId = null;

function promptCancelOrder(orderId) {
  _pendingCancelOrderId = orderId;
  ensureCancelDialog();
  const dialog = document.getElementById('cancel-order-dialog');
  const orderIdEl = document.getElementById('cancel-dialog-order-id');
  if (orderIdEl) orderIdEl.textContent = orderId;
  // Reset radio selection
  const radios = document.querySelectorAll('#cancel-order-dialog input[name="cancel-reason"]');
  radios.forEach(r => r.checked = false);
  if (radios[0]) radios[0].checked = true;
  if (dialog) { dialog.classList.remove('hidden'); document.body.style.overflow = 'hidden'; }
}

function closeCancelDialog() {
  _pendingCancelOrderId = null;
  const dialog = document.getElementById('cancel-order-dialog');
  if (dialog) dialog.classList.add('hidden');
  document.body.style.overflow = '';
}

function confirmCancelOrder() {
  if (!_pendingCancelOrderId) return;
  const radios = document.querySelectorAll('#cancel-order-dialog input[name="cancel-reason"]');
  let selectedReason = 'Customer requested cancellation';
  radios.forEach(r => { if (r.checked) selectedReason = r.value; });

  const result = typeof cancelOrder === 'function'
    ? cancelOrder(_pendingCancelOrderId, selectedReason, 'Customer')
    : { success: false, message: 'cancelOrder function not available' };

  if (result.success) {
    closeCancelDialog();
    showToast(`Order ${_pendingCancelOrderId} cancelled successfully.`, 'success');
    // Refresh any open track modal
    if (_currentTrackedOrderId === _pendingCancelOrderId) {
      renderTrackOrderDetails(result.order);
    }
    // Refresh My Orders if open
    const myOrdersModal = document.getElementById('my-orders-modal');
    if (myOrdersModal && !myOrdersModal.classList.contains('hidden')) {
      closeMyOrdersModal();
      setTimeout(openMyOrdersModal, 50);
    }
  } else {
    showToast(result.message || 'Could not cancel order.', 'error');
  }
}

// =============================================================
//  Modal Injection: Track Order & Cancel Dialog
// =============================================================
function ensureTrackOrderModal() {
  if (document.getElementById('track-order-modal')) return;
  const modal = document.createElement('div');
  modal.id = 'track-order-modal';
  modal.className = 'hidden';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.innerHTML = `
    <div class="track-order-box">
      <div class="track-order-header">
        <div class="track-header-title">
          <div class="track-icon-badge"><img src="images/orders.svg"></div>
          <div>
            <h3 style="font-family:'Playfair Display',serif;color:var(--c-brown);font-size:1.25rem;margin-bottom:2px;">Track Your Order</h3>
            <div style="font-size:.78rem;color:var(--c-text-muted);">Real-time delivery status &amp; progress</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:12px;">
          <span class="live-sync-pill"><span class="pulse-dot"></span> Live Updates</span>
          <button class="cart-close" onclick="closeTrackOrderModal()" aria-label="Close">×</button>
        </div>
      </div>
      <div class="track-order-body">
        <div id="track-order-results">
          <div style="text-align:center;padding:40px 20px;color:var(--c-text-muted);">
            <div style="font-size:3rem;margin-bottom:12px;"><img src="images/orders.svg"></div>
            <h4 style="font-family:'Playfair Display',serif;color:var(--c-brown);margin-bottom:8px;">Track Your Dessert Journey</h4>
            <p style="font-size:.86rem;">Enter your Order ID or the phone number used at checkout to see real-time delivery progress.</p>
          </div>
        </div>
      </div>
    </div>`;
  modal.addEventListener('click', (e) => { if (e.target === modal) closeTrackOrderModal(); });
  document.body.appendChild(modal);
}

function ensureCancelDialog() {
  if (document.getElementById('cancel-order-dialog')) return;
  const dialog = document.createElement('div');
  dialog.id = 'cancel-order-dialog';
  dialog.className = 'hidden';
  dialog.setAttribute('role', 'alertdialog');
  dialog.innerHTML = `
    <div class="cancel-modal-card">
      <div class="cancel-modal-header">
        <div class="cancel-alert-icon">⚠️</div>
        <div>
          <h4 style="font-family:'Playfair Display',serif;color:var(--c-brown);font-size:1.1rem;margin-bottom:4px;">Cancel Your Order?</h4>
          <p style="font-size:.83rem;color:var(--c-text-muted);">Order <strong id="cancel-dialog-order-id"></strong> will be marked as cancelled. This action cannot be undone.</p>
        </div>
      </div>
      <div style="font-size:.84rem;font-weight:600;color:var(--c-brown);margin-bottom:8px;">Reason for cancellation:</div>
      <div class="cancel-reasons-group">
        <label class="cancel-reason-label"><input type="radio" name="cancel-reason" value="Changed my mind" checked> <span>Changed my mind</span></label>
        <label class="cancel-reason-label"><input type="radio" name="cancel-reason" value="Ordered by mistake"> <span>Ordered by mistake</span></label>
        <label class="cancel-reason-label"><input type="radio" name="cancel-reason" value="Found a better option"> <span>Found a better option</span></label>
        <label class="cancel-reason-label"><input type="radio" name="cancel-reason" value="Delivery date not suitable"> <span>Delivery date not suitable</span></label>
        <label class="cancel-reason-label"><input type="radio" name="cancel-reason" value="Other reason"> <span>Other reason</span></label>
      </div>
      <div class="cancel-modal-actions">
        <button class="btn btn-outline" onclick="closeCancelDialog()">Keep Order</button>
        <button class="btn-danger" onclick="confirmCancelOrder()">Yes, Cancel Order</button>
      </div>
    </div>`;
  dialog.addEventListener('click', (e) => { if (e.target === dialog) closeCancelDialog(); });
  document.body.appendChild(dialog);
}

function ensureMyOrdersModal() {
  if (document.getElementById('my-orders-modal')) return;
  const modal = document.createElement('div');
  modal.id = 'my-orders-modal';
  modal.className = 'hidden';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(42,20,10,.65);backdrop-filter:blur(6px);z-index:3500;display:flex;align-items:center;justify-content:center;padding:20px;';
  modal.innerHTML = `
    <div class="checkout-box" style="max-width:560px;">
      <div class="checkout-header">
        <div style="display: flex; align-items: center; gap: 10px;">
          <img src="images/orders.svg">
          <h3 style="font-family:'Playfair Display',serif; color:var(--c-brown); font-size:1.35rem;">My Orders History</h3>
        </div>
        <button class="cart-close" onclick="closeMyOrdersModal()">&times;</button>
      </div>
      <div class="checkout-body">
        <div id="my-orders-list" class="customer-orders-list"></div>
      </div>
    </div>
  `;
  modal.addEventListener('click', (e) => { if (e.target === modal) closeMyOrdersModal(); });
  document.body.appendChild(modal);
}

// =============================================================
//  LIVE SYNC LISTENER (keeps all modals in sync)
// =============================================================
(function setupLiveSyncListener() {
  if (typeof subscribeToOrderUpdates !== 'function') return;
  subscribeToOrderUpdates((msg) => {
    // If track modal is open and we have a tracked order, refresh it
    const trackModal = document.getElementById('track-order-modal');
    if (trackModal && !trackModal.classList.contains('hidden') && _currentTrackedOrderId) {
      const updatedOrder = (typeof getOrders === 'function' ? getOrders() : []).find(o => o.id === _currentTrackedOrderId);
      if (updatedOrder) {
        renderTrackOrderDetails(updatedOrder);
        if (msg.type === 'STATUS_UPDATED' && msg.payload && msg.payload.orderId === _currentTrackedOrderId) {
          showToast(`Your order status updated: ${msg.payload.newStatus}`, 'success');
        }
      }
    }
  });
})();

// =============================================================
//  Product Card Renderer (No WhatsApp enquiry on products)
// =============================================================
function renderProductCard(p) {
  const badge = p.available
    ? (p.featured ? '<span class="badge-featured">★ Signature</span>' : '')
    : '<span class="badge-unavail">Unavailable</span>';

  return `
    <div class="product-card" id="card-${p.id}">
      <div class="product-card-img">
        <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='images/hero.jpg'" />
        ${badge}
      </div>
      <div class="product-card-body">
        <div class="product-cat">${p.category}</div>
        <h3 class="product-name">${p.name}</h3>
        <p class="product-desc">${p.description.substring(0, 110)}...</p>
        <div class="product-price">${p.priceLabel}</div>
        <div class="product-actions">
          <button class="btn ${p.available ? 'btn-primary' : 'btn-outline'} btn-sm btn-block" onclick="openProductModal('${p.id}')">
            ${p.available ? 'View Details' : 'View Details'}
          </button>
        </div>
      </div>
    </div>`;
}

// =============================================================
//  Product Modal & Add to Cart
// =============================================================
let currentProduct = null;
let modalQty = 1;

function openProductModal(productId) {
  const p = appData.products.find(x => x.id === productId);
  if (!p) return;
  currentProduct = p;
  modalQty = 1;

  document.getElementById('modal-img').src = p.image;
  document.getElementById('modal-img').alt = p.name;
  document.getElementById('modal-cat').textContent = p.category;
  document.getElementById('modal-name').textContent = p.name;
  document.getElementById('modal-price').textContent = p.priceLabel;
  document.getElementById('modal-desc').textContent = p.description;

  // Unavailable notice
  const unavailNotice = document.getElementById('modal-unavail-notice');
  if (unavailNotice) unavailNotice.classList.toggle('hidden', p.available);

  // Size chips
  const sizeSection = document.getElementById('size-section');
  const sizeChips = document.getElementById('size-chips');
  if (p.sizes && p.sizes.length) {
    sizeSection.style.display = '';
    sizeChips.innerHTML = p.sizes.map((s, i) =>
      `<button class="option-chip${i === 0 ? ' selected' : ''}" onclick="selectChip(this,'size-chips')">${s}</button>`
    ).join('');
  } else if (sizeSection) {
    sizeSection.style.display = 'none';
  }

  // Flavour chips
  const flavSection = document.getElementById('flavour-section');
  const flavChips = document.getElementById('flavour-chips');
  if (p.flavours && p.flavours.length) {
    flavSection.style.display = '';
    flavChips.innerHTML = p.flavours.map((f, i) =>
      `<button class="option-chip${i === 0 ? ' selected' : ''}" onclick="selectChip(this,'flavour-chips')">${f}</button>`
    ).join('');
  } else if (flavSection) {
    flavSection.style.display = 'none';
  }

  // Egg chips
  const eggSection = document.getElementById('egg-section');
  const eggChips = document.getElementById('egg-chips');
  if (p.eggOptions && p.eggOptions.length) {
    eggSection.style.display = '';
    eggChips.innerHTML = p.eggOptions.map((e, i) =>
      `<button class="option-chip${i === 0 ? ' selected' : ''}" onclick="selectChip(this,'egg-chips')">${e}</button>`
    ).join('');
  } else if (eggSection) {
    eggSection.style.display = 'none';
  }

  // Custom section
  const cs = document.getElementById('custom-section');
  if (cs) cs.style.display = p.customizationEnabled ? '' : 'none';
  if (document.getElementById('modal-custom')) document.getElementById('modal-custom').value = '';
  if (document.getElementById('modal-special')) document.getElementById('modal-special').value = '';
  if (document.getElementById('modal-date')) {
    document.getElementById('modal-date').value = '';
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('modal-date').min = today;
  }

  // Prep time
  const prepEl = document.getElementById('modal-prep');
  if (prepEl) {
    prepEl.textContent = p.preparationTime
      ? `⏱ Preparation time: ${p.preparationTime}. Please select a date accordingly.`
      : '';
  }

  // Reset Quantity
  updateModalQtyDisplay();
  updateModalPriceCalculation();

  const addBtn = document.getElementById('modal-add-cart-btn');
  if (addBtn) {
    addBtn.disabled = !p.available;
    addBtn.textContent = p.available ? 'Add to Cart ' : 'Currently Unavailable';
  }

  const modal = document.getElementById('product-modal');
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal() {
  const modal = document.getElementById('product-modal');
  if (modal) modal.classList.add('hidden');
  document.body.style.overflow = '';
  currentProduct = null;
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
document.getElementById('product-modal')?.addEventListener('click', function (e) {
  if (e.target === this) closeModal();
});

function selectChip(el, groupId) {
  document.querySelectorAll(`#${groupId} .option-chip`).forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
  updateModalPriceCalculation();
}

function getSelected(groupId) {
  const sel = document.querySelector(`#${groupId} .option-chip.selected`);
  return sel ? sel.textContent : '';
}

function changeModalQty(delta) {
  modalQty = Math.max(1, modalQty + delta);
  updateModalQtyDisplay();
  updateModalPriceCalculation();
}

function updateModalQtyDisplay() {
  const el = document.getElementById('modal-qty-val');
  if (el) el.textContent = modalQty;
}

function calculateCurrentItemUnitPrice() {
  if (!currentProduct) return 0;
  let base = currentProduct.price || 500;
  const size = getSelected('size-chips');

  // Multiplier for larger cake or box sizes
  if (size.includes('1.5 kg')) base = Math.round(base * 1.45);
  else if (size.includes('2 kg')) base = Math.round(base * 1.9);
  else if (size.includes('2.5 kg')) base = Math.round(base * 2.35);
  else if (size.includes('3 kg')) base = Math.round(base * 2.8);
  else if (size.includes('Box of 9')) base = Math.round(base * 1.35);
  else if (size.includes('Box of 12')) base = Math.round(base * 1.8);
  else if (size.includes('Box of 24')) base = Math.round(base * 3.4);
  else if (size.includes('4-Portion')) base = Math.round(base * 1.6);
  else if (size.includes('8-Portion')) base = Math.round(base * 3.0);

  return base;
}

function updateModalPriceCalculation() {
  const calcEl = document.getElementById('modal-price-calc');
  if (!calcEl || !currentProduct) return;
  const unit = calculateCurrentItemUnitPrice();
  const total = unit * modalQty;
  calcEl.textContent = `Unit Price: ₹${unit.toLocaleString()} × ${modalQty} = ₹${total.toLocaleString()}`;
}

// ------ Add To Cart Action ------
function addCurrentProductToCart() {
  if (!currentProduct) return;
  if (!currentProduct.available) {
    showToast('This item is currently unavailable', 'error');
    return;
  }

  const unitPrice = calculateCurrentItemUnitPrice();
  const size = getSelected('size-chips');
  const flavour = getSelected('flavour-chips');
  const egg = getSelected('egg-chips');
  const customMessage = document.getElementById('modal-custom')?.value.trim() || '';
  const preferredDate = document.getElementById('modal-date')?.value || '';
  const specialNotes = document.getElementById('modal-special')?.value.trim() || '';

  const item = {
    id: currentProduct.id,
    name: currentProduct.name,
    image: currentProduct.image,
    size: size,
    flavour: flavour,
    egg: egg,
    customMessage: customMessage,
    preferredDate: preferredDate,
    specialNotes: specialNotes,
    price: unitPrice,
    quantity: modalQty
  };

  addToCart(item);
  closeModal();
  showToast(`Added ${item.name} to cart!`, 'success');
}

// =============================================================
//  Persistent Cart System & Separate Cart Card
// =============================================================
function getCart() {
  try {
    const s = localStorage.getItem('hds_cart');
    if (s) return JSON.parse(s);
  } catch (e) { }
  return [];
}

function saveCart(cart) {
  try {
    localStorage.setItem('hds_cart', JSON.stringify(cart));
  } catch (e) { }
  updateCartBadge();
  renderCart();
  if (typeof renderAdminCartView === 'function') {
    renderAdminCartView();
  }
}

function updateCartBadge() {
  const cart = getCart();
  const count = cart.reduce((acc, i) => acc + (i.quantity || 1), 0);
  const total = cart.reduce((acc, i) => acc + (i.price * (i.quantity || 1)), 0);

  // Update admin page topbar and card counters if present
  document.querySelectorAll('#admin-topbar-cart-count, #admin-cart-nav-badge, #dash-cart-count').forEach(el => {
    el.textContent = count;
  });
  document.querySelectorAll('#admin-topbar-cart-total, #dash-cart-total').forEach(el => {
    el.textContent = `₹${total.toLocaleString()}`;
  });
  const dashBadge = document.getElementById('dash-cart-status-badge');
  if (dashBadge) {
    dashBadge.textContent = `${count} Item${count === 1 ? '' : 's'}`;
    dashBadge.className = count > 0 ? 'status-badge status-active' : 'status-badge status-inactive';
  }

  // Floating Quick Cart Card (only on non-admin pages)
  updateFloatingCartCard(count, total);

  // Update admin views if on admin page
  if (typeof renderAdminCartView === 'function') {
    renderAdminCartView();
  }
}

function updateFloatingCartCard(count, total) {
  // Prevent floating cart from appearing on admin dashboard
  const isAdmin = window.location.pathname.includes('admin') ||
    document.querySelector('.admin-container') !== null ||
    document.querySelector('.admin-topbar') !== null ||
    document.body.classList.contains('admin-page') ||
    document.getElementById('admin-clock') !== null;

  let card = document.getElementById('floating-cart-card');
  if (isAdmin) {
    if (card) {
      card.style.display = 'none';
      card.remove();
    }
    return;
  }

  if (!card) {
    card = document.createElement('div');
    card.id = 'floating-cart-card';
    card.className = 'floating-cart-card';
    card.onclick = openCart;
    document.body.appendChild(card);
  }

  if (count > 0) {
    card.style.display = 'flex';
    card.innerHTML = `
      <div class="floating-cart-badge"><img src="images/cart.svg"></div>
      <div class="floating-cart-text">
        <h5>${count} item${count > 1 ? 's' : ''} in Cart</h5>
        <p>Total: <strong>₹${total.toLocaleString()}</strong></p>
      </div>
      <div class="floating-cart-cta">View Cart</div>
    `;
  } else {
    card.style.display = 'none';
  }
}

function addToCart(newItem) {
  const cart = getCart();
  // Check if identical item exists
  const existingIdx = cart.findIndex(i =>
    i.id === newItem.id &&
    i.size === newItem.size &&
    i.flavour === newItem.flavour &&
    i.egg === newItem.egg &&
    i.customMessage === newItem.customMessage &&
    i.preferredDate === newItem.preferredDate
  );

  if (existingIdx > -1) {
    cart[existingIdx].quantity += newItem.quantity;
  } else {
    cart.push(newItem);
  }

  saveCart(cart);
}

function removeFromCart(idx) {
  const cart = getCart();
  if (idx >= 0 && idx < cart.length) {
    cart.splice(idx, 1);
    saveCart(cart);
  }
}

function updateCartItemQty(idx, delta) {
  const cart = getCart();
  if (idx >= 0 && idx < cart.length) {
    cart[idx].quantity = Math.max(1, cart[idx].quantity + delta);
    saveCart(cart);
  }
}

function openCart() {
  const overlay = document.getElementById('cart-overlay');
  const drawer = document.getElementById('cart-drawer');
  if (overlay && drawer) {
    renderCart();
    overlay.classList.add('open');
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeCart() {
  const overlay = document.getElementById('cart-overlay');
  const drawer = document.getElementById('cart-drawer');
  if (overlay && drawer) {
    overlay.classList.remove('open');
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function renderCart() {
  const container = document.getElementById('cart-items-container');
  const footer = document.getElementById('cart-footer');
  if (!container) return;

  const cart = getCart();

  if (!cart.length) {
    container.innerHTML = `
      <div class="cart-empty">
        <div class="cart-empty-icon"><img src="images/logo.jpg" style="border-radius: 50px;">  </div>
        <h3>Your Cart is Empty</h3>
        <p>Explore our delicious cakes, brownies and cupcakes to fill it up!</p>
        <button class="btn btn-primary btn-sm" onclick="closeCart(); window.location.href='menu.html'" style="margin-top:16px;">
          Browse Menu
        </button>
      </div>
    `;
    if (footer) footer.style.display = 'none';
    return;
  }

  if (footer) footer.style.display = '';

  let subtotal = 0;
  container.innerHTML = cart.map((item, idx) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    const metaParts = [];
    if (item.size) metaParts.push(item.size);
    if (item.flavour) metaParts.push(item.flavour);
    if (item.egg) metaParts.push(item.egg);
    if (item.preferredDate) metaParts.push(`Date: ${item.preferredDate}`);
    if (item.customMessage) metaParts.push(`"${item.customMessage}"`);

    return `
      <div class="cart-item-card">
        <img src="${item.image || 'images/hero.jpg'}" alt="${item.name}" class="cart-item-img" onerror="this.src='images/hero.jpg'" />
        <div class="cart-item-info">
          <h4 class="cart-item-title">${item.name}</h4>
          <div class="cart-item-meta">${metaParts.join(' · ')}</div>
          <div class="cart-item-price">₹${itemTotal.toLocaleString()} <span style="font-weight:400;font-size:.78rem;color:var(--c-text-muted)">(₹${item.price})</span></div>
          <div class="cart-item-controls">
            <div class="qty-stepper">
              <button class="qty-btn" onclick="updateCartItemQty(${idx}, -1)">−</button>
              <span class="qty-val">${item.quantity}</span>
              <button class="qty-btn" onclick="updateCartItemQty(${idx}, 1)">+</button>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${idx})">Remove</button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Delivery & Free delivery threshold (₹499)
  const freeThreshold = 499;
  const isFreeDelivery = subtotal >= freeThreshold;
  const deliveryFee = isFreeDelivery ? 0 : 50;
  const total = subtotal + deliveryFee;

  const promoCallout = document.getElementById('cart-promo-callout');
  if (promoCallout) {
    if (isFreeDelivery) {
      promoCallout.innerHTML = `<strong>Free Delivery unlocked!</strong> You qualify for zero delivery charge.`;
    } else {
      const needed = freeThreshold - subtotal;
      promoCallout.innerHTML = `Add <strong>₹${needed.toLocaleString()}</strong> more to unlock <strong>FREE Delivery</strong>!`;
    }
  }

  const subtotalEl = document.getElementById('cart-subtotal');
  if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString()}`;

  const deliveryEl = document.getElementById('cart-delivery');
  if (deliveryEl) deliveryEl.textContent = isFreeDelivery ? 'FREE' : `₹${deliveryFee}`;

  const totalEl = document.getElementById('cart-total');
  if (totalEl) totalEl.textContent = `₹${total.toLocaleString()}`;
}

// =============================================================
//  Checkout & Instant Order Creation
// =============================================================
function openCheckout() {
  const cart = getCart();
  if (!cart.length) {
    showToast('Your cart is empty!', 'error');
    return;
  }
  closeCart();

  let subtotal = 0;
  cart.forEach(i => subtotal += (i.price * i.quantity));
  const freeThreshold = 499;
  const deliveryFee = subtotal >= freeThreshold ? 0 : 50;
  const total = subtotal + deliveryFee;

  const summaryEl = document.getElementById('checkout-order-summary');
  if (summaryEl) {
    summaryEl.innerHTML = `
      <div style="background:var(--c-pink-subtle);border:1px solid var(--c-pink-border);border-radius:var(--radius-sm);padding:14px;margin-bottom:16px;">
        <div style="font-weight:600;color:var(--c-brown);margin-bottom:6px;">Order Summary (${cart.length} unique item${cart.length > 1 ? 's' : ''}):</div>
        ${cart.map(i => `<div style="display:flex;justify-content:space-between;font-size:.85rem;color:var(--c-text-soft);margin-bottom:3px;">
          <span>${i.quantity}x ${i.name} (${i.size || 'Regular'})</span>
          <span>₹${(i.price * i.quantity).toLocaleString()}</span>
        </div>`).join('')}
        <div style="border-top:1px dashed var(--c-border);margin-top:8px;padding-top:8px;display:flex;justify-content:space-between;font-weight:700;color:var(--c-brown);">
          <span>Total Payable:</span>
          <span>₹${total.toLocaleString()}</span>
        </div>
      </div>
    `;
  }

  const minDate = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('checkout-date');
  if (dateInput) {
    dateInput.min = minDate;
    if (!dateInput.value) dateInput.value = minDate;
  }

  // Pre-fill logged in user info if available
  const user = getCurrentUser();
  if (user) {
    const nameEl = document.getElementById('checkout-name');
    const phoneEl = document.getElementById('checkout-phone');
    const emailEl = document.getElementById('checkout-email');
    const addrEl = document.getElementById('checkout-address');

    if (nameEl && !nameEl.value) nameEl.value = user.name || '';
    if (phoneEl && !phoneEl.value) phoneEl.value = user.phone || '';
    if (emailEl && !emailEl.value) emailEl.value = user.email || '';
    if (addrEl && !addrEl.value) addrEl.value = user.address || '';
  }

  const modal = document.getElementById('checkout-modal');
  if (modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closeCheckout() {
  const modal = document.getElementById('checkout-modal');
  if (modal) modal.classList.add('hidden');
  document.body.style.overflow = '';
}

const pincodes = [
  "600008",
  "600007",
  "600010",
  "600031",
  "600006",
  "600034",
  "600002",
  "600003",
  "600014"
];

function submitOrder(e) {
  if (e) e.preventDefault();
  const cart = getCart();
  if (!cart.length) {
    showToast('Your cart is empty', 'error');
    return;
  }

  const name = document.getElementById('checkout-name')?.value.trim();
  const phone = document.getElementById('checkout-phone')?.value.trim();
  const email = document.getElementById('checkout-email')?.value.trim() || '';
  const deliveryType = document.querySelector('input[name="delivery-type"]:checked')?.value || 'delivery';
  const address = document.getElementById('checkout-address')?.value.trim() || (deliveryType === 'pickup' ? 'Direct Studio Pickup' : '');
  const preferredDate = document.getElementById('checkout-date')?.value || '';
  const timeSlot = document.getElementById('checkout-time')?.value || 'Afternoon (1 PM - 4 PM)';
  const paymentMethod = document.getElementById('checkout-payment')?.value || 'UPI';
  const notes = document.getElementById('checkout-notes')?.value.trim() || '';
  const pin = document.getElementById('checkout-pin')?.value.trim() || '';
  if (!name || !phone) {
    showToast('Please enter your Name and Mobile Number', 'error');
    return;
  }

  if (deliveryType === 'delivery' && !address) {
    showToast('Please enter your delivery address', 'error');
    return;
  }

  if (pin === "") {
    showToast('Please enter a Pincode', 'error');
    return;
  }

  if (!/^\d{6}$/.test(pin)) {
    showToast('Please enter a valid 6-digit Pincode', 'error');
    return;
  }

  if (pin < 600001 || pin > 600118) {
    showToast('Please enter a  valid Chennai Pincode', 'error');
    return;
  }

  if (!pincodes.includes(pin)) {
    showToast(`Sorry, we are not available at ${pin}`, 'error');
    return;
  }

  let subtotal = 0;
  cart.forEach(i => subtotal += (i.price * i.quantity));
  const deliveryFee = subtotal >= 499 ? 0 : 50;
  const total = subtotal + deliveryFee;

  const now = new Date();
  const orderId = `ORD-${now.getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
  const dateStr = now.toISOString().replace('T', ' ').substring(0, 16);

  const orderData = {
    id: orderId,
    date: dateStr,
    customer: {
      name,
      phone,
      email,
      address,
      deliveryType,
      preferredDate,
      timeSlot
    },
    items: cart,
    subtotal,
    deliveryFee,
    discount: 0,
    total,
    paymentMethod,
    status: 'Pending',
    notes
  };

  // If user is logged in, sync latest address
  const currUser = getCurrentUser();
  if (currUser && currUser.phone === phone) {
    currUser.address = address;
    setCurrentUser(currUser);
  }

  // Add order to orders repository
  if (typeof addOrder === 'function') {
    addOrder(orderData);
  }

  // Clear cart
  saveCart([]);
  closeCheckout();

  // Show celebratory success modal
  showOrderSuccess(orderData);
}

function showOrderSuccess(order) {
  const successModal = document.getElementById('order-success-modal');
  const detailsEl = document.getElementById('order-success-details');
  if (detailsEl) {
    detailsEl.innerHTML = `
      <div style="font-size:1.15rem;font-weight:700;color:var(--c-brown);margin-bottom:8px;">
        Order ID: <span style="color:var(--c-gold);">${order.id}</span>
      </div>
      <p style="color:var(--c-text-soft);font-size:.9rem;margin-bottom:18px;">
        Thank you, <strong>${order.customer.name}</strong>! Your order has been placed successfully and sent to our kitchen.
      </p>
      <div style="background:var(--c-cream);border:1px solid var(--c-border);border-radius:var(--radius-sm);padding:14px;text-align:left;font-size:.85rem;margin-bottom:16px;">
        <div><strong>Delivery Type:</strong> ${order.customer.deliveryType === 'delivery' ? 'Home Delivery' : 'Pickup at Studio'}</div>
        <div><strong>Preferred Date:</strong> ${order.customer.preferredDate || 'Earliest available'} (${order.customer.timeSlot})</div>
        <div><strong>Payment:</strong> ${order.paymentMethod}</div>
        <div style="margin-top:6px;font-weight:700;color:var(--c-brown);">Total Amount: ₹${order.total.toLocaleString()}</div>
      </div>
      <button class="btn btn-outline btn-block" onclick="closeOrderSuccess(); setTimeout(() => { ensureTrackOrderModal(); openTrackOrderModal('${order.id}'); }, 80);" style="margin-bottom:12px;display:flex;align-items:center;justify-content:center;gap:8px;">
        Track This Order Live
        <span style="display:inline-block;width:7px;height:7px;background:#10B981;border-radius:50%;box-shadow:0 0 0 2px rgba(16,185,129,0.3);animation:pulse-green 2s infinite;"></span>
      </button>
      <p style="font-size:.82rem;color:var(--c-text-muted);margin-bottom:20px;">
        Our head baker will confirm your order preparation shortly. For special queries, feel free to chat with us anytime via WhatsApp at the bottom of the page.
      </p>
    `;
  }

  if (successModal) {
    successModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closeOrderSuccess() {
  const successModal = document.getElementById('order-success-modal');
  if (successModal) successModal.classList.add('hidden');
  document.body.style.overflow = '';
}

// =============================================================
//  Gallery Lightbox
// =============================================================
let galleryItems = [];
let currentGalleryIdx = 0;

function openLightbox(items, idx) {
  galleryItems = items;
  currentGalleryIdx = idx;
  renderLightbox();
  const lb = document.getElementById('lightbox');
  if (lb) {
    lb.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  if (lb) lb.classList.add('hidden');
  document.body.style.overflow = '';
}

function renderLightbox() {
  const item = galleryItems[currentGalleryIdx];
  if (!item) return;
  const img = document.getElementById('lb-img');
  const title = document.getElementById('lb-title');
  const desc = document.getElementById('lb-desc');
  if (img) { img.src = item.image; img.alt = item.title; }
  if (title) title.textContent = item.title;
  if (desc) desc.textContent = `${item.occasion ? item.occasion + ' · ' : ''}${item.description}`;
}

function lightboxNav(dir) {
  currentGalleryIdx = (currentGalleryIdx + dir + galleryItems.length) % galleryItems.length;
  renderLightbox();
}

document.addEventListener('keydown', e => {
  const lb = document.getElementById('lightbox');
  if (!lb || lb.classList.contains('hidden')) return;
  if (e.key === 'ArrowLeft') lightboxNav(-1);
  if (e.key === 'ArrowRight') lightboxNav(1);
  if (e.key === 'Escape') closeLightbox();
});

// =============================================================
//  Shared DOM Initializer
// =============================================================
document.addEventListener('DOMContentLoaded', () => {
  ensureModalsExist();
  initRunningOfferBar();
  updateCartBadge();
  updateUserAuthUI();
});

document.querySelectorAll('input[type="number"]').forEach(input => {
  input.addEventListener('wheel', function (e) {
    e.preventDefault();
  }, { passive: false });
});
