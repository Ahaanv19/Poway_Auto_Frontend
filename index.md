---
layout: base
title: Best Route
search_exclude: true
hide: true
menu: nav/home.html
---

<main class="relative overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">

  <!-- Parallax background blob -->
  <div class="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-purple-300 dark:bg-purple-700 opacity-20 rounded-full blur-3xl animate-pulse"></div>

  <div class="relative z-10 max-w-7xl mx-auto px-6 py-24 flex flex-col md:flex-row items-center justify-between gap-12">
    <!-- Text Content -->
    <div class="flex-1 text-center md:text-left space-y-8">
      <h1 class="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-gradient-x">
        Drive the Future <br> with QCOMM Auto
      </h1>
      <p class="text-lg text-gray-600 dark:text-gray-300 max-w-xl">
        Where autonomy meets intelligence. Built by engineers, driven by innovation.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
        <a href="#get-started" class="px-6 py-3 rounded-full text-white bg-primary hover:bg-secondary font-medium text-base shadow-lg transition transform hover:scale-105">
          Get Started 🚗
        </a>
        <a href="#learn-more" class="px-6 py-3 rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-white font-medium text-base transition">
          Learn More
        </a>
      </div>
    </div>  
    <!-- Lottie Animation -->
    <div class="flex-1">
      <lottie-player
        src="https://assets10.lottiefiles.com/packages/lf20_kyu7xb1v.json"
        background="transparent"
        speed="1"
        style="width: 100%; height: 300px;"
        loop
        autoplay>
      </lottie-player>
    </div>

  </div>

  <!-- Stats Section -->
  <section class="bg-white dark:bg-gray-900 py-12 border-t border-gray-200 dark:border-gray-700">
    <div class="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 text-center gap-8 px-6">
      <div>
        <h3 class="text-3xl font-bold text-primary">99.99%</h3>
        <p class="text-gray-600 dark:text-gray-300">System Uptime</p>
      </div>
      <div>
        <h3 class="text-3xl font-bold text-primary">+120</h3>
        <p class="text-gray-600 dark:text-gray-300">Autonomous Features</p>
      </div>
      <div>
        <h3 class="text-3xl font-bold text-primary">∞</h3>
        <p class="text-gray-600 dark:text-gray-300">Innovation Potential</p>
      </div>
    </div>
  </section>

</main>

<!-- Add these in your HTML head section -->
<!-- Leaflet CSS & JS -->
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>

<!-- Add input box for destination -->
<input type="text" id="destination" placeholder="Enter destination (e.g., Eiffel Tower)" />
<button onclick="getDirections()">Get Directions</button>

<!-- Map container -->
<div id="map"></div>

<script>
let map, userMarker, routeLayer;
const apiKey = 'YOUR_OPENROUTESERVICE_API_KEY'; // Get from OpenRouteService

document.addEventListener('DOMContentLoaded', function() {
    map = L.map('map').setView([48.8566, 2.3522], 13);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Get user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                map.setView([latitude, longitude], 13);

                userMarker = L.marker([latitude, longitude]).addTo(map)
                    .bindPopup('You are here!')
                    .openPopup();
            },
            () => alert('Location access denied. Defaulting to Paris.'),
            { enableHighAccuracy: true }
        );
    } else {
        alert('Geolocation is not supported by your browser.');
    }
});

// Function to get directions
async function getDirections() {
    const destination = document.getElementById('destination').value;
    if (!destination) {
        alert('Please enter a destination!');
        return;
    }

    // Convert destination name to coordinates using OpenRouteService
    const geocodeUrl = `https://api.openrouteservice.org/geocode/search?api_key=${apiKey}&text=${destination}`;
    const geocodeRes = await fetch(geocodeUrl);
    const geocodeData = await geocodeRes.json();
    
    if (!geocodeData.features.length) {
        alert('Location not found! Try a different name.');
        return;
    }

    const destCoords = geocodeData.features[0].geometry.coordinates;
    const destLat = destCoords[1], destLng = destCoords[0];

    // Get user's location
    navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        // Request route
        const routeUrl = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${longitude},${latitude}&end=${destLng},${destLat}`;
        const routeRes = await fetch(routeUrl);
        const routeData = await routeRes.json();

        if (!routeData.routes) {
            alert('Could not get directions.');
            return;
        }

        // Remove old route
        if (routeLayer) map.removeLayer(routeLayer);

        // Draw new route
        const routeCoords = routeData.routes[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
        routeLayer = L.polyline(routeCoords, { color: 'blue', weight: 5 }).addTo(map);

        // Fit map to route
        map.fitBounds(routeLayer.getBounds());

        // Add destination marker
        L.marker([destLat, destLng]).addTo(map)
            .bindPopup(`Destination: ${destination}`)
            .openPopup();
    }, () => alert('Location access denied.'));
}
</script>

<style>
#map {
    height: 400px;
    margin-top: 20px;
    border-radius: 10px;
    border: 2px solid #add8e6;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
input {
    padding: 10px;
    margin: 10px;
    width: 250px;
    border: 1px solid #ccc;
    border-radius: 5px;
}
button {
    padding: 10px 15px;
    border: none;
    background: #007bff;
    color: white;
    cursor: pointer;
    border-radius: 5px;
}
</style>
