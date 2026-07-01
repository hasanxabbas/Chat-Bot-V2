function Message({text,sender,attachment}){
    console.log(attachment);
    return(
        <div className={`message ${sender}`}> 
           {
            attachment && attachment.mimetype?.startsWith("image/") && (
                <img
    src={
        attachment.previewUrl
            ? attachment.previewUrl
            : `http://localhost:5000/${attachment.path}`
    }
    alt="attachment"
    className="chat-image"
/>
            )

           }
            <p>{text}</p>
        </div>
        
    )
}
export default Message;