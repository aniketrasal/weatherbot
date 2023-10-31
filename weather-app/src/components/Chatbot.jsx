import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const Chat = async (value) => {
  const { data } = await axios.post("https://weatherbotbackend.onrender.com/bot", {
    message: value,
  });
  return data.message;
};

const Text = () => {
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textConvoRef = useRef(null); // Create a ref for the conversation container

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newMessage = { role: "user", content: value };
    const updatedMessages = [...messages, newMessage];

    try {
      setIsLoading(true);
      const data = await Chat(value);
      const assistantMessage = { role: "assistant", content: data };
      updatedMessages.push(assistantMessage); // Add the assistant's response to the messages
    } catch (error) {
      console.error("Error in chat:", error);
      // Handle the error as needed (e.g., show an error message to the user)
    } finally {
      setMessages(updatedMessages); // Update the messages state with both user and assistant messages
      setIsLoading(false);
      setValue("");
    }
  };

  useEffect(() => {
    // Scroll to the bottom when the component mounts or when messages change
    if (textConvoRef.current) {
      textConvoRef.current.scrollTop = textConvoRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="main-container">
      <h1 className="heading">Weather Forecast</h1>
      <div
        ref={textConvoRef}
        className="text-box"
        style={{
          maxHeight: "600px",
          overflowY: "scroll",
        }}
      >
        {messages.length
          ? messages.map((el, i) => (
              <div key={i} className={`message ${el.role === "user" ? "user-message" : "assistant-message"}`}>
                <p>
                  {el.content}
                </p>
              </div>
            ))
          : "Start your conversation"}
      </div>

      {isLoading && <div className="loading-indicator"><div class="loader"></div></div>}

      <div className="input">
        <input
          type="text"
          onChange={(e) => handleChange(e)}
          value={value}
          placeholder="Your message"
        />
        <button
          type="submit"
          onClick={(e) => {
            setMessages([...messages, { role: "user", content: value }]);
            handleSubmit(e);
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Text;