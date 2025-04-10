import { pythonURI, javaURI, fetchOptions, login } from '../../assets/js/api/config.js';

async function populateScores() {
  const grid = document.getElementById('locations-grid');
  grid.innerHTML = ''; // Clear existing content

  let scores = await readScores();

  scores.forEach(location => {
    const square = document.createElement('button'); // Make it a button
    square.className = 'location-square';
    square.textContent = location.user_name; // Assuming "user_name" is the key in the JSON data
    square.addEventListener('click', () => showPopup(location)); // Add click event to show popup
    grid.appendChild(square);
  });
}

function showPopup(location) {
  // Create the popup container
  const popup = document.createElement('div');
  popup.className = 'popup';

  // Create the popup content
  popup.innerHTML = `
    <div class="popup-content">
      <button class="popup-close">&times;</button>
      <p><strong>Name:</strong> ${location.user_name}</p>
      <p><strong>Address:</strong> ${location.user_address}</p>
      <button class="popup-delete">Delete</button>
    </div>
  `;

  // Add event listener to close button
  popup.querySelector('.popup-close').addEventListener('click', () => {
    document.body.removeChild(popup);
  });

  // Add event listener to delete button
  popup.querySelector('.popup-delete').addEventListener('click', async () => {
    await deleteScores(location.id); // Assuming "id" is the key for the location ID
    document.body.removeChild(popup); // Close the popup
    populateScores(); // Refresh the grid
  });

  // Append the popup to the body
  document.body.appendChild(popup);
}

async function readScores() {
    try {  
      const scoresResponse = await fetch(`${pythonURI}/api/saved_locations`, fetchOptions);
      if (!scoresResponse.ok) throw new Error('Failed to fetch locations');
      const scores = await scoresResponse.json();
  
      return (scores);
  
    } catch (error) {
      console.error('Error fetching locations:', error);
      alert('Error fetching locations: ' + error.message);
      return null;
    }
  }
  
  
  async function createScores(inputName, inputAddress) {
  
    const locationData = {
      address: inputAddress,
      name: inputName
    };
  
    try {
      const response = await fetch(`${pythonURI}/api/saved_locations`, {
        ...fetchOptions,
        method: 'POST',
        body: JSON.stringify(scoreData),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to submit location: ${response.statusText}`);
      }
  
      const result = await response.json();
      return (result);

    } catch (error) {
      console.error('Error submitting location:', error);
      alert('Error submitting location: ' + error.message);
      return null;
    }
  }
  
  
  async function deleteScores(inputId) {
  
    const scoreData = {
      id: inputId
    }
  
    try {
      const response = await fetch(`${pythonURI}/api/saved_locations`, {
        ...fetchOptions,
        method: 'DELETE',
        body: JSON.stringify(scoreData),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to delete location: ${response.statusText}`);
      }

      const result = await response.json();
      return (result);

    }
    catch (error) {
      console.error('Error deleting location:', error);
      alert('Error deleting location: ' + error.message);
      return null;
    }
  }
  
  async function updateScores(inputId, inputAddress, inputName) {
    const scoreData = {
      id: inputId,
      address: inputAddress,
      name: inputName
    }
  
    try {
      const response = await fetch(`${pythonURI}/api/binaryLearningGameScores`, {
        ...fetchOptions,
        method: 'PUT',
        body: JSON.stringify(scoreData),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to update location: ${response.statusText}`);
      }

      const result = await response.json();
      return (result);
    }
  
    catch (error) {
        console.error('Error updating location:', error);
        alert('Error updating location: ' + error.message);
    }
  }



document.addEventListener('DOMContentLoaded', populateScores);