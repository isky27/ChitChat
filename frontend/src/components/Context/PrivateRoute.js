import React from "react";
import { Navigate} from "react-router-dom";

function PrivateRoute({ children }) {
  const userDetails = JSON.parse(localStorage.getItem("userInfo")) || null
     
  if (Object.keys(userDetails).length === 0) {
    return <Navigate to="/"/>
  }
  return children;
}

export default PrivateRoute