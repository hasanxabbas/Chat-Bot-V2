import Message from "./Message";
import { useState, useEffect } from "react";
function ChatWindow({ selectedConversation }) {
    

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const getChats = async () => {
        if (!selectedConversation) {    
            return;
        }
        const response = await fetch(`http://localhost:5000/conversations/${selectedConversation._id}/chats`);
        const data = await response.json();

        if (data.success) {
            setMessages(data.chats);
        }

        // try {
        //     const response = await fetch("http://localhost:5000/chats");
        //     const data = await response.json();
        //     if (data.success) {
        //         setMessages(data.chats);
        //     }
        // } catch (error) {
        //     console.log("Error fetching chats", error);
        // }
    };

    useEffect(() => {
        getChats();
    }, 

    [selectedConversation]);
    // useEffect(() => {
    //     setMessages([]);
    // }, [chatId]);   

    const sendMessage = async () => {
        if (input.trim() === "" || !selectedConversation) {
            return;
        }

        const userMessage = {
            text: input,
            sender: "user"
        }

        setMessages((previousMessages) => [...previousMessages, userMessage]);
        setInput("");
        setLoading(true);
        try {
            const Response = await fetch("http://localhost:5000/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    Message: input,
                    conversationId: selectedConversation._id
                }),
            });
            if (!Response.ok) {
                throw new Error("Server error");
            }
            const data = await Response.json();

            const aiMessage = {
                text: data.Reply,
                sender: "bot"


            }
            setMessages((previousMessages) => [...previousMessages, aiMessage

            ]);
        } catch (error) {
            setMessages((previousMessages) => [
                ...previousMessages,
                {
                    text: "Error sending message:",
                    sender: "bot",
                }
            ]);
        } finally {
            setLoading(false);
        }
    };
    console.log("REACHED RETURN");
   if(!selectedConversation){
        return(
            <div className="chat-window">
                <p>Please select a conversation to start chatting.</p>
            </div>
        )
    }
   
    return (
        <div className="chat-window">
            <div className="messages">
                {
                    messages.map((message, index) => (
                        <Message key={index} text={message.text} sender={message.sender} />
                    ))
                }
                {loading && (<div className="message bot">Typing...</div>)}

            </div>

            <div className="button-input">
                <input type="text" placeholder="Type a message..." value={input} onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") sendMessage() }}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    )
}
export default ChatWindow;