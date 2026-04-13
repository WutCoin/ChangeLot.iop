/**
 * profiles.js
 * Manages the user profile list and profile-picture update flow.
 * Profile pictures are persisted in localStorage so changes survive page reloads.
 */

const STORAGE_KEY = 'changeLot_avatars';

/** Seed data – replace or extend as needed. */
const USERS = [
  { id: 1, name: 'Alice Nguyen',   role: 'Frontend Dev',   defaultAvatar: 'https://i.pravatar.cc/150?img=1'  },
  { id: 2, name: 'Bob Kimani',     role: 'Backend Dev',    defaultAvatar: 'https://i.pravatar.cc/150?img=3'  },
  { id: 3, name: 'Carla Moreno',   role: 'UX Designer',    defaultAvatar: 'https://i.pravatar.cc/150?img=5'  },
  { id: 4, name: 'David Park',     role: 'DevOps',         defaultAvatar: 'https://i.pravatar.cc/150?img=7'  },
  { id: 5, name: 'Eva Johansson',  role: 'QA Engineer',    defaultAvatar: 'https://i.pravatar.cc/150?img=9'  },
  { id: 6, name: 'Frank Osei',     role: 'Product Manager',defaultAvatar: 'https://i.pravatar.cc/150?img=11' },
];

// ── Persistence helpers ───────────────────────────────────────────────────────

function loadAvatars() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
}

function saveAvatar(userId, dataUrl) {
  const avatars = loadAvatars();
  avatars[userId] = dataUrl;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(avatars));
}

function getAvatar(userId) {
  return loadAvatars()[userId] || null;
}

// ── Rendering ─────────────────────────────────────────────────────────────────

function renderProfiles() {
  const container = document.getElementById('profiles');
  container.innerHTML = '';

  USERS.forEach(user => {
    const src = getAvatar(user.id) || user.defaultAvatar;

    const card = document.createElement('article');
    card.className = 'card';
    card.dataset.userId = user.id;
    card.innerHTML = `
      <div class="avatar-wrapper">
        <img class="avatar" src="${src}" alt="${user.name}'s profile picture" />
        <button class="edit-btn" aria-label="Update ${user.name}'s profile picture" title="Update picture">✎</button>
      </div>
      <p class="name">${user.name}</p>
      <p class="role">${user.role}</p>
    `;

    card.querySelector('.edit-btn').addEventListener('click', () => openModal(user));
    container.appendChild(card);
  });
}

// ── Modal ─────────────────────────────────────────────────────────────────────

let activeUser = null;

function openModal(user) {
  activeUser = user;
  const overlay   = document.getElementById('modalOverlay');
  const preview   = document.getElementById('modalPreview');
  const username  = document.getElementById('modalUsername');
  const fileInput = document.getElementById('fileInput');

  preview.src    = getAvatar(user.id) || user.defaultAvatar;
  username.textContent = user.name;
  fileInput.value = '';                   // reset file picker
  overlay.classList.remove('hidden');
  overlay.focus?.();
}

function closeModal() {
  document.getElementById('modalOverlay').classList.add('hidden');
  activeUser = null;
}

// Live preview when a file is selected
document.getElementById('fileInput').addEventListener('change', function () {
  const file = this.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => { document.getElementById('modalPreview').src = e.target.result; };
  reader.readAsDataURL(file);
});

// Save button
document.getElementById('saveBtn').addEventListener('click', () => {
  if (!activeUser) return;
  const preview = document.getElementById('modalPreview');
  const fileInput = document.getElementById('fileInput');

  // Only persist if the user actually chose a new file
  if (fileInput.files.length > 0) {
    saveAvatar(activeUser.id, preview.src);
    // Update the card avatar in the DOM immediately
    const card = document.querySelector(`.card[data-user-id="${activeUser.id}"] img.avatar`);
    if (card) card.src = preview.src;
  }

  closeModal();
});

// Cancel button & overlay click
document.getElementById('cancelBtn').addEventListener('click', closeModal);
document.getElementById('modalOverlay').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeModal();
});

// Keyboard: Escape closes the modal
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// ── Bootstrap ─────────────────────────────────────────────────────────────────
renderProfiles();
