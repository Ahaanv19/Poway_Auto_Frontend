---
layout: post 
title: Literary Awards Tracker
search_exclude: true
permalink: /literaryawards
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

  #bookTitleInput, #awardNameInput, #yearInput, #categoryInput, #resultInput {
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
  <h2>Manage Literary Awards</h2>
  <input type="text" id="bookTitleInput" placeholder="Enter book title" required>
  <input type="text" id="awardNameInput" placeholder="Enter award name" required>
  <input type="text" id="yearInput" placeholder="Enter year" required>
  <input type="text" id="categoryInput" placeholder="Enter category" required>
  <input type="text" id="resultInput" placeholder="Enter result" required>
  <button id="createAwardButton">Add Award</button>

  <h2>All Awards</h2>
  <button id="getAllAwardsButton">List of Awards</button>

  <div id="resultContainer"></div>
  
  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>Book Title</th>
        <th>Award Name</th>
        <th>Year</th>
        <th>Category</th>
        <th>Result</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody id="awardTable">
      <!-- JavaScript generated data -->
    </tbody>
  </table>
</div>

<script type="module">
    import { pythonURI } from "./assets/js/api/config.js";

    document.getElementById('createAwardButton').addEventListener('click', async () => {
        const bookTitle = document.getElementById('bookTitleInput').value;
        const awardName = document.getElementById('awardNameInput').value;
        const year = document.getElementById('yearInput').value;
        const category = document.getElementById('categoryInput').value;
        const result = document.getElementById('resultInput').value;
        const resultContainer = document.getElementById('resultContainer');

        if (!bookTitle || !awardName || !year || !category || !result) {
            resultContainer.innerHTML = '<p>Please fill all fields.</p>';
            return;
        }

        try {
            const response = await fetch(`${pythonURI}/api/awards`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ book_title: bookTitle, award_name: awardName, year, category, result })
            });

            const data = await response.json();
            if (response.ok) {
                resultContainer.innerHTML = `<p>Award added: ${data.book_title}</p>`;
                document.getElementById('getAllAwardsButton').click(); // Refresh the awards list
            } else {
                resultContainer.innerHTML = `<p>Error: ${data.error}</p>`;
            }
        } catch (error) {
            resultContainer.innerHTML = `<p>Error creating award: ${error.message}</p>`;
        }
    });

    document.getElementById('getAllAwardsButton').addEventListener('click', async () => {
        const awardTableBody = document.getElementById('awardTable');

        try {
            const response = await fetch(`${pythonURI}/api/awards`);
            const data = await response.json();

            awardTableBody.innerHTML = ''; // Clear existing rows
            if (Array.isArray(data)) {
                data.forEach(award => {
                    const tr = document.createElement('tr');

                    const idCell = document.createElement('td');
                    const bookTitleCell = document.createElement('td');
                    const awardNameCell = document.createElement('td');
                    const yearCell = document.createElement('td');
                    const categoryCell = document.createElement('td');
                    const resultCell = document.createElement('td');
                    const actionCell = document.createElement('td');

                    idCell.innerText = award.id;
                    bookTitleCell.innerText = award.book_title;
                    awardNameCell.innerText = award.award_name;
                    yearCell.innerText = award.year;
                    categoryCell.innerText = award.category;
                    resultCell.innerText = award.result;

                    // Create Update button
                    const updateBtn = document.createElement('button');
                    updateBtn.innerText = 'Update';
                    updateBtn.onclick = () => updateAward(award);

                    // Create Delete button
                    const deleteBtn = document.createElement('button');
                    deleteBtn.innerText = 'Delete';
                    deleteBtn.onclick = () => deleteAward(award.id);

                    actionCell.appendChild(updateBtn);
                    actionCell.appendChild(deleteBtn);
                    tr.appendChild(idCell);
                    tr.appendChild(bookTitleCell);
                    tr.appendChild(awardNameCell);
                    tr.appendChild(yearCell);
                    tr.appendChild(categoryCell);
                    tr.appendChild(resultCell);
                    tr.appendChild(actionCell);
                    awardTableBody.appendChild(tr);
                });
            } else {
                awardTableBody.innerHTML = '<tr><td colspan="7">No awards found or unexpected data format.</td></tr>';
            }
        } catch (error) {
            console.error(error);
            resultContainer.innerHTML = `<p>Error fetching awards: ${error.message}</p>`;
        }
    });

    function deleteAward(awardId) {
        const resultContainer = document.getElementById('resultContainer');

        fetch(`${pythonURI}/api/awards/${awardId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                resultContainer.innerHTML = '<p>Award deleted successfully.</p>';
                document.getElementById('getAllAwardsButton').click(); // Refresh the awards list
            } else {
                return response.json().then(data => {
                    throw new Error(data.error);
                });
            }
        })
        .catch(error => {
            resultContainer.innerHTML = `<p>Error deleting award: ${error.message}</p>`;
        });
    }

    function updateAward(award) {
        const newBookTitle = prompt("Enter new book title:", award.book_title);
        const newAwardName = prompt("Enter new award name:", award.award_name);
        const newYear = prompt("Enter new year:", award.year);
        const newCategory = prompt("Enter new category:", award.category);
        const newResult = prompt("Enter new result:", award.result);

        if (newBookTitle && newAwardName && newYear && newCategory && newResult) {
            fetch(`${pythonURI}/api/awards/${award.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ book_title: newBookTitle, award_name: newAwardName, year: newYear, category: newCategory, result: newResult })
            })
            .then(response => response.json())
            .then(data => {
                const resultContainer = document.getElementById('resultContainer');
                if (data) {
                    resultContainer.innerHTML = `<p>Award updated successfully: ${data.book_title}</p>`;
                    document.getElementById('getAllAwardsButton').click(); // Refresh the awards list
                }
            })
            .catch(error => {
                const resultContainer = document.getElementById('resultContainer');
                resultContainer.innerHTML = `<p>Error updating award: ${error.message}</p>`;
            });
        }
    }
</script>
