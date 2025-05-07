import { pythonURI, javaURI, fetchOptions, login } from '../../assets/js/api/config.js';

let map;
let routeLayer = L.layerGroup(); // Initialize as a Leaflet layer group

document.addEventListener('DOMContentLoaded', function () {
  map = L.map('map');

  // Add base map tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Add the route layer group to the map
  routeLayer.addTo(map);

  // Try to get user's location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        map.setView([latitude, longitude], 13);
        L.marker([latitude, longitude])
          .addTo(map)
          .bindPopup('Your Location')
          .openPopup();

        // Auto-fill origin with current location
        reverseGeocode(latitude, longitude);
      },
      () => {
        // Default view if location access is denied
        map.setView([32.7157, -117.1611], 12); // San Diego
      }
    );
  }
});

// Fetch road data once at the top
let cachedRoadData = [];

async function fetchRoadData() {
  try {
    const response = await fetch('https://opendata.sandag.org/resource/ewu3-gvdq.json');
    cachedRoadData = await response.json();
  } catch (error) {
    console.error('Error fetching road data:', error);
    cachedRoadData = [];
  }
}

document.getElementById('fetch_routes_btn').addEventListener('click', () => {
  fetchRoutes();
});

async function fetchRoutes() {
  const origin = document.getElementById('origin').value;
  const destination = document.getElementById('destination').value;
  const resultDiv = document.getElementById('result');

  resultDiv.innerHTML = 'Loading...';

  if (cachedRoadData.length === 0) {
    await fetchRoadData();
  }

  try {
    const response = await fetch(`${pythonURI}/api/get_routes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ origin, destination })
    });
    const data = await response.json();

    if (Array.isArray(data)) {
      resultDiv.innerHTML = '';
      const currentHour = new Date().getHours();
      const isAM = currentHour < 12;

      // Clear any existing routes from the map
      routeLayer.clearLayers();

      data.forEach((route, index) => {
        const routeEl = document.createElement('div');
        const updatedDetails = route.details.map(step => {
          const matchingRoad = cachedRoadData.find(road =>
            road.street_name && step.instruction.includes(road.street_name)
          );

          if (matchingRoad) {
            const avgSpeed = isAM
              ? parseFloat(matchingRoad._2023_am_peak_period_mean)
              : parseFloat(matchingRoad._2023_pm_peak_period_mean);

            if (avgSpeed && !isNaN(avgSpeed)) {
              const distanceInMiles = parseFloat(step.distance.split(' ')[0]);
              const updatedDuration = (distanceInMiles / avgSpeed) * 60;
              return {
                ...step,
                duration: `${updatedDuration.toFixed(2)} mins`
              };
            }
          }
          return step;
        });

        routeEl.innerHTML = `
          <h3>Route ${index + 1}</h3>
          <p><strong>Total Distance:</strong> ${route.total_distance}</p>
          <p><strong>Total Duration:</strong> ${route.total_duration}</p>
          <ol>
            ${updatedDetails.map(step => `
              <li>${step.instruction} (${step.distance}, ${step.duration})</li>
            `).join('')}
          </ol>
          <hr>
        `;
        resultDiv.appendChild(routeEl);

        // Draw the route if geometry is provided
        if (route.geometry) {
          const coordinates = decodePolyline(route.geometry);
          const routeColor = getRouteColor(index);

          const polyline = L.polyline(coordinates, {
            color: routeColor,
            weight: 5,
            opacity: 0.7
          });

          routeLayer.addLayer(polyline); // Add to route group
          map.fitBounds(polyline.getBounds()); // Adjust map view
        }
      });
    } else {
      resultDiv.innerHTML = `<p style="color:red;">Error: ${data.error}</p>`;
    }
  } catch (error) {
    console.error(error);
    resultDiv.innerHTML = '<p style="color:red;">Something went wrong while fetching routes.</p>';
  }
}

// Helper to get different colors
function getRouteColor(index) {
  const colors = ['#4CAF50', '#2196F3', '#FFC107', '#9C27B0', '#F44336'];
  return colors[index % colors.length];
}

// Decode polyline format
function decodePolyline(encoded) {
  if (!encoded) return [];

  let points = [];
  let index = 0, lat = 0, lng = 0;

  while (index < encoded.length) {
    let b, shift = 0, result = 0;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    let dlat = (result & 1) ? ~(result >> 1) : (result >> 1);
    lat += dlat;

    shift = 0;
    result = 0;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    let dlng = (result & 1) ? ~(result >> 1) : (result >> 1);
    lng += dlng;

    points.push([lat * 1e-5, lng * 1e-5]);
  }

  return points;
}

// Reverse geocode current location
function reverseGeocode(lat, lon) {
  fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
    .then(response => response.json())
    .then(data => {
      document.getElementById('origin').value = data.display_name;
    })
    .catch(error => console.error('Error:', error));
}






