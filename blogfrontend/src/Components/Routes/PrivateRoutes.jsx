import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { Outlet } from "react-router-dom";

export default function PrivateRoute() {
  const [authorized, setAuthorized] = useState(false);
  const [auth] = useAuth(); // Assuming useAuth provides token information

  useEffect(() => {
    // Check if token exists in local storage or in context
    const token = localStorage.getItem("auth") || auth?.token;
    if (token) {
      setAuthorized(true);
    } else {
      setAuthorized(false);
    }
  }, [auth?.token]);

  return authorized ? <Outlet /> : null;
}
