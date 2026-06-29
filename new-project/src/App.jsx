import "./App.css";
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";

function App() {

  const [selectedConversation, setSelectedConversation] = useState(null);

  return (
    <div className="App">

      <Sidebar
        selectedConversation={selectedConversation}
        setSelectedConversation={setSelectedConversation}
      />

      <ChatWindow
        selectedConversation={selectedConversation}
      />

    </div>
  );
}

export default App;