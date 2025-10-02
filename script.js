<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Komentar Supabase Realtime</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f7f7f7;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 500px;
      margin: auto;
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }
    input, textarea {
      width: 100%;
      margin: 5px 0;
      padding: 10px;
      border-radius: 6px;
      border: 1px solid #ccc;
    }
    button {
      margin-top: 5px;
      padding: 10px;
      border: none;
      background: #4CAF50;
      color: white;
      border-radius: 6px;
      cursor: pointer;
    }
    button:hover {
      background: #45a049;
    }
    .comment {
      background: #eee;
      margin-top: 10px;
      padding: 10px;
      border-radius: 6px;
    }
  </style>
  <script src="https://unpkg.com/@supabase/supabase-js"></script>
</head>
<body>
  <div class="container">
    <h2>💬 Komentar Realtime (Supabase)</h2>
    <input type="text" id="username" placeholder="Nama kamu">
    <textarea id="message" placeholder="Tulis komentar..."></textarea>
    <button onclick="sendComment()">Kirim</button>

    <div id="comments"></div>
  </div>

  <script>
    // 🔧 Ganti dengan URL & Key dari Supabase Project Settings
    const { createClient } = supabase;
    const supa = createClient("YOUR_SUPABASE_URL", "YOUR_SUPABASE_ANON_KEY");

    const commentsDiv = document.getElementById("comments");

    // Kirim komentar ke Supabase
    async function sendComment() {
      let username = document.getElementById("username").value;
      let message = document.getElementById("message").value;

      if(username === "" || message === "") {
        alert("Nama dan komentar tidak boleh kosong!");
        return;
      }

      const { error } = await supa.from("comments").insert([
        { username: username, message: message }
      ]);

      if(error) {
        console.error(error);
      } else {
        document.getElementById("message").value = "";
      }
    }

    // Tampilkan komentar lama dari database
    async function loadComments() {
      let { data, error } = await supa.from("comments").select("*").order("id", { ascending: false });
      if (error) console.error(error);
      data.forEach(addCommentToUI);
    }

    // Tambahkan komentar ke UI
    function addCommentToUI(comment) {
      let el = document.createElement("div");
      el.classList.add("comment");
      el.innerHTML = `<b>${comment.username}</b>: ${comment.message}`;
      commentsDiv.prepend(el);
    }

    // Listener realtime: otomatis update saat ada komentar baru
    supa.channel("realtime:comments")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "comments" }, payload => {
        addCommentToUI(payload.new);
      })
      .subscribe();

    // Load awal komentar
    loadComments();
  </script>
</body>
</html>
