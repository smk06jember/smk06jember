// ====== SIMPAN & AMBIL DATA LOCAL STORAGE ======

// fungsi ambil data dari localStorage
function getData(key) {
    let data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

// fungsi simpan data ke localStorage
function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// ====== CONTOH UNTUK KOMENTAR PRODUK ======

function addComment(productId, username, comment) {
    let comments = getData("comments");

    // buat komentar baru
    let newComment = {
        id: Date.now(),
        productId: productId,
        user: username,
        text: comment
    };

    comments.push(newComment);
    saveData("comments", comments);

    displayComments(productId);
}

function displayComments(productId) {
    let comments = getData("comments");
    let filtered = comments.filter(c => c.productId === productId);

    let container = document.getElementById("comments-" + productId);
    if (!container) return;

    container.innerHTML = "";
    filtered.forEach(c => {
        let p = document.createElement("p");
        p.textContent = c.user + " : " + c.text;
        container.appendChild(p);
    });
}

// ====== CONTOH UNTUK PRODUK ======

function addProduct(name, price, image) {
    let products = getData("products");

    let newProduct = {
        id: Date.now(),
        name: name,
        price: price,
        image: image
    };

    products.push(newProduct);
    saveData("products", products);
}

function displayProducts() {
    let products = getData("products");
    let list = document.getElementById("product-list");

    list.innerHTML = "";
    products.forEach(p => {
        let div = document.createElement("div");
        div.className = "product";

        div.innerHTML = `
            <h3>${p.name}</h3>
            <img src="${p.image}" alt="${p.name}">
            <p class="price">Rp ${p.price}</p>

            <div class="comment-form">
                <input type="text" id="username-${p.id}" placeholder="Nama">
                <textarea id="comment-${p.id}" placeholder="Tulis komentar..."></textarea>
                <button onclick="addComment(${p.id}, 
                    document.getElementById('username-${p.id}').value,
                    document.getElementById('comment-${p.id}').value)">Kirim</button>
            </div>
            <div class="comments" id="comments-${p.id}"></div>
        `;

        list.appendChild(div);
        displayComments(p.id);
    });
}

// ====== JALANKAN SAAT LOAD ======
window.onload = () => {
    displayProducts();
};
// Simpan komentar ke localStorage
function saveComment(comment) {
    let comments = JSON.parse(localStorage.getItem("comments")) || [];
    comments.push(comment);
    localStorage.setItem("comments", JSON.stringify(comments));
    loadComments();
}

// Tampilkan komentar
function loadComments() {
    let comments = JSON.parse(localStorage.getItem("comments")) || [];
    let commentSection = document.getElementById("commentSection");
    commentSection.innerHTML = "";

    comments.forEach((comment, index) => {
        let commentDiv = document.createElement("div");
        commentDiv.className = "comment-item";
        commentDiv.innerHTML = `
            <p>${comment}</p>
            <button class="delete-btn" onclick="deleteComment(${index})">Hapus</button>
        `;
        commentSection.appendChild(commentDiv);
    });
}

// Simpan komentar ke localStorage
function saveComment(comment) {
    let comments = JSON.parse(localStorage.getItem("comments")) || [];
    comments.push(comment);
    localStorage.setItem("comments", JSON.stringify(comments));
    loadComments();
}

// Tampilkan komentar
function loadComments() {
    let comments = JSON.parse(localStorage.getItem("comments")) || [];
    let commentSection = document.getElementById("commentSection");
    commentSection.innerHTML = "";

    comments.forEach((comment, index) => {
        let commentDiv = document.createElement("div");
        commentDiv.className = "comment-item";
        commentDiv.innerHTML = `
            <p>${comment}</p>
            <button class="delete-btn" onclick="deleteComment(${index})">Hapus</button>
        `;
        commentSection.appendChild(commentDiv);
    });
}

// Hapus komentar
function deleteComment(index) {
    let comments = JSON.parse(localStorage.getItem("comments")) || [];
    if (confirm("Yakin ingin menghapus komentar ini?")) {
        comments.splice(index, 1);
        localStorage.setItem("comments", JSON.stringify(comments));
        loadComments();
    }
}


// Konfigurasi Firebase (ganti sesuai project kamu)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Inisialisasi Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.database(app);

// Kirim komentar
function sendComment() {
  let username = document.getElementById("username").value;
  let message = document.getElementById("message").value;

  if(username === "" || message === "") {
    alert("Nama dan komentar tidak boleh kosong!");
    return;
  }

  db.ref("comments").push({
    username: username,
    message: message,
    timestamp: Date.now()
  });

  document.getElementById("message").value = "";
}

// Tampilkan komentar realtime
const commentsDiv = document.getElementById("comments");
db.ref("comments").on("child_added", (snapshot) => {
  let data = snapshot.val();
  let commentElement = document.createElement("div");
  commentElement.classList.add("comment");
  commentElement.innerHTML = `<b>${data.username}</b>: ${data.message}`;
  commentsDiv.prepend(commentElement); // prepend biar komentar baru di atas
});


