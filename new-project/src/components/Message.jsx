function Message({text,sender,attachment}){
    return(
        <div className={`message ${sender}`}> 
           {
            attachment && attachment.mimetype?.startsWith("image/") && (
                <img 
                src={`http://localhost:5000/${attachment.path}`}
                alt= "attachment"
                width= "180"
                />
            )

           }
            <p>{text}</p>
        </div>
    )
}
export default Message;