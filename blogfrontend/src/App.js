import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Login from "./pages/Auth/Login/Login";
import Registration from "./pages/Auth/Register/Register";
import Blog from "./pages/Blog";
import ForgotPassword from "./pages/Auth/ForgotPassword/ForgotPassword";
import { Toaster } from "react-hot-toast";
import PrivateRoute from "./Components/Routes/PrivateRoutes";
import UserDashboard from "./pages/User/UserDashboard";
import AdminRoute from "./Components/Routes/AdminRoute";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import CreateBlogPost from "./pages/User/CreateBlog";
import ShowBlog from "./pages/User/ShowBlog/ShowBlog";
import UpdateProfile from "./pages/User/UserProfile";
import AdminRegistration from "./pages/Admin/AdminRegister";
import PostStats from "./pages/Admin/PostStats";
import TopBlogs from "./pages/Admin/TopBlogs";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Toaster />

        <Navbar />
        <Routes>
          <Route path="/" element={<Blog />} />
          <Route path="/dashboard" element={<PrivateRoute />}>
            <Route path="user" element={<UserDashboard />} />
            <Route path="user/blog/create" element={<CreateBlogPost />} />
            <Route path="user/blog/showBlog" element={<ShowBlog />} />
            <Route path="user/viewProfile" element={<UpdateProfile />} />
          </Route>

          <Route path="/dashboard" element={<AdminRoute />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/addadmin" element={<AdminRegistration />} />
          <Route path="admin/stats" element={<PostStats />} />
          <Route path="admin/topblogs" element={<TopBlogs />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
