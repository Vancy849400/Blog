// Initial blog post data (loaded from localStorage)
let data = [];

function loadFromStorage() {
  try {
    const raw = localStorage.getItem('object');
    if (!raw) {
      data = [];
      return;
    }
    const parsed = JSON.parse(raw);
    data = Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to load posts from storage', err);
    data = [];
  }
}

// Read and display all posts from data array
const readAll = () => {
  // persist current data
  try {
    localStorage.setItem('object', JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save posts to storage', err);
  }

  // If no posts, show the empty state and clear details
  if (!data || data.length === 0) {
    const detailsEl = document.querySelector('.details');
    if (detailsEl) detailsEl.innerHTML = '';
    showEmptyState();
    return;
  }

  // Hide empty state and render posts
  hideEmptyState();

  let element = '';
  data.forEach((record) => {
    element += `
      <article class="bg-white shadow rounded-lg p-4">
        <h2 class="text-lg md:text-xl font-bold text-gray-800 mb-2">${record.title}</h2>
        <p class="text-gray-700 mb-3 break-words">${record.des}</p>
        <p class="text-sm text-gray-600 mb-4">By: <span class="font-semibold">${record.name}</span></p>
        <div class="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
          <button onclick="editPost(${record.id})" class="w-full sm:w-auto px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition font-semibold">Edit</button>
          <button onclick="deletePost(${record.id})" class="w-full sm:w-auto px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition font-semibold">Delete</button>
        </div>
      </article>`;
  });

  const detailsEl = document.querySelector('.details');
  if (detailsEl) detailsEl.innerHTML = element;
};

// Show empty state inside .no_post with a CTA to add a new post
function showEmptyState() {
  const noPostEl = document.querySelector(".no_post");
  if (!noPostEl) return;

  noPostEl.innerHTML = `
    <div class="p-6 text-center text-gray-600">
      <h3 class="text-xl font-semibold mb-2">No Posts Yet</h3>
      <p class="mb-4">Start creating your first blog post to get started!</p>
    </div>
  `;
  // show/hide relevant sections
  noPostEl.style.display = "block";
  document.querySelector(".details").style.display = "none";
  const addPostEl = document.querySelector(".add_post");
  if (addPostEl) addPostEl.style.display = "none";
}

// Hide the empty state
function hideEmptyState() {
  const noPostEl = document.querySelector(".no_post");
  if (!noPostEl) return;
  noPostEl.style.display = "none";
  noPostEl.innerHTML = "";
  document.querySelector(".details").style.display = "block";
}

// Show create post form and hide other elements
function addData() {
  document.querySelector(".create_data").style.display = "block";
  const addPostEl = document.querySelector(".add_post");
  if (addPostEl) addPostEl.style.display = "none";
  document.querySelector(".details").style.display = "none";
  // ensure empty state hidden when opening form
  hideEmptyState();
}

// Create and add new post to data array
function createData() {
  const title = document.querySelector("#title").value.trim();
  const des = document.querySelector("#msg").value.trim();
  const name = document.querySelector("#name").value.trim();

  if (!title || !des || !name) {
    alert("Please fill in all fields");
    return;
  }

  const newObj = { id: Date.now(), title, des, name };
  data.push(newObj);

  // reset UI
  document.querySelector("#title").value = "";
  document.querySelector("#msg").value = "";
  document.querySelector("#name").value = "";
  document.querySelector(".create_data").style.display = "none";
  const addPostEl = document.querySelector(".add_post");
  if (addPostEl) addPostEl.style.display = "block";

  readAll();
}

// Show update form and populate with selected post data
function editPost(id) {
  document.querySelector(".update_data").style.display = "block";
  const addPostEl = document.querySelector(".add_post");
  if (addPostEl) addPostEl.style.display = "none";
  document.querySelector(".details").style.display = "none";

  const obj = data.find((rec) => rec.id === id);
  if (!obj) return;
  document.getElementById("user_title").value = obj.title;
  document.getElementById("user_msg").value = obj.des;
  document.getElementById("user_name").value = obj.name;
  document.getElementById("id").value = obj.id;
}

// Update existing post and refresh display
function updateData() {
  const id = parseInt(document.getElementById("id").value, 10);
  const title = document.getElementById("user_title").value.trim();
  const des = document.getElementById("user_msg").value.trim();
  const name = document.getElementById("user_name").value.trim();

  const index = data.findIndex((rec) => rec.id === id);
  if (index === -1) return;

  data[index] = { id, title, des, name };

  document.querySelector(".update_data").style.display = "none";
  const addPostEl = document.querySelector(".add_post");
  if (addPostEl) addPostEl.style.display = "block";
  readAll();
}

// Delete post by id and refresh display
function deletePost(id) {
  data = data.filter((rec) => rec.id !== id);
  readAll();
}

// Initialize and display all posts when page loads
document.addEventListener("DOMContentLoaded", () => {
  loadFromStorage();
  readAll();
});
