import { useEffect, useState } from "react";
import Message from "./Message";

function ChatWindow({ selectedConversation }) {

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    // Load chats of selected conversation
    const getChats = async () => {

        if (!selectedConversation) {
            setMessages([]);
            return;
        }

        try {

            const response = await fetch(
                `http://localhost:5000/conversations/${selectedConversation._id}/chats`
            );

            const data = await response.json();

            if (data.success) {
                setMessages(data.chats);
            }

        } catch (error) {
            console.log(error);
        }

    };

    useEffect(() => {
        getChats();
    }, [selectedConversation]);

    const sendMessage = async () => {

        if (!input.trim()) return;

        if (!selectedConversation) {
            alert("Please create a new chat first.");
            return;
        }

        const userMessage = {
            text: input,
            sender: "user",
        };

        setMessages((prev) => [...prev, userMessage]);

        const message = input;
        setInput("");

        setLoading(true);

        try {

            const response = await fetch("http://localhost:5000/", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    Message: message,
                    conversationId: selectedConversation._id,
                }),

            });

            const data = await response.json();

            if (data.success) {

                setMessages((prev) => [
                    ...prev,
                    {
                        text: data.Reply,
                        sender: "bot",
                    },
                ]);

            }

        } catch (error) {

            console.log(error);

        }

        setLoading(false);

    };

    return (

        <div className="chat-window">

            <div className="messages">

                {
                    messages.map((message, index) => (

                        <Message
                            key={index}
                            text={message.text}
                            sender={message.sender}
                        />

                    ))
                }

                {
                    loading &&
                    <Message
                        text="Thinking..."
                        sender="bot"
                    />
                }

            </div>

            <div className="button-input">

                <input
                    type="text"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            sendMessage();
                        }
                    }}
                />

                <button onClick={sendMessage}>
                    Send
                </button>

            </div>

        </div>

    );
}

export default ChatWindow;