import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Paper,
    CircularProgress,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../api";

interface BlogPostFormData {
    title: string;
    content: string;
    slug: string;
    published: boolean;
}

const BlogPostForm: React.FC = () => {
    const { postId } = useParams<{ postId: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState<BlogPostFormData>({
        title: "",
        content: "",
        slug: "",
        published: false,
    });

    useEffect(() => {
        if (postId) {
            const fetchPost = async () => {
                try {
                    const response = await api.get(`/blog/${postId}`);
                    setFormData(response.data);
                } catch (error) {
                    console.error("Error fetching post:", error);
                    navigate("/blog");
                }
            };
            fetchPost();
        }
    }, [postId, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (postId) {
                await api.put(`/blog/${postId}`, formData);
            } else {
                await api.post("/blog/", formData);
            }
            navigate("/blog");
        } catch (error) {
            console.error("Error saving post:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            slug: name === "title" ? value.toLowerCase().replace(/\s+/g, "-") : prev.slug,
        }));
    };

    if (!user) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Typography variant="h5" align="center">
                    Please log in to create or edit blog posts.
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    {postId ? "Edit Post" : "Create New Post"}
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        margin="normal"
                    />

                    <TextField
                        fullWidth
                        label="Content"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        required
                        multiline
                        rows={10}
                        margin="normal"
                    />

                    <TextField
                        fullWidth
                        label="Slug"
                        name="slug"
                        value={formData.slug}
                        onChange={handleChange}
                        required
                        margin="normal"
                        helperText="URL-friendly version of the title"
                    />

                    <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : "Save Post"}
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => navigate("/blog")}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default BlogPostForm; 