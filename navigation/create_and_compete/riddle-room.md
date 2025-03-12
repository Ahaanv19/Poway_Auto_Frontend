---
layout: post 
title: Moderator's Picks Discussion Room
search_exclude: true
permalink: /chat
menu: nav/create_and_compete.html
---



<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Stylish Chat Room</title>
    <style>
        /* General styling */
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #ff7e5f, #feb47b);
            color: #333;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            overflow: hidden;
        }

        /* Room Details Section */
        details {
            background: rgba(255, 255, 255, 0.8);
            border-radius: 8px;
            margin: 20px;
            padding: 10px;
            width: 80%;
            max-width: 600px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        details summary {
            font-size: 1.2rem;
            font-weight: bold;
            cursor: pointer;
        }

        details p, details ul {
            font-size: 0.9rem;
        }

        /* Chat container styling */
        #chat-container {
            display: flex;
            gap: 20px;
            margin-top: 20px;
            width: 90%;
            max-width: 800px;
            height: 60%;
        }

        #chat-box {
            flex: 3;
            background: white;
            border: 2px solid #feb47b;
            border-radius: 8px;
            padding: 10px;
            overflow-y: auto;
            height: 100%;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        #users-list {
            flex: 1;
            background: white;
            border: 2px solid #ff7e5f;
            border-radius: 8px;
            padding: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        #users-list ul {
            list-style: none;
            padding: 0;
        }

        #users-list li {
            padding: 5px;
            border-bottom: 1px solid #ddd;
        }

        /* Input group styling */
        .input-group {
            display: flex;
            gap: 10px;
            margin-top: 20px;
            width: 90%;
            max-width: 800px;
        }

        .input-group input {
            flex: 1;
            padding: 10px;
            border: 2px solid #ff7e5f;
            border-radius: 8px;
            font-size: 1rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .input-group button {
            padding: 10px 20px;
            background: #ff7e5f;
            color: white;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            cursor: pointer;
            transition: background 0.3s ease;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .input-group button:hover {
            background: #e0665c;
        }

        /* Message styling */
        .message {
            margin-bottom: 10px;
            padding: 5px;
            border-radius: 4px;
        }

        .system-message {
            background: #f7f7f7;
            color: #666;
            font-size: 0.9rem;
            font-style: italic;
        }

        .user-message {
            background: #ffebd4;
            color: #333;
            font-size: 1rem;
        }
    </style>
</head>
<body>
    <details>
        <summary>Room Details</summary>
        <a href="{{site.baseurl}}/moderation/rules_chat/">Moderation Rules</a>
        <p>Discuss your thoughts and collaborate with other curious members!</p>
        <p>Room will consist of:</p>
        <ul>
            <li>Chat box where members of the channel can collaborate and share ideas</li>
            <li>Profanity is censored</li>
            <li>Moderators will oversee discussions to ensure they stay respectful and productive</li>
        </ul>
    </details>

    <div id="chat-container">
        <div id="chat-box"></div>
        <div id="users-list">
            <h4>Users</h4>
            <ul id="userList">
                <li>System</li>
            </ul>
        </div>
    </div>

    <div class="input-group">
        <input type="text" id="message-input" placeholder="Type your message...">
        <button id="send-button" onclick="sendMessage()">Send</button>
    </div>

    <script>
        const chatBox = document.getElementById('chat-box');
        const messageInput = document.getElementById('message-input');
        const userList = document.getElementById('userList');
        const users = new Set(['System']);
        let username;

        function requestUsername() {
            while (true) {
                const enteredUsername = prompt("Enter your username:");
                if (enteredUsername && !users.has(enteredUsername)) {
                    username = enteredUsername;
                    addUser(username);
                    displayMessage(`You have joined as ${username}.`, true);
                    break;
                } else {
                    alert("Username is taken or invalid. Please try again.");
                }
            }
        }

        function displayMessage(message, isSystem = false) {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message', isSystem ? 'system-message' : 'user-message');
            messageElement.textContent = message;
            chatBox.appendChild(messageElement);
            chatBox.scrollTop = chatBox.scrollHeight;
        }

        function addUser(newUsername) {
            users.add(newUsername);
            const userItem = document.createElement('li');
            userItem.textContent = newUsername;
            userList.appendChild(userItem);
        }

        function sendMessage() {
            const messageText = messageInput.value.trim();
            if (messageText !== '') {
                displayMessage(`${username}: ${messageText}`);
                messageInput.value = '';
            }
        }

        displayMessage("Welcome to the Chat Room!", true);
        requestUsername();
    </script>
</body>
</html>
