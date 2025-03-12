---
layout: page 
title: Book Reading List
permalink: /bookrecommendations
search_exclude: true
show_reading_time: false
---

<link rel="stylesheet" href="/assets/css/styles.css">

<div class="section">
  <h2>Suggest a book to be added to your reading list</h2>
  <input type="text" id="book" placeholder="Enter book title" required>
  <input type="text" id="author" placeholder="Enter author name" required>
  <input type="text" id="genre" placeholder="Enter genre" required>
  <button id="createBookButton">Create</button>

  <h2>All Books</h2>
  <button id="getAllBooksButton">List of Books</button>

  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Title</th>
        <th>Author</th>
        <th>Genre</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody id="booksTableBody">
      <!-- Books will be loaded here -->
    </tbody>
  </table>

  <div id="resultContainer"></div>
</div>

<script type="module">
    import { pythonURI } from "./assets/js/api/config.js";

  document.addEventListener('DOMContentLoaded', () => {
    refreshBookList();
  });

  document.getElementById('getAllBooksButton').addEventListener('click', async () => {
        const tableBody = document.getElementById('booksTableBody');

        try {
            const response = await fetch(`${pythonURI}/api/book`);
            const data = await response.json();
            console.log(data); // Log the response data

            tableBody.innerHTML = ''; // Clear existing rows
            if (Array.isArray(data)) {
                data.forEach(book => {
                    const tr = document.createElement('tr');

                    const idCell = document.createElement('td');
                    const titleCell = document.createElement('td');
                    const authorCell = document.createElement('td');
                    const genreCell = document.createElement('td');
                    const actionCell = document.createElement('td');

                    idCell.innerText = book.id;
                    titleCell.innerText = book.title;
                    authorCell.innerText = book.author;
                    genreCell.innerText = book.genre;

                    // Create Update button
                    const updateBtn = document.createElement('button');
                    updateBtn.innerText = 'Update';
                    updateBtn.onclick = async () => {
                        await updateBook(book.id);
                        refreshBookList();
                    };

                    // Create Delete button
                    const deleteBtn = document.createElement('button');
                    deleteBtn.innerText = 'Delete';
                    deleteBtn.onclick = async () => {
                        await deleteBook(book.id);
                        refreshBookList();
                    };

                    actionCell.appendChild(updateBtn);
                    actionCell.appendChild(deleteBtn);
                    tr.appendChild(idCell);
                    tr.appendChild(titleCell);
                    tr.appendChild(authorCell);
                    tr.appendChild(genreCell);
                    tr.appendChild(actionCell);
                    tableBody.appendChild(tr);
                });
            } else {
                console.error('Unexpected response format:', data); // Log unexpected data
                tableBody.innerHTML = `<p>No books found or unexpected data format.</p>`;
            }
        } catch (error) {
            tableBody.innerHTML = `<p>Error fetching data: ${error.message}</p>`;
            console.error(error); // Log the error for further investigation
        }
    });


    document.getElementById('createBookButton').addEventListener('click', async () => {
        const title = document.getElementById('book').value;
        const author = document.getElementById('author').value;
        const genre = document.getElementById('genre').value;
        const resultContainer = document.getElementById('resultContainer');

        if (!title || !author || !genre) {
            resultContainer.innerHTML = `<p>Please enter all book details.</p>`;
            return;
        }

        try {
            const response = await fetch(`${pythonURI}/api/book`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title, author, genre })
            });

            const data = await response.json();
            if (response.ok) {
                resultContainer.innerHTML = `<p>Book created: ${data.title}</p>`;
                document.getElementById('getAllBooksButton').click(); // Refresh the book list
            } else {
                resultContainer.innerHTML = `<p>Error: ${data.error}</p>`;
            }
        } catch (error) {
            resultContainer.innerHTML = `<p>Error creating book: ${error.message}</p>`;
        }
    });

    function deleteBook(bookId) {
        const resultContainer = document.getElementById('resultContainer');

        fetch(`${pythonURI}/api/book/${bookId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                resultContainer.innerHTML = `<p>Book deleted successfully.</p>`;
                document.getElementById('getAllBooksButton').click(); // Refresh the book list
            } else {
                return response.json().then(data => {
                    throw new Error(data.error);
                });
            }
        })
        .catch(error => {
            resultContainer.innerHTML = `<p>Error deleting book: ${error.message}</p>`;
        });
    }

    function updateBook(bookId) {
        const newTitle = prompt("Enter new title for the book:");
        const newAuthor = prompt("Enter new author for the book:");
        const newGenre = prompt("Enter new genre for the book:");
        if (newTitle && newAuthor && newGenre) {
            fetch(`${pythonURI}/api/book/${bookId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: newTitle, author: newAuthor, genre: newGenre })
            })
            .then(response => response.json())
            .then(data => {
                const resultContainer = document.getElementById('resultContainer');
                if (data) {
                    resultContainer.innerHTML = `<p>Book updated successfully: ${data.title}</p>`;
                    document.getElementById('getAllBooksButton').click(); // Refresh the book list
                }
            })
            .catch(error => {
                const resultContainer = document.getElementById('resultContainer');
                resultContainer.innerHTML = `<p>Error updating book: ${error.message}</p>`;
            });
        }
    }

    // Function to refresh the book list
    async function refreshBookList() {
        // Clear the current book list
        const tableBody = document.getElementById('tableBody');
        tableBody.innerHTML = '';

        // Fetch the updated book list and render it
        const books = await fetchBooks();
        books.forEach(book => {
            // Render each book (similar to the existing code)
            const tr = document.createElement('tr');
            const idCell = document.createElement('td');
            const titleCell = document.createElement('td');
            const authorCell = document.createElement('td');
            const genreCell = document.createElement('td');
            const actionCell = document.createElement('td');

            idCell.innerText = book.id;
            titleCell.innerText = book.title;
            authorCell.innerText = book.author;
            genreCell.innerText = book.genre;

            // Create Update button
            const updateBtn = document.createElement('button');
            updateBtn.innerText = 'Update';
            updateBtn.onclick = async () => {
                await updateBook(book.id);
                refreshBookList();
            };

            // Create Delete button
            const deleteBtn = document.createElement('button');
            deleteBtn.innerText = 'Delete';
            deleteBtn.onclick = async () => {
                await deleteBook(book.id);
                refreshBookList();
            };

            actionCell.appendChild(updateBtn);
            actionCell.appendChild(deleteBtn);
            tr.appendChild(idCell);
            tr.appendChild(titleCell);
            tr.appendChild(authorCell);
            tr.appendChild(genreCell);
            tr.appendChild(actionCell);
            tableBody.appendChild(tr);
        });
    }

    // Function to create a new book
    async function createBook(book) {
        await addBook(book);
        refreshBookList();
    }
</script>