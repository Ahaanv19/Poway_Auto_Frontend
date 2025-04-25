import { pythonURI, javaURI, fetchOptions, login } from '../../assets/js/api/config.js';

document.getElementById('new-location-button').addEventListener('click', () => {
  showNewLocationPopup();
});

function showNewLocationPopup() {
  // Create the popup container
  const popup = document.createElement('div');
  popup.className = 'popup';

  // Create the popup content
  popup.innerHTML = `
    <div class="popup-content">
      <button class="popup-close">&times;</button>
      <h2>Add New Location</h2>
      <input type="text" id="new-location-name" placeholder="Enter name" />
      <input type="text" id="new-location-address" placeholder="Enter address" />
      <div>
        <button class="popup-cancel">Cancel</button>
        <button class="popup-submit">Submit</button>
      </div>
    </div>
  `;

  // Add event listener to close button
  popup.querySelector('.popup-close').addEventListener('click', () => {
    document.body.removeChild(popup);
  });

  // Add event listener to cancel button
  popup.querySelector('.popup-cancel').addEventListener('click', () => {
    document.body.removeChild(popup);
  });

  // Add event listener to submit button
  popup.querySelector('.popup-submit').addEventListener('click', async () => {
    const name = document.getElementById('new-location-name').value.trim();
    const address = document.getElementById('new-location-address').value.trim();

    if (name && address) {
      await createScores(name, address); // Use the existing function to post data
      document.body.removeChild(popup); // Close the popup
      populateScores(); // Refresh the grid
    } else {
      alert('Please fill in both fields.');
    }
  });

  // Append the popup to the body
  document.body.appendChild(popup);
}

async function populateScores() {
  const grid = document.getElementById('locations-grid');
  grid.innerHTML = ''; // Clear existing content

  let scores = await filterForUsername(await readScores());

  scores.forEach(location => {
    const square = document.createElement('button'); // Make it a button
    square.className = 'location-square';
    square.textContent = location.user_name; // Assuming "user_name" is the key in the JSON data
    square.addEventListener('click', () => showPopup(location)); // Add click event to show popup
    grid.appendChild(square);
  });
}

async function filterForUsername(scores) {
  const currentUserResponse = await fetch(`${pythonURI}/api/user`, fetchOptions);
  if (!currentUserResponse.ok) throw new Error('Failed to fetch current user');
  const currentUser = await currentUserResponse.json();
  let userName = currentUser.name;

  return (scores.filter((entry) => String(entry.username) === String(userName)));
}

function showPopup(location) {
  // Create the popup container
  const popup = document.createElement('div');
  popup.className = 'popup';

  // Create the popup content
  popup.innerHTML = `
    <div class="popup-content">
      <button class="popup-close">&times;</button>
      <p><strong>Name:</strong> <span id="location-name">${location.user_name}</span></p>
      <p><strong>Address:</strong> <span id="location-address">${location.user_address}</span></p>
      <div>
        <button class="popup-delete">Delete</button>
        <button class="popup-edit">Edit</button>
      </div>
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

  // Add event listener to edit button
  const editButton = popup.querySelector('.popup-edit');
  editButton.addEventListener('click', () => {
    const nameSpan = document.getElementById('location-name');
    const addressSpan = document.getElementById('location-address');

    if (editButton.textContent === 'Edit') {
      // Change to editable fields
      nameSpan.innerHTML = `<input type="text" id="edit-location-name" value="${location.user_name}" />`;
      addressSpan.innerHTML = `<input type="text" id="edit-location-address" value="${location.user_address}" />`;
      editButton.textContent = 'Submit'; // Change button text to "Submit"
    } else {
      // Submit the updated data
      const updatedName = document.getElementById('edit-location-name').value.trim();
      const updatedAddress = document.getElementById('edit-location-address').value.trim();

      if (updatedName && updatedAddress) {
        updateScores(location.id, updatedAddress, updatedName).then(() => {
          document.body.removeChild(popup); // Close the popup
          populateScores(); // Refresh the grid
        }).catch(error => {
          alert('Error updating location: ' + error.message);
        });
      } else {
        alert('Please fill in both fields.');
      }
    }
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
      body: JSON.stringify(locationData),
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
    const response = await fetch(`${pythonURI}/api/saved_locations`, {
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