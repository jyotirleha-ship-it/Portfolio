import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, Trash2, Sparkles, ChevronDown } from "lucide-react";
import { sendChatMessage } from "../services/api";

const initialMessage = {
  id: "init",
  sender: "bot",
  text: "Hello! I am **Leha AI**, your interactive assistant for **Jyotir Leha R**'s portfolio.\n\nAsk me anything about her **projects**, **Solidity smart contracts**, **technical skills**, **education at National Engineering College**, or **internship readiness**!",
};

const suggestedPrompts = [
  "What are Jyotir's top projects?",
  "Tell me about her education and college",
  "What certifications does she hold in cybersecurity & blockchain?",
  "How can I contact her for an internship?",
  "How does blockchain project verification work?",
];

export default function ChatbotModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([initialMessage]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const text = (textToSend || inputValue).trim();
    if (!text || loading) return;

    const userMsg = {
      id: "u_" + Date.now(),
      sender: "user",
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setLoading(true);

    try {
      const history = messages.slice(-6).map((m) => ({
        role: m.sender === "bot" ? "model" : "user",
        text: m.text,
      }));

      const res = await sendChatMessage(text, history);
      const botMsg = {
        id: "b_" + Date.now(),
        sender: "bot",
        text: res.reply || "I am Leha AI. How can I help you?",
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg = {
        id: "err_" + Date.now(),
        sender: "bot",
        text: "I encountered a communication delay. However, you can find full details on Jyotir's projects and resume directly in this portfolio, or email her at jyotirleha@gmail.com!",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([initialMessage]);
  };

  return (
    <>
      {/* Floating launcher button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="chatbot-floating-toggle"
        aria-label="Open Leha AI Assistant"
      >
        <span className="chatbot-badge-notification" />
        {isOpen ? <X size={26} /> : <MessageSquare size={26} />}
      </button>

      {/* Slide-Up Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-identity">
              <div className="chatbot-avatar">
                <Bot size={22} />
              </div>
              <div className="chatbot-titles">
                <h4>Leha AI</h4>
                <span>
                  <Sparkles size={11} /> Portfolio Assistant (Gemini Powered)
                </span>
              </div>
            </div>

            <div className="chatbot-actions">
              <button
                onClick={clearChat}
                className="chatbot-btn-tool"
                title="Clear conversation"
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="chatbot-btn-tool"
                title="Close chat"
              >
                <ChevronDown size={18} />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="chatbot-messages-body">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`chat-bubble ${
                  m.sender === "bot" ? "chat-bubble-bot" : "chat-bubble-user"
                }`}
              >
                <div style={{ whiteSpace: "pre-line" }}>
                  {m.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="chat-bubble chat-bubble-bot">
                <div className="typing-dots">
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                  <div className="typing-dot" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts Strip */}
          <div className="chatbot-chips-wrap">
            {suggestedPrompts.map((prompt, pIdx) => (
              <button
                key={pIdx}
                className="prompt-chip"
                onClick={() => handleSend(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="chatbot-input-bar"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask Leha AI about Jyotir's work..."
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !inputValue.trim()}
              className="chatbot-send-btn"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
