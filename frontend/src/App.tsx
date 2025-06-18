import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "./theme";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Categories from "./pages/Categories";
import Accounts from "./pages/Accounts";
import Budgets from "./pages/Budgets";
import Goals from "./pages/Goals";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import BlogPostForm from "./pages/BlogPostForm";
import Profile from "./pages/Profile";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <Router>
                    <Layout>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/dashboard/profile" element={<Profile />} />
                            <Route path="/profile" element={<Navigate to="/dashboard/profile" replace />} />
                            <Route path="/transactions" element={<Transactions />} />
                            <Route path="/categories" element={<Categories />} />
                            <Route path="/accounts" element={<Accounts />} />
                            <Route path="/budgets" element={<Budgets />} />
                            <Route path="/goals" element={<Goals />} />
                            <Route path="/blog" element={<Blog />} />
                            <Route path="/blog/new" element={<BlogPostForm />} />
                            <Route path="/blog/edit/:postId" element={<BlogPostForm />} />
                            <Route path="/blog/:slug" element={<BlogPost />} />
                        </Routes>
                    </Layout>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App; 