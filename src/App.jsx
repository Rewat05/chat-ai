import axios from 'axios';
import { useState } from 'react';
import './App.css';

function App() {
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  async function generateAnswer() {
    if (!question.trim()) return;

    const currentQuestion = question; // Store the current question
    const chatId = Date.now(); // Unique identifier for this chat pair

    // Add the question with a placeholder for the answer
    const newChat = { id: chatId, question: currentQuestion, answer: 'Loading...' };
    setChatHistory((prev) => [...prev, newChat]);

    setQuestion(''); // Clear the input box

    try {
      const response = await axios({
        url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyC4PCLZrDaqwZqZI2EIyKl0X33zFbAls84',
        method: 'post',
        data: {
          contents: [{ parts: [{ text: currentQuestion }] }],
        },
      });

      const answer = response.data.candidates[0].content.parts[0].text;

      // Split the answer into lines and update chat history with line-by-line answers
      const answerLines = answer.split('\n');

      // Update the specific chat bubble with the correct answer (line by line)
      setChatHistory((prev) =>
        prev.map((chat) =>
          chat.id === chatId
            ? { ...chat, answer: answerLines }
            : chat
        )
      );
    } catch (error) {
      // Update the specific chat bubble with an error message
      setChatHistory((prev) =>
        prev.map((chat) =>
          chat.id === chatId
            ? { ...chat, answer: ['Error generating answer. Please try again.'] }
            : chat
        )
      );
    }
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode', !isDarkMode);
  };

  return (
    <div className={`app-container ${isDarkMode ? 'dark' : ''}`}>
      <button className="mode-toggle-btn" onClick={toggleDarkMode}>
        {isDarkMode ? '☀ Light Mode' : '🌙 Dark Mode'}
      </button>

      {/* Animated Objects */}
    <div className="animated-object left-object"></div>
    <div className="animated-object right-object"></div>

      <h1 className="app-title halloween-title">🎃 Spooky AI 👻</h1>

      <div className="chat-container">
        {chatHistory.map((chat) => (
          
          <div className="chat-bubble" key={chat.id}>
            <div className="chat-question">
              <strong>Question:</strong>
              <p>{chat.question}</p>
            </div>
            <div className="chat-answer">
              <strong>Answer:</strong>
              {Array.isArray(chat.answer) ? (
                chat.answer.map((line, index) => <p key={index}>{line}</p>)
              ) : (
                <p>{chat.answer}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="form-container">
        <textarea
          className="input-box"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Type your question here..."
          rows="5"
        ></textarea>
        <button className="generate-btn" onClick={generateAnswer}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default App;



// my code ended here


