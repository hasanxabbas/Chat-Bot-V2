function Sidebar( { createNewChat, Conversations, onSelectConversation, selectedConversation } ) {

    return(
        <div className="sidebar">
            <h1>MY CHAT</h1>
                <button className="new-chat" onClick={createNewChat}>
                  + New Chat
                </button>
                {Conversations.map((conversation) => (
                    <div
                        key={conversation._id}
                        className={`chat-item ${selectedConversation && selectedConversation._id === conversation._id ? "active" : ""}`}
                        onClick={() => onSelectConversation(conversation)}
                    >
                        {conversation.title}
                    </div>
                ))}
        </div>
    )
}
export default Sidebar;