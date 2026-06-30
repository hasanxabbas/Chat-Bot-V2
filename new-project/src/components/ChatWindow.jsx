import { useEffect, useState } from "react";
import Message from "./Message";

function ChatWindow({ selectedConversation }) {

    const [attachment, setAttachment] = useState(null);
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

        if (!input.trim() && !attachment) return;

        if (!selectedConversation) {
            alert("Please create a new chat first.");
            return;
        }

        const userMessage = {
            text: input,
            sender: "user",
            attachment: attachment ? {
                filename: attachment.name,
                path: attachment.path,
                mimetype: attachment.type,
                previewUrl: URL.createObjectURL(attachment),
            } : null
        };


        setMessages((prev) => [...prev, userMessage]);

        const message = input;
        const file = attachment;
        setAttachment(null);
        setInput("");

        setLoading(true);

        try {
            
            const formData = new FormData();

            formData.append("Message", message);
            formData.append("conversationId", selectedConversation._id);
            if (file) {
                formData.append("attachment", file);
            }

            const response = await fetch("http://localhost:5000/", {

                method: "POST",

                

                body: formData,

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
                            attachment={message.attachment}
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
                <input type="file" onChange={(e) => setAttachment(e.target.files[0])} />
                {
                    attachment &&
                    ( <span style={{ marginLeft: "10px" }}>{attachment.name}</span> )
                }

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