---
layout: post 
title: Book Adaptation Checker
search_exclude: true
permalink: /bookadaptationchecker
---
<style>
  body {
    background-color: #0056A8 !important;
    font-family: Lato, sans-serif !important; 
    color: black !important; 
    margin: 0;
    padding: 20px;
  }

  h2 {
    font-size: 24px; 
    text-align: center; 
    color: #2c3e50; 
  }

  .section {
    background-color: #5070AF !important;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px; 
  }

  #searchInput, #book {
    width: 100%;
    max-width: 400px; 
    padding: 10px; 
    margin: 10px auto; 
    display: block; 
    border: 2px solid #3498db; 
    border-radius: 5px; 
    font-size: 16px; 
  }

  button {
    background-color: #3498db !important; 
    color: white;
    border: none; 
    border-radius: 5px;
    padding: 10px 20px; 
    font-size: 16px; 
    cursor: pointer; 
    margin: 10px auto;
    display: block; 
  }

  button:hover {
    background-color: #1C1CAF; 
  }

  #resultContainer {
    margin-top: 20px; 
    padding: 10px; 
    border: 2px solid #3498db; 
    border-radius: 5px; 
    background-color: black; 
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }

  th, td {
    border: 1px solid #3498db;
    padding: 8px;
    text-align: center;
  }

  th {
    background-color: #3498db; 
    color: white;
  }
</style>

<div class="section">
  <h2>Enter a book below and click "Search" to check if there has been a film adaptation</h2>
  <input type="text" id="searchInput" placeholder="Enter book title">
  <button id="searchButton">Search</button>

  <h2>All Movies</h2>
  <button id="getAllMoviesButton">List of Books with Movie Adaptations</button>
  <div id="resultContainer"></div>
</div>

<div class="section">
  <h2>Suggest a book to be added to the list of Book Adaptations</h2>
  <input type="text" id="book" placeholder="Enter book title" required>
  <button id="createBookButton">Create</button>

  <h2>All Books</h2>
  <button id="getAllBooksButton">List of Books</button>

  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Title</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody id="table">
      <!-- JavaScript generated data -->
    </tbody>
  </table>
</div>

<script type="module">
    import { pythonURI } from "./assets/js/api/config.js";

    document.getElementById('searchButton').addEventListener('click', async () => {
        const title = document.getElementById('searchInput').value;
        const resultContainer = document.getElementById('resultContainer');
        
        try {
            const response = await fetch(`${pythonURI}/movies/search?title=${encodeURIComponent(title)}`);
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Unexpected response format');
            }
            const data = await response.json();

            if (response.ok) {
                resultContainer.innerHTML = `<h3>Found:</h3><p>${data.title}</p>`;
            } else {
                resultContainer.innerHTML = `<p>${data.message}</p>`;
            }
        } catch (error) {
            resultContainer.innerHTML = `<p>Error fetching data: ${error.message}</p>`;
        }
    });

    document.getElementById('getAllMoviesButton').addEventListener('click', async () => {
        const resultContainer = document.getElementById('resultContainer');

        try {
            const response = await fetch(`${pythonURI}/movies`);
            const data = await response.json();
            console.log(data); // Inspect the data structure

            resultContainer.innerHTML = '<h3>All Movies:</h3>';
            if (Array.isArray(data)) {
                data.forEach(movie => {
                    resultContainer.innerHTML += `<p>${movie.title}</p>`;
                });
            } else {
                resultContainer.innerHTML += `<p>No movies found or unexpected data format.</p>`;
            }
        } catch (error) {
            resultContainer.innerHTML = `<p>Error fetching data: ${error.message}</p>`;
            console.error(error); // Log the error for further investigation
        }
    });

    document.getElementById('getAllBooksButton').addEventListener('click', async () => {
        const tableBody = document.getElementById('table');

        try {
            const response = await fetch(`${pythonURI}/api/books`);
            const data = await response.json();
            console.log(data); // Log the response data

            tableBody.innerHTML = ''; // Clear existing rows
            if (Array.isArray(data)) {
                data.forEach(book => {
                    const tr = document.createElement('tr');

                    const idCell = document.createElement('td');
                    const titleCell = document.createElement('td');
                    const actionCell = document.createElement('td');

                    idCell.innerText = book.id;
                    titleCell.innerText = book.title;

                    // Create Update button
                    const updateBtn = document.createElement('button');
                    updateBtn.innerText = 'Update';
                    updateBtn.onclick = () => updateBook(book.id);

                    // Create Delete button
                    const deleteBtn = document.createElement('button');
                    deleteBtn.innerText = 'Delete';
                    deleteBtn.onclick = () => deleteBook(book.id);

                    actionCell.appendChild(updateBtn);
                    actionCell.appendChild(deleteBtn);
                    tr.appendChild(idCell);
                    tr.appendChild(titleCell);
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
        const resultContainer = document.getElementById('resultContainer');

        if (!title) {
            resultContainer.innerHTML = `<p>Please enter a book title.</p>`;
            return;
        }

        try {
            const response = await fetch(`${pythonURI}/api/books`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title })
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

        fetch(`${pythonURI}/api/books/${bookId}`, {
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
        if (newTitle) {
            fetch(`${pythonURI}/api/books/${bookId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: newTitle })
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
</script>
