import {useEffect, useRef} from "react";
import useChatStore from "../store/useChatStore"; 

function ChatBox() {
    const {messages , currentRoom} = useChatStore();
    const bottomRef = useRef(null);

    useEffect(()=>{
        bottomRef.current?.scrollIntoView({behavior:"smooth"});
    },[messages]);

    if (!currentRoom){
        return <div className="chatbox empty">Selecciona una sala para empezar</div>;
    }

   return (
    <div className="chatbox">
      {messages.map((msg) => (
        <div key={msg.id} className="message">
          <span className="message-user">{msg.username}</span>
          <span className="message-time">
            {new Date(msg.timestamp).toLocaleTimeString()}
          </span>
          <p className="message-text">{msg.message}</p>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}

export default ChatBox;