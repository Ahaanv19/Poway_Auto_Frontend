import { pythonURI, javaURI, fetchOptions, login } from '../../assets/js/api/config.js';


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