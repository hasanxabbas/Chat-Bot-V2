import './App.css'
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import { useState,useEffect } from "react";


function App() {
  const [conversation, setConversation] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);

  const getConversation = async () => {
    try {
      const response = await fetch("http://localhost:5000/conversations");
      const data = await response.json();
      if (data.success) {
        setConversation(data.conversations);
        if (data.conversations.length > 0 && !selectedConversation) {
          setSelectedConversation(data.conversations[0]._id);
        }
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  //const[chatId, setChatId] = useState(Date.now());
  const createNewChat = async() => {
    const response = await fetch("http://localhost:5000/conversations", {
      method: "POST",
      headers: {},
    });
    const data = await response.json();
    if (data.success) {
      setConversation((prevConversations) => [data.conversation, ...prevConversations]);
      setSelectedConversation(data.conversation._id);
    } else {
      console.error("Error creating new conversation:", data.error);
    }
    // Logic to create a new chat
    //setChatId(Date.now());
  };

  useEffect(() => {
    getConversation();
  }, []);

  return (
    <div className="App">
      {/* <Sidebar createNewChat={createNewChat} /> */}
      <Sidebar Conversations={conversation} onSelectConversation={setSelectedConversation}
      selectedConversation={selectedConversation} createNewChat={createNewChat}/>
      <ChatWindow selectedConversation={selectedConversation} />
    </div>
  )
}


export default App

