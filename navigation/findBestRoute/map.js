import { pythonURI } from '../../assets/js/api/config.js';
import polyline from 'https://cdn.skypack.dev/@mapbox/polyline';

const apiUrl = `${pythonURI}/api/get_routes`;

const map = L.map('map').setView([32.7157, -117.1611], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors',
}).addTo(map);

let polylines = [];

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(position => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    map.setView([lat, lon], 13);
  });
}

document.getElementById('fetch_routes_btn').addEventListener('click', async () => {
  const origin = document.getElementById('origin').value;
  const destination = document.getElementById('destination').value;
  const mode = document.getElementById('mode').value || 'driving';

  if (!origin || !destination) {
    alert('Please enter both origin and destination.');
    return;
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ origin, destination, mode }),
  });

  const routes = await response.json();
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = '';

  if (!Array.isArray(routes)) {
    resultDiv.innerHTML = `<p>Error: ${routes.error || 'No routes found'}</p>`;
    return;
  }

  polylines.forEach(p => map.removeLayer(p));
  polylines = [];

  routes.forEach((route, idx) => {
    const header = document.createElement('h4');
    header.textContent = `Route ${idx + 1} - ${route.total_distance} - Est. Time: ${route.traffic_adjusted_duration || route.total_duration}`;
    resultDiv.appendChild(header);

    const ul = document.createElement('ul');
    route.details.forEach(step => {
      const li = document.createElement('li');
      li.innerHTML = `${step.instruction} - ${step.distance} (${step.duration})`;
      ul.appendChild(li);
    });
    resultDiv.appendChild(ul);

    if (route.geometry) {
      const decoded = polyline.decode(route.geometry);
      const polylineLayer = L.polyline(decoded, {
        color: idx === 0 ? 'blue' : 'gray',
        weight: 4,
        opacity: 0.8,
      }).addTo(map);
      polylines.push(polylineLayer);
      if (idx === 0) map.fitBounds(polylineLayer.getBounds());
    }
  });
});














