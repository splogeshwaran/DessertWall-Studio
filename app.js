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

  const html = buildItemsHtml(activeOffers) + buildItemsHtml(activeOffers) + buildItemsHtml(activeOffers) + buildItemsHtml(activeOffers) + buildItemsHtml(activeOffers);
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
    address: "Flat 402, Green Glen Layout, Bellandur, Chennai 560103",
    createdAt: "2026-01-15T10:00:00.000Z"
  },
  {
    id: "usr_2",
    name: "Arjun Mehta",
    phone: "9741288990",
    email: "arjun.m@example.com",
    password: "password123",
    address: "100ft Road, HAL 2nd Stage, Indiranagar, Chennai 560038",
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
        Sign In
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
                <textarea id="signup-address" placeholder="Flat, Building, Area, Landmark, Chennai..." rows="2" autocomplete="street-address"></textarea>
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
              <textarea id="profile-address" rows="2" placeholder="Apartment / Villa, Street, Locality, Chennai..."></textarea>
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
  showToast(`Account created successfully! Welcome, ${name}!`, 'success');
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
          <button class="btn btn-primary btn-sm" onclick="closeMyOrdersModal(); window.location.href='menu.html'" style="margin-top:14px;">Browse Desserts</button>
        </div>
      `;
    } else {
      container.innerHTML = userOrders.map(o => {
        const statusClass = `status-${(o.status || 'Pending').toLowerCase().replace(/\s+/g, '-')}`;
        const canCancel = !['Cancelled', 'Completed', 'Delivered', 'Preparing', 'Ready', 'Out for Delivery', 'Out'].includes(o.status);
        const isPreparing = ['Preparing', 'Ready', 'Out for Delivery', 'Out'].includes(o.status);
        const cancelledInfo = o.status === 'Cancelled' ? `
          <div style="background:#FFF5F5;border:1px solid #FFCDD2;border-radius:6px;padding:8px 10px;margin-top:8px;font-size:.78rem;">
            <span style="color:#C62828;font-weight:700;">Cancelled</span>
            ${o.cancelledAt ? `<div style="color:#9E1515;margin-top:2px;">${o.cancelledAt}</div>` : ''}
            ${o.cancelReason ? `<div style="color:#7F1D1D;margin-top:2px;font-style:italic;">"${o.cancelReason}"</div>` : ''}
          </div>` : '';
        const preparingNotice = isPreparing ? `
          <div style="background:#FFF8E1;border:1px solid #FFE082;border-radius:6px;padding:8px 10px;margin-top:8px;font-size:.78rem;display:flex;align-items:center;gap:6px;">
            <span style="color:#795548;font-weight:600;">Your order is already being prepared — cancellation is no longer possible.</span>
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
            ${preparingNotice}
            <div style="display:flex;justify-content:space-between;align-items:center;border-top:1px dashed var(--c-border);padding-top:8px;margin-top:8px;font-size:.85rem;flex-wrap:wrap;gap:8px;">
              <span>Mode: <strong>${(o.customer && o.customer.deliveryType === 'delivery') ? 'Home Delivery' : 'Studio Pickup'}</strong></span>
              <span style="font-weight:700;color:var(--c-brown);font-size:1rem;">Total: ₹${(o.total || 0).toLocaleString()}</span>
            </div>
            <div style="display:flex;gap:8px;margin-top:10px;flex-wrap:wrap;">
              <button class="btn btn-primary btn-sm" onclick="trackOrderFromMyOrders('${o.id}')" style="flex:1;font-size:.82rem;display:inline-flex;align-items:center;justify-content:center;gap:6px;">Track Order
              </button>
              ${canCancel ? `<button class="btn-outline-danger" onclick="promptCancelOrder('${o.id}')" style="flex:1;font-size:.8rem;">Cancel Order</button>` : ''}
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
  { key: 'Pending', label: 'Order Placed', desc: 'Your order has been received and is awaiting confirmation.' },
  { key: 'Confirmed', label: 'Order Confirmed', desc: 'Our baker has confirmed your order.' },
  { key: 'Preparing', label: 'Being Prepared', desc: 'Your desserts are being freshly baked and decorated.' },
  { key: 'Ready', label: 'Ready for Dispatch', desc: 'Packed and ready for delivery or pickup.' },
  { key: 'Out for Delivery', label: 'Out for Delivery', desc: 'On the way to your address right now!' },
  { key: 'Delivered', label: 'Delivered!', desc: 'Order delivered. Thank you for choosing DessertWall Studio!' }
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
          <div style="font-size:.82rem;color:var(--c-text-muted);">${o.date} &nbsp;|&nbsp; ${o.customer.name} &nbsp;|&nbsp; ₹${o.total.toLocaleString()}</div>
        </div>`;
  }).join('')}`;
}

