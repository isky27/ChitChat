import React from "react";
import {Navigate} from "react-router-dom";

export function AuthenticateRoute({ children }) {
  const userDetails = JSON.parse(localStorage.getItem("userInfo")) || ""

 console.log(userDetails,"sajkjsdjks")

  if (Object.keys(userDetails)?.length === 0) {
    console.log(userDetails,"dsbsjnjsdknjks")
    return children 
  }
  return <Navigate to="/chats" />;
}


export function PrivateRoute({ children }) {
  const userDetails = JSON.parse(localStorage.getItem("userInfo")) || ""
  
  console.log(userDetails,"dsbdjsdjkdndsjjds")

  if (Object.keys(userDetails)?.length === 0) {
    return <Navigate to="/"/>
  }
  return children;
}

export default PrivateRoute