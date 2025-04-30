---
toc: true
layout: post
title: Traffic-Aware Route Finder
permalink: /route/
nav: true
---

<head>
  <link rel="stylesheet" type="text/css" href="{{site.baseurl}}/navigation/findBestRoute/map.css">
</head>

<body>

  <h2>Get Driving Routes</h2>

  <label>
    Origin: <input type="text" id="origin" value="San Francisco, CA">
  </label><br><br>

  <label>
    Destination: <input type="text" id="destination" value="Las Vegas, NV">
  </label><br><br>

  <button id="fetch_routes_btn">Fetch Routes</button>

  <div id="result" style="margin-top: 20px;"></div>

</body>

<script type="module" src="{{site.baseurl}}/navigation/findBestRoute/map.js"></script>
<script type="module" src="{{site.baseurl}}/assets/js/api/config.js"></script>







