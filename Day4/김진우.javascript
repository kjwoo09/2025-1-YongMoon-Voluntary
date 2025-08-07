// 날짜/시간 포맷 함수
    function formatDateTime(isoString) {
      const date = new Date(isoString);
      return date.toLocaleString('ko-KR', {
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit'
      });
    }

    let posts = [
      {
        title: "나의 꿈",
        content: "저는 소프트웨어 개발자가 되는 것이 꿈입니다. 창의적인 프로그램을 만들고 싶어요!",
        password: "",
        likes: 0,
        comments: [],
        createdAt: new Date().toISOString()
      },
      {
        title: "올해 나의 목표",
        content: "1등급 맞기! 그리고 사이드 프로젝트 하나 만들어 보기.",
        password: "",
        likes: 0,
        comments: [],
        createdAt: new Date().toISOString()
      },
      {
        title: "나의 취미",
        content: "게임 개발, 독서, 그리고 새로운 기술 공부!",
        password: "",
        likes: 0,
        comments: [],
        createdAt: new Date().toISOString()
      }
    ];

    let currentPostIndex = null;
    let editing = false;
    let editingCommentIndex = null;

    function renderPosts() {
      const postList = document.getElementById("post-list");
      postList.innerHTML = "<h2>📚 최근 게시물</h2>";
      posts.slice().reverse().forEach((post, i) => {
        const index = posts.length - 1 - i;
        const postDiv = document.createElement("div");
        postDiv.className = "post-card";

        if (post.password) {
          // 비밀번호 있는 글은 내용 숨기고 비공개 문구만 보여주기
          postDiv.innerHTML = `
            <h3>${post.title} 🔒</h3>
            <small>작성일: ${formatDateTime(post.createdAt)}</small>
            <p><em>비공개 글입니다.</em></p>
          `;
        } else {
          // 비밀번호 없는 글은 기존처럼 내용 미리보기 표시
          postDiv.innerHTML = `
            <h3>${post.title}</h3>
            <small>작성일: ${formatDateTime(post.createdAt)}</small>
            <p>${post.content.length > 50 ? post.content.slice(0,50) + "..." : post.content}</p>
          `;
        }

        postDiv.onclick = () => showPost(index);
        postList.appendChild(postDiv);
      });
    }

    function addPost() {
      const titleInput = document.getElementById("title");
      const contentInput = document.getElementById("content");
      const passwordInput = document.getElementById("post-password");
      const title = titleInput.value.trim();
      const content = contentInput.value.trim();
      const password = passwordInput.value;

      if (!title || !content) {
        alert("제목과 내용을 모두 입력해주세요.");
        return;
      }

      posts.push({
        title,
        content,
        password,
        likes: 0,
        comments: [],
        createdAt: new Date().toISOString()
      });

      titleInput.value = "";
      contentInput.value = "";
      passwordInput.value = "";
      renderPosts();
    }

    function showPost(index) {
      if (editing) return;
      if (editingCommentIndex !== null) return;

      const post = posts[index];

      if (post.password) {
        const inputPwd = prompt("이 글은 비밀번호로 보호되어 있습니다. 비밀번호를 입력하세요.");
        if (inputPwd !== post.password) {
          alert("비밀번호가 틀렸습니다.");
          return;
        }
      }

      currentPostIndex = index;

      document.getElementById("single-title").innerHTML = `
        ${post.title} <br>
        <small>작성일: ${formatDateTime(post.createdAt)}</small>
      `;
      document.getElementById("single-content").textContent = post.content;
      document.getElementById("like-count").textContent = post.likes || 0;

      renderComments();

      document.getElementById("post-list").style.display = "none";
      document.getElementById("write-post").style.display = "none";
      document.getElementById("single-post").classList.remove("hidden");
      document.getElementById("edit-area").classList.add("hidden");
      document.getElementById("single-content").style.display = "block";
    }

    function goBack() {
      if (editing) return alert("편집을 완료하거나 취소하세요.");
      if (editingCommentIndex !== null) return alert("댓글 편집을 완료하거나 취소하세요.");

      currentPostIndex = null;
      document.getElementById("post-list").style.display = "block";
      document.getElementById("write-post").style.display = "block";
      document.getElementById("single-post").classList.add("hidden");
    }

    function deletePost() {
      if (editing) return alert("편집을 완료하거나 취소하세요.");
      if (editingCommentIndex !== null) return alert("댓글 편집을 완료하거나 취소하세요.");

      if (confirm("정말 삭제하시겠습니까?")) {
        posts.splice(currentPostIndex, 1);
        goBack();
        renderPosts();
      }
    }

    function startEdit() {
      if (editing) return;
      if (editingCommentIndex !== null) return alert("댓글 편집을 먼저 완료하세요.");

      editing = true;
      const post = posts[currentPostIndex];
      document.getElementById("edit-title").value = post.title;
      document.getElementById("edit-content").value = post.content;
      document.getElementById("edit-password").value = post.password || "";

      document.getElementById("edit-area").classList.remove("hidden");
      document.getElementById("single-content").style.display = "none";
    }

    function saveEdit() {
      const newTitle = document.getElementById("edit-title").value.trim();
      const newContent = document.getElementById("edit-content").value.trim();
      const newPassword = document.getElementById("edit-password").value;

      if (!newTitle || !newContent) {
        alert("제목과 내용을 모두 입력해주세요.");
        return;
      }
      posts[currentPostIndex].title = newTitle;
      posts[currentPostIndex].content = newContent;
      posts[currentPostIndex].password = newPassword;

      editing = false;
      showPost(currentPostIndex);
      renderPosts();
    }

    function cancelEdit() {
      editing = false;
      document.getElementById("edit-area").classList.add("hidden");
      document.getElementById("single-content").style.display = "block";
    }

    function toggleLike() {
      if (editing) return alert("편집 중에는 좋아요를 누를 수 없습니다.");
      if (editingCommentIndex !== null) return alert("댓글 편집 중에는 좋아요를 누를 수 없습니다.");

      posts[currentPostIndex].likes = (posts[currentPostIndex].likes || 0) + 1;
      document.getElementById("like-count").textContent = posts[currentPostIndex].likes;
      renderPosts();
    }

    // 댓글 기능
    function renderComments() {
      const commentsList = document.getElementById("comments-list");
      commentsList.innerHTML = "";
      const comments = posts[currentPostIndex].comments || [];
      comments.forEach((commentObj, idx) => {
        const div = document.createElement("div");
        div.className = "comment";

        if(editingCommentIndex === idx) {
          // 댓글 편집 중 UI
          div.innerHTML = `
            <textarea id="edit-comment-text" rows="3" style="width:100%; padding:6px;">${commentObj.text}</textarea>
            <button onclick="saveCommentEdit(${idx})">저장</button>
            <button onclick="cancelCommentEdit()">취소</button>
          `;
        } else {
          div.innerHTML = `
            ${commentObj.text} <br>
            <small>작성일: ${formatDateTime(commentObj.createdAt)}</small>
          `;

          // 액션 버튼들 (좋아요, 수정, 삭제)
          const actionsDiv = document.createElement("div");
          actionsDiv.className = "comment-actions";

          // 좋아요 버튼
          const likeBtn = document.createElement("button");
          likeBtn.textContent = `❤️ ${commentObj.likes || 0}`;
          likeBtn.className = "comment-like";
          likeBtn.onclick = (e) => {
            e.stopPropagation();
            toggleCommentLike(idx);
          };
          actionsDiv.appendChild(likeBtn);

          // 수정 버튼
          const editBtn = document.createElement("button");
          editBtn.textContent = "✏️ 수정";
          editBtn.onclick = (e) => {
            e.stopPropagation();
            startCommentEdit(idx);
          };
          actionsDiv.appendChild(editBtn);

          // 삭제 버튼
          const delBtn = document.createElement("button");
          delBtn.textContent = "🗑 삭제";
          delBtn.onclick = (e) => {
            e.stopPropagation();
            deleteComment(idx);
          };
          actionsDiv.appendChild(delBtn);

          div.appendChild(actionsDiv);
        }

        commentsList.appendChild(div);
      });
    }

    function addComment() {
      if (editing) return alert("편집 중에는 댓글을 달 수 없습니다.");
      if (editingCommentIndex !== null) return alert("댓글 편집 중에는 새 댓글을 달 수 없습니다.");

      const input = document.getElementById("comment-input");
      const commentText = input.value.trim();
      if (!commentText) return alert("댓글 내용을 입력하세요.");

      posts[currentPostIndex].comments.push({
        text: commentText,
        likes: 0,
        createdAt: new Date().toISOString()
      });
      input.value = "";
      renderComments();
    }

    // 댓글 좋아요 토글
    function toggleCommentLike(idx) {
      posts[currentPostIndex].comments[idx].likes = (posts[currentPostIndex].comments[idx].likes || 0) + 1;
      renderComments();
    }

    // 댓글 수정 시작
    function startCommentEdit(idx) {
      if (editing) return alert("게시물 편집 중에는 댓글을 수정할 수 없습니다.");
      if (editingCommentIndex !== null) return alert("다른 댓글 편집을 먼저 완료하세요.");

      editingCommentIndex = idx;
      renderComments();
    }

    // 댓글 수정 저장
    function saveCommentEdit(idx) {
      const textarea = document.getElementById("edit-comment-text");
      const newText = textarea.value.trim();
      if (!newText) return alert("댓글 내용을 입력하세요.");

      posts[currentPostIndex].comments[idx].text = newText;
      editingCommentIndex = null;
      renderComments();
    }

    // 댓글 수정 취소
    function cancelCommentEdit() {
      editingCommentIndex = null;
      renderComments();
    }

    // 댓글 삭제
    function deleteComment(idx) {
      if (confirm("댓글을 삭제하시겠습니까?")) {
        posts[currentPostIndex].comments.splice(idx, 1);
        if (editingCommentIndex === idx) editingCommentIndex = null;
        renderComments();
      }
    }

    // 초기 렌더링
    renderPosts();
