---
permalink: /littest
menu: nav/vote_for_the_goat.html
layout: post
title:  Literary Personality Test
description: A quiz that determines which literary character or author users most resemble.
---

<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Literary Personality Test</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f8f9fa;
            color: #333;
            line-height: 1.8;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 2rem;
        }

        h1 {
            color: #1d4ed8;
            margin-bottom: 1rem;
        }

        .quiz-container {
            background: #fff;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            width: 100%;
            color: black !important;
        }

        .question {
            margin-bottom: 1.5rem;
        }

        .options {
            margin-bottom: 2rem;
        }

        .options button {
            display: block;
            width: 100%;
            padding: 0.8rem;
            margin: 0.5rem 0;
            border: 1px solid #1d4ed8;
            background: #f0f8ff;
            color: #1d4ed8;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1rem;
            transition: all 0.3s;
        }

        .options button:hover {
            background: #1d4ed8;
            color: #fff;
        }

        .result {
            text-align: center;
            margin-top: 2rem;
        }

        .result h2 {
            color: #1d4ed8;
        }

        footer {
            margin-top: 2rem;
            text-align: center;
            color: #666;
        }
    </style>
</head>
<body>

    <h1>Literary Personality Test</h1>

    <div class="quiz-container">
        <div id="quiz">
            <!-- Quiz questions will dynamically appear here -->
        </div>

        <div class="result" id="result" style="display: none;">
            <h2>Your Literary Personality Is:</h2>
            <p id="personality"></p>
        </div>
    </div>

    <footer>
        &copy; 2025 Literary World
    </footer>

    <script>
        // Quiz Data
        const quizData = [
            {
                question: "What’s your ideal way to spend a weekend?",
                options: [
                    { text: "Reading a classic novel by the fireplace", score: "Jane Austen" },
                    { text: "Exploring mysterious places and solving puzzles", score: "Sherlock Holmes" },
                    { text: "Imagining magical worlds and creating stories", score: "J.K. Rowling" },
                    { text: "Fighting for justice and freedom", score: "George Orwell" }
                ]
            },
            {
                question: "Which of these best describes your personality?",
                options: [
                    { text: "Calm and introspective", score: "Jane Austen" },
                    { text: "Curious and analytical", score: "Sherlock Holmes" },
                    { text: "Creative and adventurous", score: "J.K. Rowling" },
                    { text: "Bold and visionary", score: "George Orwell" }
                ]
            },
            {
                question: "What kind of stories do you prefer?",
                options: [
                    { text: "Romantic and emotional tales", score: "Jane Austen" },
                    { text: "Thrilling and mysterious adventures", score: "Sherlock Holmes" },
                    { text: "Fantasy and magic", score: "J.K. Rowling" },
                    { text: "Dystopian and thought-provoking", score: "George Orwell" }
                ]
            }
        ];

        // Variables
        let currentQuestionIndex = 0;
        let scores = {};

        // Function to Load Quiz Question
        function loadQuestion() {
            const quizDiv = document.getElementById('quiz');
            quizDiv.innerHTML = '';

            if (currentQuestionIndex < quizData.length) {
                const questionData = quizData[currentQuestionIndex];
                const questionElement = document.createElement('div');
                questionElement.classList.add('question');
                questionElement.innerHTML = `<h3>${questionData.question}</h3>`;

                const optionsElement = document.createElement('div');
                optionsElement.classList.add('options');

                questionData.options.forEach(option => {
                    const button = document.createElement('button');
                    button.textContent = option.text;
                    button.onclick = () => {
                        scores[option.score] = (scores[option.score] || 0) + 1;
                        currentQuestionIndex++;
                        loadQuestion();
                    };
                    optionsElement.appendChild(button);
                });

                quizDiv.appendChild(questionElement);
                quizDiv.appendChild(optionsElement);
            } else {
                showResult();
            }
        }

        // Function to Show Result
        function showResult() {
            const quizDiv = document.getElementById('quiz');
            const resultDiv = document.getElementById('result');
            const personalityElement = document.getElementById('personality');

            quizDiv.style.display = 'none';
            resultDiv.style.display = 'block';

            // Determine the highest score
            let highestScore = 0;
            let personality = '';
            for (const key in scores) {
                if (scores[key] > highestScore) {
                    highestScore = scores[key];
                    personality = key;
                }
            }

            personalityElement.textContent = personality;
        }

        // Initialize Quiz
        loadQuestion();
    </script>

</body>
</html>
