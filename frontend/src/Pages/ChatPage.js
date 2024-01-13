import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ChatPage(){
    const [chats, setChats] = useState([]);

    const fetchChats = async () => {
        const response = await axios.get('http://localhost:5000/api/chats');
        setChats(response.data);      // axios wraps response in 'data' property
    }

    useEffect(()=>{
        fetchChats();
    }, []);
    
    return(
        <div>
            {chats.map(chat => <div key={chat._id}>{chat.chatName}</div>)}
        </div>
    );
}