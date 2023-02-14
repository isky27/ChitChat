import React from "react";
import { Navigate} from "react-router-dom";
import { ChatState } from "./ChatProvider";

function PrivateRoute({ children }) {
  const {user} = ChatState();
     
  if (Object.keys(user).length === 0) {
    return <Navigate to="/"/>
  }
  return children;
}

export default PrivateRoute