import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

// this will wrap whole app
// children -> whole app
const ChatProvider = ({children}) => {
    const navigate = useNavigate();
    // making a state in a component will make it accessible only in that component
    // but here we are making it in context api, it will be accessible to whole of our app
    const [user, setuser] = useState();

    // while login/signup, we store user info in local storage
    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setuser(userInfo);

        // if the user is not logged in
        if(!userInfo) navigate('/');
    }, [navigate]);

    return(
        <ChatContext.Provider value={{user, setuser}}>
            {children}
        </ChatContext.Provider>
    )
};

// go and wrap your app in index.js under <ChatProvider></ChatProvider>

// to make the state accessible to other parts of app, we use useContext hook
export const ChatState = () => {
    return useContext(ChatContext);
}

export default ChatProvider;