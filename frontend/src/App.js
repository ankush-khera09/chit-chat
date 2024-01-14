import './App.css';
import {Routes, Route, BrowserRouter} from 'react-router-dom'
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<HomePage/>} />
          <Route exact path="/chats" element={<ChatPage/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
