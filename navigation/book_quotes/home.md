---
layout: post 
title: Book Quotes Manager
search_exclude: true
permalink: /bookquotes
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

  #quoteInput, #bookInput, #authorInput {
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
  <h2>Manage Book Quotes</h2>
  <input type="text" id="quoteInput" placeholder="Enter quote text" required>
  <input type="text" id="bookInput" placeholder="Enter book title" required>
  <input type="text" id="authorInput" placeholder="Enter author name">
  <button id="createQuoteButton">Add Quote</button>

  <h2>All Quotes</h2>
  <button id="getAllQuotesButton">List of Quotes</button>

  <div id="resultContainer"></div>
  
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Quote</th>
        <th>Book</th>
        <th>Author</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody id="quoteTable">
      <!-- JavaScript generated data -->
    </tbody>
  </table>
</div>

<script type="module">
    import { pythonURI } from "./assets/js/api/config.js";

    document.getElementById('createQuoteButton').addEventListener('click', async () => {
        const quoteText = document.getElementById('quoteInput').value;
        const bookTitle = document.getElementById('bookInput').value;
        const authorName = document.getElementById('authorInput').value;
        const resultContainer = document.getElementById('resultContainer');

        if (!quoteText || !bookTitle) {
            resultContainer.innerHTML = '<p>Please enter quote text and book title.</p>';
            return;
        }

        try {
            const response = await fetch(`${pythonURI}/api/quotes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: quoteText, book: bookTitle, author: authorName })
            });

            const data = await response.json();
            if (response.ok) {
                resultContainer.innerHTML = `<p>Quote added: ${data.text}</p>`;
                document.getElementById('getAllQuotesButton').click(); // Refresh the quotes list
            } else {
                resultContainer.innerHTML = `<p>Error: ${data.error}</p>`;
            }
        } catch (error) {
            resultContainer.innerHTML = `<p>Error creating quote: ${error.message}</p>`;
        }
    });

    document.getElementById('getAllQuotesButton').addEventListener('click', async () => {
        const quoteTableBody = document.getElementById('quoteTable');

        try {
            const response = await fetch(`${pythonURI}/api/quotes`);
            const data = await response.json();

            quoteTableBody.innerHTML = ''; // Clear existing rows
            if (Array.isArray(data)) {
                data.forEach(quote => {
                    const tr = document.createElement('tr');

                    const idCell = document.createElement('td');
                    const textCell = document.createElement('td');
                    const bookCell = document.createElement('td');
                    const authorCell = document.createElement('td');
                    const actionCell = document.createElement('td');

                    idCell.innerText = quote.id;
                    textCell.innerText = quote.text;
                    bookCell.innerText = quote.book;
                    authorCell.innerText = quote.author;

                    // Create Update button
                    const updateBtn = document.createElement('button');
                    updateBtn.innerText = 'Update';
                    updateBtn.onclick = () => updateQuote(quote);

                    // Create Delete button
                    const deleteBtn = document.createElement('button');
                    deleteBtn.innerText = 'Delete';
                    deleteBtn.onclick = () => deleteQuote(quote.id);

                    actionCell.appendChild(updateBtn);
                    actionCell.appendChild(deleteBtn);
                    tr.appendChild(idCell);
                    tr.appendChild(textCell);
                    tr.appendChild(bookCell);
                    tr.appendChild(authorCell);
                    tr.appendChild(actionCell);
                    quoteTableBody.appendChild(tr);
                });
            } else {
                quoteTableBody.innerHTML = '<tr><td colspan="5">No quotes found or unexpected data format.</td></tr>';
            }
        } catch (error) {
            console.error(error);
            resultContainer.innerHTML = `<p>Error fetching quotes: ${error.message}</p>`;
        }
    });

    function deleteQuote(quoteId) {
        const resultContainer = document.getElementById('resultContainer');

        fetch(`${pythonURI}/api/quotes/${quoteId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                resultContainer.innerHTML = '<p>Quote deleted successfully.</p>';
                document.getElementById('getAllQuotesButton').click(); // Refresh the quotes list
            } else {
                return response.json().then(data => {
                    throw new Error(data.error);
                });
            }
        })
        .catch(error => {
            resultContainer.innerHTML = `<p>Error deleting quote: ${error.message}</p>`;
        });
    }

    function updateQuote(quote) {
        const newQuoteText = prompt("Enter new quote text:", quote.text);
        const newAuthor = prompt("Enter new author name:", quote.author);
        const newBook = prompt("Enter new book title:", quote.book);

        if (newQuoteText && newAuthor && newBook) {
            fetch(`${pythonURI}/api/quotes/${quote.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: newQuoteText, author: newAuthor, book: newBook })
            })
            .then(response => response.json())
            .then(data => {
                const resultContainer = document.getElementById('resultContainer');
                if (data) {
                    resultContainer.innerHTML = `<p>Quote updated successfully: ${data.text}</p>`;
                    document.getElementById('getAllQuotesButton').click(); // Refresh the quotes list
                }
            })
            .catch(error => {
                const resultContainer = document.getElementById('resultContainer');
                resultContainer.innerHTML = `<p>Error updating quote: ${error.message}</p>`;
            });
        }
    }
</script>
