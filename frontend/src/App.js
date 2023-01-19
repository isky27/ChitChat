
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Authentication from "./pages/Authentication";
import Chats from "./pages/Chats";

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Authentication />} />
      <Route exact path="/chats" element={<Chats/>} />
    </Routes>
  );
}

export default App;
