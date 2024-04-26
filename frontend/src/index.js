import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react'
import ChatProvider from './context/ChatProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // whatever state we create inside contextAPI will be accessible to whole app
  <ChatProvider>
      <ChakraProvider>
        <App />
      </ChakraProvider>
  </ChatProvider>
);
