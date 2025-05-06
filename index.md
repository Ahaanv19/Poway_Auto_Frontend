---
layout: base
title: Best Route
search_exclude: true
nav: true
hide: true
menu: nav/home.html
---


<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Best Route - QCOMM Auto </title>

  <!-- External Stylesheets -->
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />

  <!-- Page Styles -->
  <style>
    body {
      background: linear-gradient(to bottom right, white, #f9fafb);
    }

    .dark body {
      background: linear-gradient(to bottom right, #1f2937, #2d3748);
    }

    #map {
      height: 400px;
      margin-top: 20px;
      border-radius: 10px;
      border: 2px solid #add8e6;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }

    .parallax-blob {
      position: absolute;
      top: -100px;
      left: -100px;
      width: 500px;
      height: 500px;
      border-radius: 50%;
      opacity: 0.2;
      filter: blur(48px);
      animation: pulse 2s infinite;
    }

    lottie-player {
      width: 100%;
      height: 300px;
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 0.2;
      }
      50% {
        opacity: 0.4;
      }
    }
  </style>

  <!-- External Scripts -->
  <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
</head>

<body>

  <main class="relative overflow-hidden">

    <!-- Parallax Background Blob -->
    <div class="parallax-blob bg-purple-300 dark:bg-purple-700"></div>

    <!-- Hero Section -->
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
          loop
          autoplay>
        </lottie-player>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="px-6">
      <div class="grid grid-cols-1 gap-3 text-sm text-gray-700 dark:text-gray-200">
        <a href="/QAV_Frontend/" class="block px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          🏠 Home
        </a>
        <a href="/QAV_Frontend/route/" class="block px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          🧭 Find Best Route
        </a>
        <a href="/QAV_Frontend/favoriteLocations/" class="block px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition">
        🏠 Favorite Locations
        </a>
        <a href="/QAV_Frontend/routine/" class="block px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition">
        🏠 Daily Routine
        </a>
      </div>
    </nav>

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

  <!-- Map Container -->
  <div id="map"></div>

  <!-- JavaScript -->
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const map = L.map('map');

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            map.setView([latitude, longitude], 13);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              maxZoom: 19,
              attribution: '© OpenStreetMap contributors'
            }).addTo(map);

            L.marker([latitude, longitude]).addTo(map)
              .bindPopup('You are here!')
              .openPopup();
          },
          () => {
            alert('Location access denied. Defaulting to Paris.');
            // Optionally set a fallback location here
          },
          { enableHighAccuracy: true }
        );
      } else {
        alert('Geolocation is not supported by your browser.');
      }
    });
  </script>

</body>
</html>
