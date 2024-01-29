
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Authentication from "./pages/Authentication";
import Chats from "./pages/Chats";
import { AuthenticateRoute, PrivateRoute } from "./components/Context/PrivateRoute";
import ErrorBoundary from "./components/Context/ErrorBounderies";

function App() {
  return (
      <ErrorBoundary fallback={"App.js"}>
        <Routes>
          <Route exact path="/" element={<AuthenticateRoute><Authentication /></AuthenticateRoute>} />
          <Route exact path="/chats" element={<PrivateRoute><Chats /></PrivateRoute>} />
        </Routes>
      </ErrorBoundary>
  );
}

export default App;