function renderTrackOrderDetails(order) {
  const resultsEl = document.getElementById('track-order-results');
  if (!resultsEl || !order) return;

  const statusClass = `status-${order.status.toLowerCase().replace(/\s+/g, '-')}`;
  const isCancelled = order.status === 'Cancelled';
  const isDelivered = order.status === 'Delivered' || order.status === 'Completed';
  const isPreparing = ['Preparing', 'Ready', 'Out for Delivery', 'Out'].includes(order.status);
  const canCancel = !isCancelled && !isDelivered && !isPreparing;

  // Build stepper
  const currentStepIdx = ORDER_STATUS_STEPS.findIndex(s =>
    s.key === order.status ||
    (s.key === 'Delivered' && (order.status === 'Delivered' || order.status === 'Completed')) ||
    (s.key === 'Out for Delivery' && order.status === 'Out')
  );
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
    else if (idx === currentStepIdx) {
      // Mark as 'delivered' (full green) when the Delivered step is active
      nodeClass = step.key === 'Delivered' ? 'active delivered' : 'active';
    }
    return `
            <div class="step-node ${nodeClass}">
              <div class="step-icon-wrap"></div>
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
      <div style="font-size:.88rem;font-weight:700;color:var(--c-brown);margin-bottom:8px;font-family:'Playfair Display',serif;">Items Ordered</div>
      ${itemsList}
    </div>

    ${canCancel ? `
    <div style="display:flex;justify-content:flex-end;margin-top:4px;">
      <button class="btn-outline-danger" onclick="promptCancelOrder('${order.id}')" id="btn-cancel-${order.id}">
        Cancel This Order
      </button>
    </div>` : ''}

    ${isPreparing ? `
    <div style="background:#FFF8E1;border:1px solid #FFE082;border-radius:8px;padding:12px 14px;margin-top:8px;display:flex;align-items:center;gap:8px;">
      <div>
        <div style="font-size:.84rem;font-weight:700;color:#795548;">Preparation in Progress</div>
        <div style="font-size:.78rem;color:#8D6E63;margin-top:2px;">Our bakers are already working on your order — cancellation is no longer available at this stage.</div>
      </div>
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
        <div class="product-price">Starting from: <span style="color:var(--c-gold);font-size:19px"> ₹${p.price}</span></div>
        <div class="product-actions">
          <button class="btn ${p.available ? 'btn-primary' : 'btn-outline'} btn-sm btn-block" onclick="openProductModal('${p.id}')">
            ${p.available ? 'Order Now' : 'Order Now'}
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

  const onbtn = document.getElementById("modal-order-now-btn");
  if (onbtn) {
    onbtn.disabled = !p.available;
    onbtn.textContent = p.available ? 'Order Now ' : 'Currently Unavailable';
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

// Direct order item tracking & Instant Promo Applier (for single product checkout via "Order Now")
let directOrderItem = null;
let instantPromoCode = null;

function getActiveCheckoutItems() {
  if (directOrderItem) {
    return [directOrderItem];
  }
  return getCart();
}

// -------------------------------------------------------------
//  PROMO APPLIER 1: Instant Order Promo Applier (for Instant Order)
// -------------------------------------------------------------
function applyInstantPromoCode(customCode) {
  let code = '';
  if (typeof customCode === 'string' && customCode.trim()) {
    code = customCode.trim().toUpperCase();
  } else {
    const input = document.getElementById('checkout-promo-input');
    if (input) code = input.value.trim().toUpperCase();
  }

  const feedbackEl = document.getElementById('checkout-promo-msg');

  if (!code) {
    showToast('Please enter a coupon code.', 'error');
    if (feedbackEl) {
      feedbackEl.textContent = 'Please enter a coupon code.';
      feedbackEl.className = 'checkout-coupon-feedback error';
    }
    return;
  }

  if (!PROMO_CODES[code]) {
    showToast(`Invalid coupon code "${code}". Please try again.`, 'error');
    if (feedbackEl) {
      feedbackEl.textContent = `"${code}" is not a valid coupon. Try SWEET15, BROWNIE10, SAVE50, or WELCOME.`;
      feedbackEl.className = 'checkout-coupon-feedback error';
    }
    return;
  }

  const offer = PROMO_CODES[code];
  const items = getActiveCheckoutItems();
  const subtotal = items.reduce((sum, i) => sum + (i.price * (i.quantity || 1)), 0);
  if (offer.minOrder && subtotal < offer.minOrder) {
    const msg = `Coupon ${code} requires a minimum order of ₹${offer.minOrder.toLocaleString()}.`;
    showToast(msg, 'error');
    if (feedbackEl) {
      feedbackEl.textContent = `${msg} (Your item total is ₹${subtotal.toLocaleString()})`;
      feedbackEl.className = 'checkout-coupon-feedback warning';
    }
    return;
  }

  instantPromoCode = code;
  showToast(`Coupon ${code} applied to Instant Order! ${offer.label}`, 'success');
  if (typeof renderCheckoutSummary === 'function') {
    renderCheckoutSummary();
  }
}

// Alias for backwards compatibility with user's function
const applyPromoCodeon = applyInstantPromoCode;

function removeInstantPromoCode() {
  instantPromoCode = null;
  showToast('Coupon removed from Instant Order.', 'info');
  if (typeof renderCheckoutSummary === 'function') {
    renderCheckoutSummary();
  }
}

function orderNow() {
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

  // Set ONLY this one product for direct instant checkout
  directOrderItem = item;
  instantPromoCode = null; // Fresh instant promo state for this instant order

  // Close the product modal
  closeModal();

  // Pre-fill preferred date into checkout modal if chosen
  if (preferredDate) {
    const checkoutDate = document.getElementById('checkout-date');
    if (checkoutDate) checkoutDate.value = preferredDate;
  }

  // Pre-fill cake custom message & special instructions into checkout notes
  const checkoutNotes = document.getElementById('checkout-notes');
  if (checkoutNotes) {
    const notesParts = [];
    if (customMessage) notesParts.push(`Cake Message: "${customMessage}"`);
    if (specialNotes) notesParts.push(`Special Notes: ${specialNotes}`);
    if (notesParts.length) {
      const existing = checkoutNotes.value.trim();
      checkoutNotes.value = existing ? `${existing}\n${notesParts.join(' | ')}` : notesParts.join(' | ');
    }
  }

  // Open checkout for ONLY this one customized product (Instant Checkout mode)
  openCheckout();
  showToast(`Ordering ${item.name} (${item.quantity} ${item.quantity > 1 ? 'items' : 'item'})!`, 'success');
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
          Browse Desserts
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

  // Delivery & Free delivery threshold (₹1499)
  const freeThreshold = 1499;
  const isFreeDelivery = subtotal >= freeThreshold;
  const deliveryFee = isFreeDelivery ? 0 : 60;

  // Apply promo/offer discount
  const appliedOffer = getAppliedOffer();
  let discount = 0;
  if (appliedOffer && subtotal > 0) {
    if (appliedOffer.discountType === 'percent') {
      if (!appliedOffer.minOrder || subtotal >= appliedOffer.minOrder) {
        discount = Math.round(subtotal * appliedOffer.discountValue / 100);
      }
    } else if (appliedOffer.discountType === 'flat') {
      if (!appliedOffer.minOrder || subtotal >= appliedOffer.minOrder) {
        discount = Math.min(appliedOffer.discountValue, subtotal);
      }
    }
  }

  const total = subtotal + deliveryFee - discount;

  const promoCallout = document.getElementById('cart-promo-callout');
  if (promoCallout) {
    let promoHtml = '';
    if (isFreeDelivery) {
      promoHtml += `<div style="color:#2E7D32;font-weight:600;">Free Delivery unlocked! You qualify for zero delivery charge.</div>`;
    } else {
      const needed = freeThreshold - subtotal;
      promoHtml += `<div>Add <strong>₹${needed.toLocaleString()}</strong> more to unlock <strong>FREE Delivery</strong>!</div>`;
    }
    // Promo code input row
    const appliedCode = localStorage.getItem('hds_promo_code') || '';
    if (appliedOffer && discount > 0) {
      promoHtml += `
        <div style="margin-top:8px;display:flex;align-items:center;gap:8px;">
          <div style="background:#E8F5E9;border:1px solid #A5D6A7;border-radius:6px;padding:6px 12px;font-size:.82rem;font-weight:600;color:#2E7D32;flex:1;">
            Code <strong>${appliedCode.toUpperCase()}</strong> applied — You save ₹${discount.toLocaleString()}!
          </div>
          <button onclick="removePromoCode()" style="background:transparent;border:1px solid var(--c-border);border-radius:6px;padding:6px 10px;font-size:.8rem;color:var(--c-text-muted);cursor:pointer;">Remove</button>
        </div>`;
    } else {
      promoHtml += `
        <div style="margin-top:8px;display:flex;gap:6px;">
          <input type="text" id="promo-code-input" placeholder="Enter promo code (e.g. SWEET15)" value="${appliedCode}" style="flex:1;padding:7px 12px;border:1px solid var(--c-border);border-radius:6px;font-size:.82rem;font-family:'Inter',sans-serif;background:#fff;text-transform: uppercase;" onkeydown="if(event.key==='Enter')applyPromoCode()" />
          <button onclick="applyPromoCode()" style="background:var(--c-gold);color:#fff;border:none;border-radius:6px;padding:7px 14px;font-size:.82rem;font-weight:600;cursor:pointer;">Apply</button>
        </div>`;
    }
    promoCallout.innerHTML = promoHtml;
  }

  const subtotalEl = document.getElementById('cart-subtotal');
  if (subtotalEl) subtotalEl.textContent = `₹${subtotal.toLocaleString()}`;

  const discountRow = document.getElementById('cart-discount-row');
  const discountEl = document.getElementById('cart-discount');
  if (discountRow && discountEl) {
    if (discount > 0) {
      discountRow.style.display = '';
      discountEl.textContent = `-₹${discount.toLocaleString()}`;
    } else {
      discountRow.style.display = 'none';
    }
  }

  const deliveryEl = document.getElementById('cart-delivery');
  if (deliveryEl) deliveryEl.textContent = isFreeDelivery ? 'FREE' : `₹${deliveryFee}`;

  const totalEl = document.getElementById('cart-total');
  if (totalEl) totalEl.textContent = `₹${total.toLocaleString()}`;

}

// =============================================================
//  Checkout & Instant Order Creation
// =============================================================
function renderCheckoutSummary() {
  const summaryEl = document.getElementById('checkout-order-summary');
  if (!summaryEl) return;

  const isInstantOrder = !!directOrderItem;
  const cart = getActiveCheckoutItems();
  if (!cart.length) {
    summaryEl.innerHTML = `
      <div style="text-align:center;padding:24px 16px;color:var(--c-text-muted);">
        <div style="font-size:2rem;margin-bottom:8px;"></div>
        <p style="font-size:.95rem;font-weight:600;color:var(--c-brown);margin-bottom:4px;">Your cart is empty</p>
        <p style="font-size:.82rem;">Please add delicious desserts from our menu to continue.</p>
      </div>`;
    return;
  }

  let subtotal = 0;
  let totalItems = 0;
  cart.forEach(i => {
    const qty = i.quantity || 1;
    subtotal += (i.price * qty);
    totalItems += qty;
  });

  const deliveryTypeEl = document.querySelector('input[name="delivery-type"]:checked');
  const isPickup = deliveryTypeEl && deliveryTypeEl.value === 'pickup';
  const freeThreshold = 1499;
  const isFreeDelivery = isPickup || subtotal >= freeThreshold;
  const deliveryFee = isFreeDelivery ? 0 : 60;

  // --- Determine promo source based on checkout mode ---
  let discount = 0;
  let activePromoCode = '';
  let activeOffer = null;

  if (isInstantOrder) {
    // Instant Order: use instantPromoCode state variable
    activePromoCode = instantPromoCode || '';
    activeOffer = activePromoCode && PROMO_CODES[activePromoCode] ? PROMO_CODES[activePromoCode] : null;
  } else {
    // Cart Order: use the cart-level promo from localStorage
    activePromoCode = (localStorage.getItem('hds_promo_code') || '').toUpperCase();
    activeOffer = activePromoCode && PROMO_CODES[activePromoCode] ? PROMO_CODES[activePromoCode] : null;
  }

  if (activeOffer && subtotal > 0) {
    if (activeOffer.discountType === 'percent') {
      if (!activeOffer.minOrder || subtotal >= activeOffer.minOrder) {
        discount = Math.round(subtotal * activeOffer.discountValue / 100);
      }
    } else if (activeOffer.discountType === 'flat') {
      if (!activeOffer.minOrder || subtotal >= activeOffer.minOrder) {
        discount = Math.min(activeOffer.discountValue, subtotal);
      }
    }
  }

  const total = Math.max(0, subtotal + deliveryFee - discount);

  // --- Build the promo section based on mode ---
  let promoSectionHtml = '';
  if (isInstantOrder) {
    // Instant Order: show promo input with its own apply/remove functions
    if (activeOffer) {
      promoSectionHtml = `
        <div class="checkout-coupon-box">
          <div class="checkout-coupon-header">
            <span class="checkout-coupon-title">Coupon Code</span>
            <span style="font-size:.78rem;color:#2E7D32;font-weight:600;">Active</span>
          </div>
          <div class="checkout-coupon-applied-card">
            <div class="coupon-applied-left">
              <span class="coupon-applied-badge">${activePromoCode}</span>
              <span class="coupon-applied-label">${activeOffer.label}</span>
            </div>
            <button type="button" class="checkout-coupon-remove-btn" onclick="removeInstantPromoCode()">
              Remove
            </button>
          </div>
        </div>`;
    } else {
      promoSectionHtml = `
        <div class="checkout-coupon-box">
          <div class="checkout-coupon-header">
            <span class="checkout-coupon-title">Apply Coupon Code</span>
          </div>
          <div class="checkout-coupon-input-row">
            <input
              type="text"
              id="checkout-promo-input"
              class="checkout-coupon-input"
              placeholder="Type coupon code (e.g. SWEET15)"
              autocomplete="off"
              onkeydown="if(event.key==='Enter'){event.preventDefault();applyInstantPromoCode();}"
            />
            <button type="button" class="checkout-coupon-apply-btn" onclick="applyInstantPromoCode()">
              Apply
            </button>
          </div>
          <div id="checkout-promo-msg" class="checkout-coupon-feedback"></div>
        </div>`;
    }
  }

  summaryEl.innerHTML = `
      <div class="checkout-summary-title">
        <span>Order Summary</span>
        <span class="checkout-summary-count">${totalItems} item${totalItems > 1 ? 's' : ''}</span>
      </div>

      <div class="checkout-items-list">
        ${cart.map(i => `
          <div class="checkout-item-line">
            <div class="checkout-item-details">
              <span class="checkout-item-qty">${i.quantity}×</span>
              <strong class="checkout-item-name">${i.name}</strong>
              ${(i.size || i.flavour || i.egg) ? `<span class="checkout-item-variant">(${[i.size, i.flavour, i.egg].filter(Boolean).join(', ')})</span>` : ''}
              ${i.customMessage ? `<div class="checkout-item-msg">"${i.customMessage}"</div>` : ''}
            </div>
            <div class="checkout-item-price">₹${(i.price * (i.quantity || 1)).toLocaleString()}</div>
          </div>
        `).join('')}
      </div>

      <div class="checkout-breakdown">
        <div class="checkout-breakdown-row">
          <span>Subtotal (${totalItems} items)</span>
          <span>₹${subtotal.toLocaleString()}</span>
        </div>
        <div class="checkout-breakdown-row">
          <span>
            Delivery Fee
            ${isPickup ? '<span class="checkout-badge-pickup">Direct Studio Pickup</span>' : (isFreeDelivery ? '<span class="checkout-badge-free">FREE Delivery Unlocked</span>' : '')}
          </span>
          <span style="${isFreeDelivery ? 'color:#2E7D32;font-weight:700;' : ''}">${isFreeDelivery ? 'FREE' : `₹${deliveryFee}`}</span>
        </div>
        ${discount > 0 ? `
          <div class="checkout-breakdown-row checkout-discount-row">
            <span>Coupon Discount (${activePromoCode})</span>
            <span style="color:#2E7D32;font-weight:700;">-₹${discount.toLocaleString()}</span>
          </div>
        ` : ''}
      </div>

      ${promoSectionHtml}

      <div class="checkout-total-row">
        <span>Total Payable:</span>
        <span class="checkout-total-val">₹${total.toLocaleString()}</span>
      </div>
  `;
}

function openCheckout() {
  const cart = getActiveCheckoutItems();
  if (!cart.length) {
    showToast('Your cart is empty!', 'error');
    return;
  }
  // Only close the cart drawer when checking out from cart (not from Order Now)
  if (!directOrderItem) closeCart();

  // Render the real-time order summary with workable coupon typer
  renderCheckoutSummary();

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

  // Wire up delivery type change to dynamically update address fields and delivery fee
  document.querySelectorAll('input[name="delivery-type"]').forEach(radio => {
    radio.onchange = function () {
      const isPick = this.value === 'pickup';
      const addrWrap = document.getElementById('checkout-addr-wrap');
      const pinWrap = document.getElementById('checkout-pincode');
      const pinInput = document.getElementById('checkout-pin');

      if (addrWrap) addrWrap.style.display = isPick ? 'none' : 'block';
      if (pinWrap) pinWrap.style.display = isPick ? 'none' : 'block';
      if (pinInput) pinInput.required = !isPick;

      renderCheckoutSummary();
    };
  });

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
  // Clear the direct order item so future cart checkouts work normally
  directOrderItem = null;
}

function submitOrder(e) {
  if (e) e.preventDefault();
  const cart = getActiveCheckoutItems();
  if (!cart.length) {
    showToast('Your cart is empty', 'error');
    return;
  }

  const name = document.getElementById('checkout-name')?.value.trim();
  const phone = document.getElementById('checkout-phone')?.value.trim();
  const email = document.getElementById('checkout-email')?.value.trim() || '';
  const deliveryType = document.querySelector('input[name="delivery-type"]:checked')?.value || 'delivery';
  const isPickup = deliveryType === 'pickup';
  const address = isPickup ? 'Direct Studio Pickup' : (document.getElementById('checkout-address')?.value.trim() || '');
  const preferredDate = document.getElementById('checkout-date')?.value || '';
  const timeSlot = document.getElementById('checkout-time')?.value || '1 PM - 4 PM';
  const paymentMethod = document.getElementById('checkout-payment')?.value || 'UPI';
  const notes = document.getElementById('checkout-notes')?.value.trim() || '';
  const pin = document.getElementById('checkout-pin')?.value.trim() || '';

  if (!name || !phone) {
    showToast('Please enter your Name and Mobile Number', 'error');
    return;
  }

  if (!isPickup) {
    if (!address) {
      showToast('Please enter your delivery address', 'error');
      return;
    }
    if (!pin) {
      showToast('Please enter a Pincode', 'error');
      return;
    }
    if (!/^\d{6}$/.test(pin)) {
      showToast('Please enter a valid 6-digit Pincode', 'error');
      return;
    }
    const pinNum = parseInt(pin, 10);
    if (pinNum < 600001 || pinNum > 600130) {
      showToast('We deliver across Chennai pincodes (600001 - 600130). For other areas, select Direct Studio Pickup.', 'error');
      return;
    }
  }

  let subtotal = 0;
  cart.forEach(i => subtotal += (i.price * (i.quantity || 1)));
  const deliveryFee = (deliveryType === 'pickup' || subtotal >= 1499) ? 0 : 60;

  // Determine promo source: instant orders use instantPromoCode, cart orders use localStorage
  const isInstantOrderSubmit = !!directOrderItem;
  let appliedCode = '';
  let appliedOffer = null;
  if (isInstantOrderSubmit) {
    appliedCode = instantPromoCode || '';
    appliedOffer = appliedCode && PROMO_CODES[appliedCode] ? PROMO_CODES[appliedCode] : null;
  } else {
    appliedCode = (localStorage.getItem('hds_promo_code') || '').toUpperCase();
    appliedOffer = appliedCode && PROMO_CODES[appliedCode] ? PROMO_CODES[appliedCode] : null;
  }
  let discount = 0;
  if (appliedOffer && subtotal > 0) {
    if (appliedOffer.discountType === 'percent') {
      if (!appliedOffer.minOrder || subtotal >= appliedOffer.minOrder) {
        discount = Math.round(subtotal * appliedOffer.discountValue / 100);
      }
    } else if (appliedOffer.discountType === 'flat') {
      if (!appliedOffer.minOrder || subtotal >= appliedOffer.minOrder) {
        discount = Math.min(appliedOffer.discountValue, subtotal);
      }
    }
  }
  const total = Math.max(0, subtotal + deliveryFee - discount);

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
    isDirectOrder: !!directOrderItem,
    subtotal,
    deliveryFee,
    discount,
    promoCode: appliedCode || null,
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

  // Clear cart only when it was a full cart checkout (not a direct Order Now)
  if (!directOrderItem) {
    saveCart([]);
    localStorage.removeItem('hds_promo_code'); // only clear cart promo on cart checkout
  } else {
    instantPromoCode = null; // clear instant promo after instant order completes
  }
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
        ${order.discount > 0 ? `<div style="color:#2E7D32;"><strong>Coupon Discount:</strong> ${order.promoCode ? order.promoCode + ' ' : ''}(-₹${order.discount.toLocaleString()})</div>` : ''}
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
//  Promo Code / Offer Application System
// =============================================================
const PROMO_CODES = {
  'SWEET15': { discountType: 'percent', discountValue: 15, minOrder: 1000, label: '15% OFF on orders above ₹1,000' },
  'BROWNIE10': { discountType: 'percent', discountValue: 10, minOrder: 0, label: '10% OFF on any order' },
  'SAVE50': { discountType: 'flat', discountValue: 50, minOrder: 499, label: '₹50 OFF on orders above ₹499' },
  'WELCOME': { discountType: 'percent', discountValue: 5, minOrder: 0, label: '5% OFF — Welcome offer for new customers' },
};

function getAppliedOffer() {
  const code = (localStorage.getItem('hds_promo_code') || '').toUpperCase();
  return code && PROMO_CODES[code] ? { ...PROMO_CODES[code], code } : null;
}

function applyPromoCode(customCode) {
  let code = '';
  if (typeof customCode === 'string' && customCode.trim()) {
    code = customCode.trim().toUpperCase();
  } else {
    const input = document.getElementById('promo-code-input');
    if (input) code = input.value.trim().toUpperCase();
  }

  const feedbackEl = document.getElementById('checkout-promo-msg');

  if (!code) {
    showToast('Please enter a coupon code.', 'error');
    if (feedbackEl) {
      feedbackEl.textContent = 'Please enter a coupon code.';
      feedbackEl.className = 'checkout-coupon-feedback error';
    }
    return;
  }

  if (!PROMO_CODES[code]) {
    showToast(`Invalid coupon code "${code}". Please try again.`, 'error');
    if (feedbackEl) {
      feedbackEl.textContent = `"${code}" is not a valid coupon. Try SWEET15, BROWNIE10, SAVE50, or WELCOME.`;
      feedbackEl.className = 'checkout-coupon-feedback error';
    }
    return;
  }

  const offer = PROMO_CODES[code];
  const cart = getCart();
  const subtotal = cart.reduce((sum, i) => sum + (i.price * (i.quantity || 1)), 0);
  if (offer.minOrder && subtotal < offer.minOrder) {
    const msg = `Coupon ${code} requires a minimum order of ₹${offer.minOrder.toLocaleString()}.`;
    showToast(msg, 'error');
    if (feedbackEl) {
      feedbackEl.textContent = `${msg} (Your subtotal is ₹${subtotal.toLocaleString()})`;
      feedbackEl.className = 'checkout-coupon-feedback warning';
    }
    return;
  }

  const promoEl = document.getElementById('cart-promocode');
  if (promoEl) {
    if (offer) {
      promoEl.textContent = offer.code;
    } else {
      promoEl.textContent = "No Promo Code Applied";
    }
  }

  const discEl = document.getElementById('cart-disc');
  if (discEl) {
    if (discount > 0) {
      discEl.textContent = `-₹${discount.toLocaleString()}`;
    } else {
      discEl.textContent = "";
    }
  }

  localStorage.setItem('hds_promo_code', code);
  showToast(`Coupon ${code} applied! ${offer.label}`, 'success');
  renderCart();
  if (typeof renderCheckoutSummary === 'function') {
    renderCheckoutSummary();
  }
}

function removePromoCode() {
  localStorage.removeItem('hds_promo_code');
  showToast('Coupon removed.', 'info');
  renderCart();
  if (typeof renderCheckoutSummary === 'function') {
    renderCheckoutSummary();
  }
}

// =============================================================
//  Customer Review Submission System
// =============================================================
function openReviewModal() {
  const user = getCurrentUser();
  ensureReviewModal();
  const modal = document.getElementById('review-modal');
  if (!modal) return;
  // Pre-fill name if logged in
  const nameEl = document.getElementById('review-name');
  if (nameEl && user) nameEl.value = user.name || '';
  // Reset star rating display
  const ratingInput = document.getElementById('review-rating-value');
  if (ratingInput) ratingInput.value = '0';
  document.querySelectorAll('.review-star-btn').forEach(btn => btn.classList.remove('active'));
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeReviewModal() {
  const modal = document.getElementById('review-modal');
  if (modal) modal.classList.add('hidden');
  document.body.style.overflow = '';
}

function setReviewStarRating(rating) {
  document.querySelectorAll('.review-star-btn').forEach((btn, idx) => {
    btn.classList.toggle('active', idx < rating);
    btn.setAttribute('data-selected', idx < rating ? 'true' : 'false');
  });
  const ratingInput = document.getElementById('review-rating-value');
  if (ratingInput) ratingInput.value = rating;
}

function submitCustomerReview(e) {
  if (e) e.preventDefault();
  const name = document.getElementById('review-name')?.value.trim();
  const review = document.getElementById('review-text')?.value.trim();
  const rating = parseInt(document.getElementById('review-rating-value')?.value || '0');

  if (!name) { showToast('Please enter your name.', 'error'); return; }
  if (!review) { showToast('Please write a review.', 'error'); return; }
  if (!rating) { showToast('Please select a star rating.', 'error'); return; }

  // Add to appData testimonials
  const newTestimonial = {
    id: 'tr_' + Date.now(),
    name,
    review,
    rating,
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  };

  if (appData && appData.testimonials) {
    appData.testimonials.unshift(newTestimonial);
    if (typeof saveAdminData === 'function') saveAdminData(appData);
  }

  // Re-render testimonials carousel on home page if present
  if (typeof initReviewsCarousel === 'function') {
    initReviewsCarousel();
  }

  closeReviewModal();
  document.getElementById('review-form')?.reset();
  showToast('Thank you for your review!', 'success');
}

function ensureReviewModal() {
  if (document.getElementById('review-modal')) return;
  const modal = document.createElement('div');
  modal.id = 'review-modal';
  modal.className = 'hidden';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.style.cssText = 'position:fixed;inset:0;background:rgba(42,20,10,.6);backdrop-filter:blur(6px);z-index:4000;display:flex;align-items:center;justify-content:center;padding:20px;';
  modal.innerHTML = `
    <div class="auth-card" style="max-width:480px;width:100%;">
      <div class="auth-header">
        <div class="auth-header-text">
          <h3>Share Your Experience</h3>
          <p>We love hearing from our sweet family!</p>
        </div>
        <button class="auth-close-btn" onclick="closeReviewModal()" aria-label="Close">×</button>
      </div>
      <div class="auth-body">
        <form id="review-form" onsubmit="submitCustomerReview(event)">
          <div class="auth-form-group">
            <label>Your Name *</label>
            <input type="text" id="review-name" placeholder="e.g. Sneha Patel" required />
          </div>
          <div class="auth-form-group">
            <label>Your Rating *</label>
            <div style="display:flex;gap:6px;margin-top:6px;">
              <button type="button" class="review-star-btn" onclick="setReviewStarRating(1)" aria-label="Rate 1">★</button>
              <button type="button" class="review-star-btn" onclick="setReviewStarRating(2)" aria-label="Rate 2">★</button>
              <button type="button" class="review-star-btn" onclick="setReviewStarRating(3)" aria-label="Rate 3">★</button>
              <button type="button" class="review-star-btn" onclick="setReviewStarRating(4)" aria-label="Rate 4">★</button>
              <button type="button" class="review-star-btn" onclick="setReviewStarRating(5)" aria-label="Rate 5">★</button>
            </div>
            <input type="hidden" id="review-rating-value" value="0" />
          </div>
          <div class="auth-form-group">
            <label>Your Review *</label>
            <textarea id="review-text" placeholder="Tell us about your experience with DessertWall Studio..." rows="4" style="width:100%;padding:10px 12px;border:1px solid var(--c-border);border-radius:var(--radius-sm);font-family:'Inter',sans-serif;font-size:.9rem;resize:vertical;"></textarea>
          </div>
          <button type="submit" class="btn btn-primary btn-block" style="width:100%;justify-content:center;margin-top:4px;">Submit Review</button>
        </form>
      </div>
    </div>`;
  modal.addEventListener('click', (e) => { if (e.target === modal) closeReviewModal(); });
  document.body.appendChild(modal);
}

// =============================================================
//  Shared DOM Initializer
// =============================================================
document.addEventListener('DOMContentLoaded', () => {
  ensureModalsExist();
  initRunningOfferBar();
  updateCartBadge();
  updateUserAuthUI();
  if (document.getElementById('testimonials-scroll-container')) {
    initReviewsCarousel();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const reviewModal = document.getElementById('review-modal');
    if (reviewModal && !reviewModal.classList.contains('hidden')) closeReviewModal();
  }
});

document.querySelectorAll('input[type="number"]').forEach(input => {
  input.addEventListener('wheel', function (e) {
    e.preventDefault();
  }, { passive: false });
});

// =============================================================
// =============================================================
//  Horizontal Looping Reviews Carousel (2 at a time, 80-85% device width)
// =============================================================
function scrollReviewsCarousel(direction) {
  const container = document.getElementById('testimonials-scroll-container');
  if (!container) return;

  const isMobile = window.innerWidth <= 640;
  const gap = isMobile ? 12 : 20;
  const cardWidth = Math.max(120, Math.floor((container.clientWidth - gap) / 2));
  const step = cardWidth + gap;
  const maxScroll = container.scrollWidth - container.clientWidth;

  if (direction > 0) { // Next review (>)
    if (container.scrollLeft >= maxScroll - 20) {
      container.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: step, behavior: 'smooth' });
    }
  } else { // Prev review (<)
    if (container.scrollLeft <= 20) {
      container.scrollTo({ left: maxScroll, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: -step, behavior: 'smooth' });
    }
  }
}
window.scrollReviewsCarousel = scrollReviewsCarousel;

function initReviewsCarousel() {
  const container = document.getElementById('testimonials-scroll-container');
  const grid = document.getElementById('testimonials-grid');
  const prevBtn = document.getElementById('review-prev-btn');
  const nextBtn = document.getElementById('review-next-btn');

  if (!container || !grid) return;

  // Source: latest 10 from appData.testimonials (newest first — new ones are unshift-ed)
  const allReviews = (window.appData && Array.isArray(appData.testimonials) && appData.testimonials.length > 0)
    ? appData.testimonials
    : (typeof TESTIMONIALS !== 'undefined' ? TESTIMONIALS : []);

  // Take the first 10 (index 0 = newest since unshift is used on submit)
  const rawItems = allReviews.slice(0, Math.min(10, allReviews.length));

  if (rawItems.length === 0) {
    grid.innerHTML = '<div style="padding:40px;text-align:center;color:var(--c-text-muted);">No reviews yet. Be the first!</div>';
    return;
  }

  // Ensure at least 4 items so the infinite-loop duplication looks natural
  let baseItems = [...rawItems];
  while (baseItems.length < 4) baseItems = baseItems.concat(rawItems);
  const totalBase = baseItems.length;

  // Build 3 copies for seamless infinite looping
  const tripled = [];
  for (let s = 0; s < 3; s++) baseItems.forEach(t => tripled.push(t));

  // Render all cards into the grid
  grid.innerHTML = tripled.map(t => {
    const rVal = Math.min(5, Math.max(1, parseInt(t.rating) || 5));
    const stars = '★'.repeat(rVal) + '☆'.repeat(5 - rVal);
    return `
    <div class="testimonial-card">
      <div class="test-stars">${stars}</div>
      <p class="test-review">"${t.review}"</p>
      <div class="test-name">— ${t.name}${t.date
        ? `<span style="font-size:.72rem;color:var(--c-text-muted);margin-left:6px;">${t.date}</span>`
        : ''}</div>
    </div>
  `;
  }).join('');

  let step = 0;
  let currentCardWidth = 0;

  function updateDimensions() {
    const isMobile = window.innerWidth <= 640;
    const gap = isMobile ? 12 : 20;
    const containerW = container.clientWidth || (window.innerWidth * 0.84 - 88);
    // Exactly 2 cards visible at a time
    currentCardWidth = Math.max(120, Math.floor((containerW - gap) / 2));
    step = currentCardWidth + gap;

    const cards = grid.querySelectorAll('.testimonial-card');
    cards.forEach(c => {
      c.style.width = currentCardWidth + 'px';
      c.style.minWidth = currentCardWidth + 'px';
      c.style.maxWidth = currentCardWidth + 'px';
      c.style.flex = `0 0 ${currentCardWidth}px`;
    });

    return step;
  }

  updateDimensions();
  const setWidth = totalBase * step;

  // Initialize at Set 1
  container.style.scrollBehavior = 'auto';
  container.scrollLeft = setWidth;

  // Resize handler
  if (container._resizeHandler) {
    window.removeEventListener('resize', container._resizeHandler);
  }
  container._resizeHandler = () => {
    updateDimensions();
  };
  window.addEventListener('resize', container._resizeHandler);

  // Normalization logic for infinite looping
  let isNormalizing = false;
  let scrollTimeout = null;

  function checkLoopBoundary() {
    if (isNormalizing) return;
    const currentSetWidth = totalBase * step;
    if (currentSetWidth <= 0) return;
    const sLeft = container.scrollLeft;

    if (sLeft >= 2 * currentSetWidth) {
      isNormalizing = true;
      container.style.scrollBehavior = 'auto';
      container.scrollLeft = sLeft - currentSetWidth;
      requestAnimationFrame(() => {
        container.style.scrollBehavior = 'smooth';
        isNormalizing = false;
      });
    } else if (sLeft < currentSetWidth - step) {
      isNormalizing = true;
      container.style.scrollBehavior = 'auto';
      container.scrollLeft = sLeft + currentSetWidth;
      requestAnimationFrame(() => {
        container.style.scrollBehavior = 'smooth';
        isNormalizing = false;
      });
    }
  }

  container.onscroll = () => {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(checkLoopBoundary, 100);
  };

  if (nextBtn) {
    nextBtn.onclick = (e) => {
      e.preventDefault();
      scrollReviewsCarousel(1);
    };
  }

  if (prevBtn) {
    prevBtn.onclick = (e) => {
      e.preventDefault();
      scrollReviewsCarousel(-1);
    };
  }

  // Mouse Drag Support
  let isDown = false;
  let startX = 0;
  let scrollLeftStart = 0;

  container.onmousedown = (e) => {
    isDown = true;
    container.classList.add('is-dragging');
    startX = e.pageX - container.offsetLeft;
    scrollLeftStart = container.scrollLeft;
  };

  window.addEventListener('mouseup', () => {
    if (isDown) {
      isDown = false;
      container.classList.remove('is-dragging');
    }
  });

  container.onmousemove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = (x - startX);
    container.scrollLeft = scrollLeftStart - walk;
  };
}
window.initReviewsCarousel = initReviewsCarousel;

// Auto-run if elements exist
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('testimonials-scroll-container')) initReviewsCarousel();
  });
} else {
  if (document.getElementById('testimonials-scroll-container')) initReviewsCarousel();
}
window.addEventListener('load', () => {
  if (document.getElementById('testimonials-scroll-container')) initReviewsCarousel();
});

