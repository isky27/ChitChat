
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Authentication from "./pages/Authentication";
import Chats from "./pages/Chats";
import PrivateRoute from "./components/Context/PrivateRoute";

function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Authentication />} />
      <Route exact path="/chats" element={<PrivateRoute><Chats/></PrivateRoute>} />
    </Routes>
  );
}

export default App;
