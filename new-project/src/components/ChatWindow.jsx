import Message from "./Message";
import {useState} from "react";
function ChatWindow(){
    const [messages, setMessages] = useState([{
        text:"hello",
        sender:"bot",
    }]);
    const [input,setInput] = useState("");
    const sendMessage = () => {
        if(input.trim() === "") 
            return;
        setMessages([...messages,{text:input,sender:"user"}]);

        setInput("");
    };
    return(
        <div className="chat-window">
            <div className="messages">
                {
                    messages.map((message,index)=>(
                        <Message key={index} text={message.text} sender={message.sender}/>
                    ))
                }
            </div>
                <div className="button-input">
                <input type="text" placeholder="Type a message..." value={input} onChange={(e)=>setInput(e.target.value)}/>
                <button onClick={sendMessage}>Send</button>
        </div>
        </div>
    )
}
export default ChatWindow;