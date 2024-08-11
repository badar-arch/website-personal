document.addEventListener('DOMContentLoaded', () => {
    const commentsContainer = document.getElementById('comments');
    const commentForm = document.getElementById('comment-form');
    const userNameInput = document.getElementById('user-name');
    const submitUserNameBtn = document.getElementById('submit-user-name');

    // Reset current user on page load
    localStorage.removeItem('currentUser');
    userNameInput.value = '';

    // Function to load and display comments
    const loadComments = () => {
        try {
            const comments = JSON.parse(localStorage.getItem('comments')) || [];
            const currentUser = localStorage.getItem('currentUser');
            commentsContainer.innerHTML = comments.map(comment => `
                <div class="comment">
                    <div class="comment-author">${comment.author}</div>
                    <div class="comment-text">${comment.text}</div>
                    ${currentUser && comment.author === currentUser ? 
                    `<button class="delete-button" data-id="${comment.id}">Hapus</button>` : ''}
                </div>
            `).join('');
            attachDeleteEventListeners();
        } catch (error) {
            console.error('Error loading comments:', error);
        }
    };

    // Function to save comments to localStorage
    const saveComments = (comments) => {
        try {
            localStorage.setItem('comments', JSON.stringify(comments));
        } catch (error) {
            console.error('Error saving comments:', error);
        }
    };

    // Function to add a new comment
    const addComment = (author, text) => {
        try {
            const comments = JSON.parse(localStorage.getItem('comments')) || [];
            const newComment = {
                id: Date.now(), // Unique ID based on timestamp
                author,
                text
            };
            comments.push(newComment);
            saveComments(comments);
            loadComments();
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    // Function to delete a comment by ID
    const deleteComment = (id) => {
        try {
            const comments = JSON.parse(localStorage.getItem('comments')) || [];
            const updatedComments = comments.filter(comment => comment.id !== id);
            saveComments(updatedComments);
            loadComments();
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    // Attach delete event listeners to all delete buttons
    const attachDeleteEventListeners = () => {
        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const commentId = parseInt(event.target.getAttribute('data-id'), 10);
                deleteComment(commentId);
            });
        });
    };

    // Handle comment form submission
    commentForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const author = userNameInput.value.trim();
        const text = document.getElementById('comment-text').value.trim();
        if (author && text) {
            addComment(author, text);
            document.getElementById('comment-text').value = ''; // Clear textarea
        }
    });

    // Handle username submission
    submitUserNameBtn.addEventListener('click', () => {
        const userName = userNameInput.value.trim();
        if (userName) {
            localStorage.setItem('currentUser', userName);
            loadComments(); // Reload comments to reflect changes
        }
    });

    // Initial load of comments
    loadComments();
});
