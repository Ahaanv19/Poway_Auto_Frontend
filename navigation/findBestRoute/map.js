import { pythonURI, javaURI, fetchOptions, login } from '../../assets/js/api/config.js';

document.getElementById('fetch_routes_btn').addEventListener('click', () => {
    fetchRoutes();
});

async function fetchRoadData() {
    try {
        const response = await fetch('https://opendata.sandag.org/resource/ewu3-gvdq.json');
        return await response.json();
    } catch (error) {
        console.error('Error fetching road data:', error);
        return [];
    }
}

async function fetchRoutes() {
    const origin = document.getElementById('origin').value;
    const destination = document.getElementById('destination').value;
    const resultDiv = document.getElementById('result');

    resultDiv.innerHTML = 'Loading...';

    try {
        const roadData = await fetchRoadData();
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

            data.forEach((route, index) => {
                const routeEl = document.createElement('div');
                const updatedDetails = route.details.map(step => {
                    const matchingRoad = roadData.find(road =>
                        road.street_name && step.instruction.includes(road.street_name)
                    );

                    if (matchingRoad) {
                        const avgSpeed = isAM
                            ? parseFloat(matchingRoad._2023_am_peak_period_mean)
                            : parseFloat(matchingRoad._2023_pm_peak_period_mean);

                        if (avgSpeed && !isNaN(avgSpeed)) {
                            const distanceInMiles = parseFloat(step.distance.split(' ')[0]); // Assuming "X mi" format
                            const updatedDuration = (distanceInMiles / avgSpeed) * 60; // Convert hours to minutes
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

                // Draw route on map if coordinates are available
                if (route.geometry) {
                    const coordinates = decodePolyline(route.geometry);
                    routeLayer = L.polyline(coordinates, {
                        color: getRouteColor(index),
                        weight: 5,
                        opacity: 0.7
                    }).addTo(map);

                    // Fit map to show entire route
                    map.fitBounds(routeLayer.getBounds());
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




// Helper function to get different colors for different routes
function getRouteColor(index) {
    const colors = ['#4CAF50', '#2196F3', '#FFC107', '#9C27B0', '#F44336'];
    return colors[index % colors.length];
}

// Function to decode Google's encoded polyline format
function decodePolyline(encoded) {
    if (!encoded) return [];

    let points = [];
    let index = 0, len = encoded.length;
    let lat = 0, lng = 0;

    while (index < len) {
        let shift = 0, result = 0;

        do {
            let b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (result & 0x20);

        let dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lat += dlat;

        shift = 0;
        result = 0;

        do {
            let b = encoded.charCodeAt(index++) - 63;
            result |= (b & 0x1f) << shift;
            shift += 5;
        } while (result & 0x20);

        let dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
        lng += dlng;

        points.push([lat * 1e-5, lng * 1e-5]);
    }

    return points;
}




// Reverse geocoding function
function reverseGeocode(lat, lon) {
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('origin').value = data.display_name;
        })
        .catch(error => console.error('Error:', error));
}


let map;
let routeLayer;

// Initialize map
document.addEventListener('DOMContentLoaded', function() {
  map = L.map('map');
  
  // Add the base map layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

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
        map.setView([32.7157, -117.1611], 12); // San Diego coordinates
      }
    );
  }
});