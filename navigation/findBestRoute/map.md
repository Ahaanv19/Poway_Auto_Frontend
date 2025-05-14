---
toc: true
layout: post
title: Traffic-Aware Route Finder
permalink: /route/
nav: true
---

<head>
  <link rel="stylesheet" type="text/css" href="{{site.baseurl}}/navigation/findBestRoute/map.css">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
</head>

<body>
  <div class="route-form">
    <h2>Traffic-Aware Route Finder</h2>
    <p style="font-size: 14px; color: gray;">
      Route estimates are dynamically adjusted using real traffic data from San Diego's dataset.
    </p>
    <div class="input-group">
      <label for="origin">Origin:</label>
      <input type="text" id="origin" placeholder="Enter starting point">
    </div>
    <div class="input-group">
      <label for="destination">Destination:</label>
      <input type="text" id="destination" placeholder="Enter destination">
    </div>
    <div class="input-group">
      <label for="mode">Travel Mode:</label>
      <select id="mode">
        <option value="driving">Driving</option>
        <option value="walking">Walking</option>
        <option value="bicycling">Bicycling</option>
        <option value="transit">Transit</option>
      </select>
    </div>
    <button id="fetch_routes_btn">Find Routes</button>
  </div>

  <div id="map"></div>
  <div id="result"></div>

  <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
  <script type="module" src="{{site.baseurl}}/navigation/findBestRoute/map.js"></script>
  <script type="module" src="{{site.baseurl}}/assets/js/api/config.js"></script>
</body>












