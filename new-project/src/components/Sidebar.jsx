import { useEffect, useState } from "react";

function Sidebar({ selectedConversation, setSelectedConversation }) {

    const [conversations, setConversations] = useState([]);

    // Fetch all conversations
    const getConversations = async () => {
        try {
            const response = await fetch("http://localhost:5000/conversations");
            const data = await response.json();

            if (data.success) {
                setConversations(data.conversations);
            }
        } catch (error) {
            console.log("Error fetching conversations:", error);
        }
    };

    // Create a new conversation
    const createConversation = async () => {
        try {
            const response = await fetch("http://localhost:5000/conversations", {
                method: "POST",
            });

            const data = await response.json();

            if (data.success) {
                setConversations((prev) => [data.conversation, ...prev]);
                setSelectedConversation(data.conversation);
            }

        } catch (error) {
            console.log("Error creating conversation:", error);
        }
    };

    useEffect(() => {
        getConversations();
    }, []);

    return (
        <div className="sidebar">

            <div className="sidebar-header">
    <img src="/logo.png" alt="Logo" className="logo" />
    <h1>Chat</h1>
</div>

            <button
                className="new-chat-btn"
                onClick={createConversation}
            >
                + New Chat
            </button>

            <div className="conversation-list">

                {
                    conversations.map((conversation) => (

                        <div
                            key={conversation._id}
                            className={
                                selectedConversation?._id === conversation._id
                                    ? "conversation active"
                                    : "conversation"
                            }
                            onClick={() => setSelectedConversation(conversation)}
                        >
                            {conversation.title}
                        </div>

                    ))
                }

            </div>

        </div>
    );
}

export default Sidebar;