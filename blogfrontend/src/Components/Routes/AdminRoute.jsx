import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { Outlet } from "react-router-dom";

export default function AdminRoute() {
  const [authorized, setAuthorized] = useState(false);
  const [auth] = useAuth(); // Assuming useAuth provides user information including role

  useEffect(() => {
    // Check if user is authenticated and has admin role
    if (auth?.token && auth?.user?.role === "Admin") {
      setAuthorized(true);
    } else {
      setAuthorized(false);
    }
  }, [auth?.token, auth?.user?.role]);

  return authorized ? <Outlet /> : null;
}
