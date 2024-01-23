
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Authentication from "./pages/Authentication";
import Chats from "./pages/Chats";
import PrivateRoute from "./components/Context/PrivateRoute";
import ErrorBoundary from "./components/Context/ErrorBounderies";

function App() {
  return (
      <ErrorBoundary fallback={"App.js"}>
        <Routes>
          <Route exact path="/" element={<Authentication />} />
          <Route exact path="/chats" element={<PrivateRoute><Chats/></PrivateRoute>} />
        </Routes>
      </ErrorBoundary>
  );
}

export default App;