function setReviewRating(n) {
  reviewRating = n;
  document.querySelectorAll('#starPick button').forEach((b, i) => b.classList.toggle('on', i < n));
}

// ============================================================
//  DessertBot — AI Chat Widget & Knowledge Engine
// ============================================================

(function () {
  let botChatTurnCount = 0;
  let botHasGreeted = false;

  // 1. Inject Chatbot Widget into DOM
  function injectDessertBot() {
    // Skip chatbot on admin page
    if (window.location.pathname.toLowerCase().includes('admin')) return;
    if (document.getElementById('dessertbot-toggle')) return;

    // Toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'dessertbot-toggle';
    toggleBtn.setAttribute('aria-label', 'Chat with Brownie AI Assistant');
    toggleBtn.setAttribute('title', 'Chat with Brownie about ingredients, craft & orders');
    toggleBtn.innerHTML = `<img src="images/chatbot.png" alt="Brownie" class="bot-toggle-img">`;

    // Chat Window
    const win = document.createElement('div');
    win.id = 'dessertbot-window';
    win.className = 'bot-hidden';
    win.setAttribute('role', 'dialog');
    win.setAttribute('aria-label', 'Brownie Assistant');
    win.innerHTML = `
      <div class="bot-header">
        <div class="bot-avatar"><img src="images/chatbot.png" alt="Brownie"></div>
        <div class="bot-header-info">
          <div class="bot-header-name">Brownie</div>
          <div class="bot-header-status"><span class="bot-status-dot"></span> Online · AI Assistant</div>
        </div>
        <button class="bot-close-btn" id="bot-close-btn" aria-label="Close Chat">×</button>
      </div>
      <div class="bot-messages" id="bot-messages"></div>
      <div class="bot-input-row">
        <input type="text" id="bot-input" placeholder="Ask Brownie about ingredients, craft, orders..." autocomplete="off">
        <button id="bot-send-btn" aria-label="Send Message">➤</button>
      </div>
    `;

    document.body.appendChild(toggleBtn);
    document.body.appendChild(win);

    // Event listeners
    toggleBtn.addEventListener('click', () => toggleDessertBot());
    const closeBtn = document.getElementById('bot-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDessertBot(false);
      });
    }

    const input = document.getElementById('bot-input');
    const sendBtn = document.getElementById('bot-send-btn');

    if (sendBtn) sendBtn.addEventListener('click', () => botSend());
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          botSend();
        }
      });
    }
  }

  // 2. Toggle Window
  function toggleDessertBot(forceState) {
    const win = document.getElementById('dessertbot-window');
    const toggleBtn = document.getElementById('dessertbot-toggle');
    if (!win) return;
    const isHidden = win.classList.contains('bot-hidden');
    const shouldOpen = typeof forceState === 'boolean' ? forceState : isHidden;

    if (shouldOpen) {
      win.classList.remove('bot-hidden');
      if (toggleBtn) {
        toggleBtn.classList.add('bot-hidden');
        toggleBtn.disabled = true;
        toggleBtn.setAttribute('aria-hidden', 'true');
      }

      if (!botHasGreeted) {
        showBotWelcome();
        botHasGreeted = true;
      }
      setTimeout(() => {
        const input = document.getElementById('bot-input');
        if (input) input.focus();
      }, 200);
    } else {
      win.classList.add('bot-hidden');
      if (toggleBtn) {
        toggleBtn.classList.remove('bot-hidden');
        toggleBtn.disabled = false;
        toggleBtn.removeAttribute('aria-hidden');
      }
    }
  }
  window.toggleDessertBot = toggleDessertBot;

  // Exit chat on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const win = document.getElementById('dessertbot-window');
      if (win && !win.classList.contains('bot-hidden')) {
        toggleDessertBot(false);
      }
    }
  });

  // 3. Welcome Message

  function showBotWelcome() {
    appendBotMsg(`
      Hello! 👋 Welcome to <strong>DessertWall Studio</strong>. I'm <strong>Brownie</strong>, your personal dessert assistant.<br><br>
      I can guide you on <strong>how our treats are handcrafted</strong>, our <strong>pure ingredients</strong>, <strong>100% eggless options</strong>, <strong>delivery</strong>, and <strong>custom orders</strong>.<br><br>
      How may I sweeten your day?
    `);
  }

  // 4. Contact Card Helper
  function getContactCardHtml(customNote) {
    const note = customNote || "For personalized guidance, custom design cakes, or immediate assistance, our team is right here:";
    const phone = (window.appData && window.appData.business && window.appData.business.whatsapp) || "7667305677";
    return `
      <div class="bot-contact-card">
        <div class="bot-contact-label">📞 Direct Studio Support</div>
        <p style="margin: 0 0 6px 0; font-size: 0.77rem; color: var(--c-text-soft); line-height: 1.4;">${note}</p>
        <div style="display: flex; flex-direction: column; gap: 4px;">
          <a href="tel:+91${phone}">📞 Call: +91 76673 05677</a>
          <a href="#" onclick="openWhatsApp('Hi DessertWall Studio! I need assistance with my dessert order.'); return false;">💬 Chat on WhatsApp (+91 76673 05677)</a>
        </div>
      </div>
    `;
  }

  // 5. Append User and Bot Messages
  function appendUserMsg(text) {
    const container = document.getElementById('bot-messages');
    if (!container) return;
    const msg = document.createElement('div');
    msg.className = 'bot-msg user';
    msg.innerHTML = `<div class="bot-bubble">${escapeHtml(text)}</div>`;
    container.appendChild(msg);
    scrollToBottom();
  }

  function appendBotMsg(html) {
    const container = document.getElementById('bot-messages');
    if (!container) return;
    const msg = document.createElement('div');
    msg.className = 'bot-msg bot';
    msg.innerHTML = `
      <div class="bot-bubble">${html}</div>
    `;
    container.appendChild(msg);
    scrollToBottom();
  }

  function showTypingIndicator() {
    const container = document.getElementById('bot-messages');
    if (!container) return null;
    const typing = document.createElement('div');
    typing.className = 'bot-msg bot bot-typing-msg';
    typing.innerHTML = `
        <span></span><span></span><span></span>
      </div>
    `;
    container.appendChild(typing);
    scrollToBottom();
    return typing;
  }

  function scrollToBottom() {
    const container = document.getElementById('bot-messages');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // 6. Knowledge Base & Response Engine
  function processBotResponse(query) {
    const q = query.toLowerCase().trim();
    botChatTurnCount++;

    // Check if query is high complexity / extended catering / urgent
    const isExtendedQuery = /(wedding|catering|bulk|corporate|urgent|same day|tomorrow|party package|custom quote|consultation|manager|speak to human|talk to human|agent)/i.test(q);

    // Topic 1: How it's made / baking craft
    if (/(how.*(made|make|bake|prepare|crafted|kitchen|cook)|baking process|handcrafted|scratch|recipe|technique|method|freshly baked)/i.test(q)) {
      let resp = `
        <strong>✨ Handcrafted With Love:</strong><br>
        At DessertWall Studio, every dessert is baked fresh from scratch in our boutique kitchen in small batches:<br>
        • <strong>Fresh to Order:</strong> We never mass-produce or freeze batches; baking starts only after order confirmation.<br>
        • <strong>Artisan Techniques:</strong> Slow-melted Belgian chocolate, hand-whipped ganache, and European folding methods.<br>
        • <strong>No Premixes:</strong> 100% scratch baking without commercial base mixes or artificial stabilizers.<br>
        • <strong>Careful Packaging:</strong> Chilled and packed in insulated, food-safe boxes to maintain peak moisture and texture.
      `;
      if (isExtendedQuery || botChatTurnCount >= 3) {
        resp += `<br>` + getContactCardHtml("Have a custom recipe requirement, tiered wedding cake, or specific dietary preference?");
      }
      return { html: resp, chips: ["Ingredients used", "100% Eggless options?", "Custom cakes", "How to order"] };
    }

    // Topic 2: Ingredients
    if (/(ingredient|what do you use|what is used|chocolate|butter|flour|cocoa|vanilla|cream|preservative|chemical|additive|sugar|gelatin|dairy|pure|clean label)/i.test(q)) {
      let resp = `
        <strong>🌿 Our Pure, Premium Ingredients:</strong><br>
        We believe exceptional desserts require uncompromising ingredient quality:<br>
        • <strong>Belgian Couverture Chocolate:</strong> Premium 54.5% and 70% cocoa solids for decadent ganache.<br>
        • <strong>Pure Dairy Butter & Cream:</strong> 100% real cow butter; zero margarine, dalda, or hydrogenated fats.<br>
        • <strong>Madagascar Bourbon Vanilla:</strong> Real vanilla bean extract for an authentic floral fragrance.<br>
        • <strong>Gelatin-Free:</strong> All our eggless mousses & jellies use 100% plant-based agar-agar.<br>
        • <strong>Zero Artificial Preservatives:</strong> Clean, fresh, wholesome ingredients from trusted purveyors.
      `;
      if (isExtendedQuery || botChatTurnCount >= 3) {
        resp += `<br>` + getContactCardHtml("Need an allergy-safe dessert or special allergen list?");
      }
      return { html: resp, chips: ["100% Eggless options?", "How are desserts made?", "Delivery details", "Menu items"] };
    }

    // Topic 3: Eggless / Vegetarian
    if (/(eggless|egg free|egg-free|without egg|vegetarian|veg|contain egg|contains egg|no egg)/i.test(q)) {
      let resp = `
        <strong>🌱 100% Eggless Options Available:</strong><br>
        Yes! All our signature cakes, cupcakes, and brownie boxes are available in <strong>100% Eggless</strong> variants.<br>
        • We use separate prep tools and sanitized baking trays.<br>
        • Our eggless sponges are naturally cultured with fresh dairy yoghurt and condensed milk, achieving a moist, heavenly crumb that rivals traditional recipes!<br>
        • Simply select <em>'Eggless'</em> in the cake customizer or checkout page.
      `;
      return { html: resp, chips: ["How are desserts made?", "Ingredients used", "Custom cakes", "How to order"] };
    }

    // Topic 4: Delivery / Areas / Pincode
    if (/(delivery|deliver|shipping|ship|chennai|location|area|address|doorstep|fee|charges|cost of delivery|free delivery|pincode|pickup)/i.test(q)) {
      let resp = `
        <strong>🚚 Delivery & Studio Pickup:</strong><br>
        • <strong>Service Area:</strong> We deliver across all major localities in Chennai, Tamil Nadu.<br>
        • <strong>Free Delivery:</strong> Enjoy <strong>Free Delivery</strong> on all orders above ₹1,499!<br>
        • <strong>Standard Delivery:</strong> Flat ₹60 for orders below ₹1,499.<br>
        • <strong>Direct Studio Pickup:</strong> Free pickup is also available directly from our studio.<br>
        • <strong>Lead Time:</strong> Most cakes require 24h - 48h advance notice; custom celebration cakes require 72h.
      `;
      if (isExtendedQuery || botChatTurnCount >= 3) {
        resp += `<br>` + getContactCardHtml("Need urgent same-day delivery or midnight surprise delivery?");
      }
      return { html: resp, chips: ["How to order", "Active offers", "Custom cakes", "Ingredients used"] };
    }

    // Topic 5: How to Order / Payment
    if (/(how.*(order|buy|purchase)|place order|order now|checkout|cart|payment|upi|gpay|cod|cash on delivery|how can i)/i.test(q)) {
      let resp = `
        <strong>🛒 Easy Ways to Order:</strong><br>
        1. <strong>Direct Single Order:</strong> Click <em>'Order Now'</em> on any dessert card or modal for quick checkout with custom notes and coupon application.<br>
        2. <strong>Cart Checkout:</strong> Click <em>'Add to Cart'</em> to combine multiple items and proceed to checkout.<br>
        3. <strong>Payment Options:</strong> We support UPI (GPay, PhonePe, Paytm), Net Banking, Cards, and Cash on Delivery / Studio Pickup.<br>
        4. <strong>WhatsApp:</strong> You can also tap the green WhatsApp button to order directly with our baker!
      `;
      return { html: resp, chips: ["Active offers", "Delivery details", "Custom cakes", "Menu items"] };
    }

    // Topic 6: Shelf Life / Storage
    if (/(shelf life|storage|store|how long|keep|fridge|refrigerate|expiry|expire|freshness|temperature)/i.test(q)) {
      let resp = `
        <strong>❄️ Storage & Freshness Tips:</strong><br>
        • <strong>Cakes:</strong> Keep refrigerated (4°C - 6°C). Bring to room temperature 15-20 minutes before serving for the creamiest texture. Best consumed within 48 hours.<br>
        • <strong>Brownies:</strong> Store in an airtight container at room temperature for 4-5 days, or in fridge for up to a week. Warm for 10 seconds in microwave for a gooey molten fudge experience!<br>
        • <strong>Cupcakes:</strong> Store in a cool, dry place. Best enjoyed within 24-48 hours.
      `;
      return { html: resp, chips: ["Ingredients used", "How are desserts made?", "How to order"] };
    }

    // Topic 7: Custom Cakes & Personalization
    if (/(custom|personaliz|theme|birthday cake|photo cake|anniversary|topper|message|name on cake|design|tier|special request)/i.test(q)) {
      let resp = `
        <strong>🎨 Custom Celebrations & Cake Design:</strong><br>
        We turn your celebration dreams into edible artistry!<br>
        • Complimentary personalized message written on all celebration cakes & brownie boxes.<br>
        • Free custom acrylic gold topper included with eligible birthday cakes.<br>
        • Custom flavors, multi-tiered cakes, and theme styling available.<br>
        • For intricate theme cakes, please place your order 48 to 72 hours in advance.
      `;
      resp += `<br>` + getContactCardHtml("Share your theme photos, guest count, and design vision with our head cake artist:");
      return { html: resp, chips: ["How are desserts made?", "Ingredients used", "Delivery details", "How to order"] };
    }

    // Topic 8: Offers & Coupon Codes
    if (/(offer|coupon|discount|promo|deal|code|sweet15|brownie10|welcome|save|voucher)/i.test(q)) {
      let resp = `
        <strong>🏷️ Current Exclusive Offers & Coupons:</strong><br>
        • <strong>SWEET15:</strong> 15% OFF on cake orders above ₹1,000.<br>
        • <strong>BROWNIE10:</strong> 10% OFF on all gourmet brownie boxes.<br>
        • <strong>WELCOME:</strong> ₹50 OFF on your first dessert order.<br>
        • <strong>FREE DELIVERY:</strong> Automatically applied on all orders above ₹1,499.<br>
        You can type and apply these codes directly on the checkout page!
      `;
      return { html: resp, chips: ["How to order", "Menu items", "Delivery details"] };
    }

    // Topic 9: Products & Menu & Pricing
    if (/(menu|product|item|cake|brownie|cupcake|truffle|mousse|price|cost|rate|variety|what do you have)/i.test(q)) {
      let resp = `
        <strong>🍰 DessertWall Studio Bestsellers:</strong><br>
        • <strong>Chocolate Truffle Cake:</strong> Decadent dark ganache, starting from ₹850.<br>
        • <strong>Vanilla Floral Celebration Cake:</strong> Fresh edible flowers, starting from ₹1,100.<br>
        • <strong>Gourmet Brownie Box:</strong> Sea-salt walnut & Nutella fudgy brownies, starting from ₹450.<br>
        • <strong>Assorted Cupcakes:</strong> Buttercream swirled box of 6/12/24, starting from ₹380.<br>
        • <strong>Belgian Mirror Glaze Mousse:</strong> Signature entremets, starting from ₹950.<br>
        Check our <em>Menu</em> page for full size and flavor configurations!
      `;
      return { html: resp, chips: ["How to order", "Active offers", "100% Eggless options?", "Ingredients used"] };
    }

    // Topic 10: Timings & Studio Location
    if (/(timing|hour|open|close|sunday|where are you|location|address|studio|shop)/i.test(q)) {
      let resp = `
        <strong>⏰ Studio Timings & Location:</strong><br>
        • <strong>Location:</strong> Chennai, Tamil Nadu.<br>
        • <strong>Working Hours:</strong><br>
          &nbsp;&nbsp;Mon - Sat: 9:00 AM - 8:00 PM<br>
          &nbsp;&nbsp;Sunday: 10:00 AM - 6:00 PM<br>
        • <strong>Online Orders:</strong> Accepted 24/7 on this website!
      `;
      resp += `<br>` + getContactCardHtml();
      return { html: resp, chips: ["How to order", "Delivery details", "Custom cakes"] };
    }

    // Topic 11: Contact / Speak to Human / Phone
    if (/(contact|phone|number|call|whatsapp|reach|speak|talk|support|human|help|agent|baker)/i.test(q)) {
      let resp = `
        <strong>📞 Connect With Our Bakery Team:</strong><br>
        We're always here to assist you with customized orders, event inquiries, or order updates!
      `;
      resp += `<br>` + getContactCardHtml();
      return { html: resp, chips: ["How are desserts made?", "Ingredients used", "How to order", "Custom cakes"] };
    }

    // Topic 12: Greetings
    if (/^(hi|hello|hey|good morning|good afternoon|good evening|namaste|greetings)(\s|$|[!?.])/i.test(q)) {
      return {
        html: `Hello! 👋 I'm <strong>Brownie</strong>! How may I assist you today? You can ask me about how our desserts are made, our pure ingredients, 100% eggless options, delivery, or custom cakes!`
      };
    }

    // Topic 13: Thank you
    if (/(thank|thanks|awesome|great|super|cool|perfect|helpful|ok|okay)/i.test(q)) {
      let resp = `You're very welcome! 🍫 Wishing you a sweet and delightful day. Let me know if you need anything else!`;
      if (botChatTurnCount >= 3) {
        resp += `<br>` + getContactCardHtml("For any upcoming celebrations or bulk orders, keep our direct helpline handy:");
      }
      return { html: resp };
    }

    // Topic 14: Out of Scope / Deflection ("Out of box")
    // Professional deflection message + contact card for extended queries
    const deflectionHtml = `
      I appreciate your question! However, that falls outside my area of expertise. 🍫<br><br>
      I am <strong>Brownie</strong>, specialized exclusively in DessertWall Studio's handcrafted desserts, baking craft, ingredients, and order assistance.<br><br>
      If your query relates to a specialized order, partnership, or you need personal assistance, our team is always delighted to assist you directly:
      ${getContactCardHtml("Feel free to call or WhatsApp our studio team:")}
    `;

    return {
      html: deflectionHtml,
      chips: ["How are desserts made?", "Ingredients used", "100% Eggless options?", "Delivery details"]
    };
  }

  // 7. Bot Send Action
  function botSend(customText) {
    const input = document.getElementById('bot-input');
    const text = (customText !== undefined ? customText : (input ? input.value : '')).trim();
    if (!text) return;

    if (input) input.value = '';

    appendUserMsg(text);

    // Show typing indicator
    const typingIndicator = showTypingIndicator();

    setTimeout(() => {
      if (typingIndicator && typingIndicator.parentNode) {
        typingIndicator.parentNode.removeChild(typingIndicator);
      }
      const response = processBotResponse(text);
      appendBotMsg(response.html);
      if (typeof renderChips === 'function') {
        renderChips(response.chips);
      }
    }, 650);
  }
  window.botSend = botSend;

  // Initialize
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectDessertBot);
  } else {
    injectDessertBot();
  }
})();