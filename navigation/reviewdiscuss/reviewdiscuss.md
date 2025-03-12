---
layout: page
title: Moderator's Picks
description: Have fun with your Peers!!
permalink: /review
---

<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Review Section</title>
    <style>
        /* General Styling */
        body {
            background: linear-gradient(135deg, #333333, orange, #ffffff);
            color: #ffffff;
            font-family: Arial, sans-serif;
            min-height: 100vh;
            margin: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            overflow-y: auto;
        }

        h2, h3 {
            color: rgb(255, 80, 80);
            border-bottom: 4px solid #000000;
            font-weight: bold;
            text-shadow: 1px 1px 0 rgba(255, 255, 255, 0.8),
                         2px 2px 0 rgba(255, 255, 255, 0.6);
            border-radius: 10px;
            padding: 10px;
        }

        p {
            color: white;
        }

        .button {
            background-color: white;
            color: black !important;
            text-decoration: none;
            font-weight: bold;
            padding: 15px 20px;
            border-radius: 20px;
            transition: transform 0.2s ease, background-color 0.2s ease;
        }

        .button:hover {
            transform: scale(1.05);
            background-color: lightgrey;
            color: black !important;
        }

        .button:active {
            transform: scale(0.95);
            background-color: grey;
            color: black !important;
        }

        .star-rating {
            font-size: 3rem;
            color: #ddd;
            cursor: pointer;
            display: inline-flex;
            justify-content: center;
            gap: 10px;
            margin-top: 20px;
        }

        .star {
            transition: color 0.3s ease, transform 0.2s ease;
        }

        .star:hover,
        .star.selected,
        .star.hover {
            color: #f7d106;
            transform: scale(1.2);
        }

        #rating-display {
            margin-top: 20px;
            font-size: 1.4rem;
            color: white;
        }

        #thank-you-message {
            margin-top: 20px;
            font-size: 1.2rem;
            color: #ffffff;
            display: none;
            background: #4caf50;
            padding: 10px;
            border: 1px solid #388e3c;
            border-radius: 5px;
        }
    </style>
</head>

<body>
    <!-- Book Section -->
    <h3>This Week's Books!</h3>
    <p>Harry Potter and The Goblet of Fire: By JK Rowlings</p>
    <img src="{{site.baseurl}}/images/harry.png" height="400" alt="Book Cover">
    <div class="moderator-rating">
        <h2>Moderator's Rating</h2>
        <div class="star-rating" style="color: gold;">
            <span>&#9733;</span>
            <span>&#9733;</span>
            <span>&#9733;</span>
            <span>&#9733;</span>
            <span>&#9733;</span>
        </div>
        <div class="feedback-box">
            <h3>Moderator's Feedback</h3>
            <p class="feedback-content">
                Wonderful book and story plot! I like the idea of the story and the plot twist at the end!
            </p>
        </div>
    </div>

    <!-- Star Rating Section -->
    <h1>Your Rating</h1>
    <p>Please rate the book and share your thoughts.</p>
    <div class="star-rating">
        <span class="star" data-value="1">&#9733;</span>
        <span class="star" data-value="2">&#9733;</span>
        <span class="star" data-value="3">&#9733;</span>
        <span class="star" data-value="4">&#9733;</span>
        <span class="star" data-value="5">&#9733;</span>
    </div>
    <div id="rating-display">Your Rating: 0</div>
    <div id="thank-you-message">Thank you for rating! Your feedback is appreciated.</div>

    <script>
        const stars = document.querySelectorAll('.star-rating .star');
        const ratingDisplay = document.getElementById('rating-display');
        const thankYouMessage = document.getElementById('thank-you-message');
        let userRating = 0;

        stars.forEach((star) => {
            star.addEventListener('mouseover', () => {
                const rating = star.getAttribute('data-value');
                highlightStars(rating);
            });

            star.addEventListener('mouseout', resetStars);

            star.addEventListener('click', () => {
                const rating = star.getAttribute('data-value');
                userRating = rating; // Store user rating
                setRating(rating);
                thankYouMessage.style.display = 'block'; // Show thank-you message
                alert(`You rated this book ${rating} out of 5!`); // Prompt message
            });
        });

        function highlightStars(rating) {
            stars.forEach((star) => {
                const value = star.getAttribute('data-value');
                star.classList.toggle('hover', value <= rating);
            });
        }

        function resetStars() {
            stars.forEach((star) => {
                star.classList.remove('hover');
            });
        }

        function setRating(rating) {
            stars.forEach((star) => {
                const value = star.getAttribute('data-value');
                star.classList.toggle('selected', value <= rating);
            });
            ratingDisplay.textContent = `Your Rating: ${rating}`;
        }
    </script>

    <!-- Backend Fetching -->
    <h2>Discussion</h2>
    <textarea placeholder="Enter your thoughts or comments here..." id="comment"></textarea>
    <button class="regularButton" onclick="addComment()"><p class="buttonP">Add Comment</p></button>

    <div class="message-box" id="messageBox">
        <p><strong>Messages:</strong></p>
    </div>

    <script type="module">
        import { pythonURI, fetchOptions } from '../../../assets/js/api/config.js';
        const channelID = 22;
        const commentTitle = "economyCars";
        async function addComment() {
            const argumentText = document.getElementById('comment').value.trim();
            if (!argumentText) {
                alert('Please enter a comment.');
                return;
            }
            const argumentData = {
                title: commentTitle,
                comment: argumentText,
                channel_id: channelID,
                user_name: localStorage.getItem('username') || 'Guest'
            };
            try {
                const response = await fetch(`${pythonURI}/api/post`, {
                    ...fetchOptions,
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(argumentData)
                });
                if (!response.ok) throw new Error('Failed to submit comment: ' + response.statusText);
                document.getElementById('comment').value = ''; // Clear input field
                fetchComments(); // Refresh comments list
            } catch (error) {
                console.error('Error submitting comment:', error);
                alert('Error submitting comment: ' + error.message);
            }
        }
        async function fetchComments() {
            try {
                const response = await fetch(`${pythonURI}/api/posts/filter`, {
                    ...fetchOptions,
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ channel_id: channelID })
                });
                if (!response.ok) throw new Error('Failed to fetch comments: ' + response.statusText);
                const argumentsData = await response.json();
                argumentsData.reverse();
                const messageBox = document.getElementById('messageBox');
                messageBox.innerHTML = "<p><strong>Messages :</strong></p>"; // Clear existing comments
                argumentsData.forEach(arg => {
                    const commentElement = document.createElement("p");
                    commentElement.textContent = `${arg.user_name}: ${arg.comment}`;
                    messageBox.appendChild(commentElement);
                });
            } catch (error) {
                console.error('Error fetching comments:', error);
                alert('Error fetching comments: ' + error.message);
            }
        }
        window.addEventListener('load', () => {
            fetchComments(channelID); // Fetch initial comments on page load
        });
        window.addComment = addComment; // Expose the function globally
    </script>
</body>

</html>



