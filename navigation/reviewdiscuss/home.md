---
layout: post 
title: Welcome to Moderator's Picks!
search_exclude: true
permalink: /voteforthegoat/home
menu: nav/vote_for_the_goat.html
---

<style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #5D82B3 !important; /* Matching LitConnect home page */
      color: #ffffff;
      margin: 0;
      padding: 20px;
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    h1 {
      text-align: center;
      color: #ffffff;
      margin-bottom: 20px;
      text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
    }

    .group-theme {
      background: rgba(44, 62, 80, 0.8);
      color: #ffffff;
      padding: 15px;
      border-radius: 10px;
      margin-bottom: 20px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      backdrop-filter: blur(10px);
      text-align: center;
    }
  </style>

In this Zone, view the book of the week, with the moderators' honest review and rating out of 5 stars. Then you can enjoy disscussing with other readers in the discussion chat, sharing your thoughts and opionions on the moderators review, and have conversations with others about your own feelings. 

### Group Themes and Activities

<div class="group-theme">
    <strong>Sneek Peek</strong>  
    This weeks Book is..... HARRY POTTER AND THE GOBLET OF FIRE!! Check out the Moderators Review!
</div>

<script>
    // Function to fetch preferences from the backend
    function loadPreferences() {
        fetch('https://litconnect.stu.nighthawkcodingsociety.com/api/preferences')  // Adjust URL if needed
        .then(response => response.json())
        .then(data => {
            // Update the page with the preferences
            const menuElement = document.getElementById('menu');
            const textElement = document.getElementById('text');

            if (menuElement) {
            menuElement.innerText = `Menu: ${data.menu}`;
            }

            if (textElement) {
            textElement.innerText = `Text: ${data.text}`;
            }

            // Apply text color to <p> elements
            let pColors = document.querySelectorAll('p');
            pColors.forEach(p => {
            p.style.color = data.text;
            });

            // Change menu text color
            let menuItems = document.querySelectorAll('.menu-item');
            menuItems.forEach(item => {
            item.style.color = data.menu;  // Apply menu color to each item
            });

            let ulItems = document.querySelectorAll('.ul-item');
            ulItems.forEach(item => {
            item.style.color = data.text
            });

            let liItems = document.querySelectorAll('li');
            liItems.forEach(item => {
            item.style.color = data.text
            });

        })
        .catch(error => {
            console.error('Error fetching preferences:', error);
        });
    }

    // Load preferences when the page is loaded
    window.onload = loadPreferences;
</script>