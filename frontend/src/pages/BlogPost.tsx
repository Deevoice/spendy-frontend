import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    Box,
    Container,
    Typography,
    Paper,
    Button,
    CircularProgress,
    Divider,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../api";

interface BlogPost {
    id: number;
    title: string;
    content: string;
    slug: string;
    image_url: string | null;
    created_at: string;
    author_id: number;
    author: {
        full_name: string;
    };
}

const BlogPost: React.FC = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await api.get(`/blog/${slug}`);
                setPost(response.data);
            } catch (error) {
                console.error("Error fetching post:", error);
                navigate("/blog");
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [slug, navigate]);

    const handleDelete = async () => {
        if (!post || !window.confirm("Are you sure you want to delete this post?")) {
            return;
        }

        setDeleting(true);
        try {
            await api.delete(`/blog/${post.id}`);
            navigate("/blog");
        } catch (error) {
            console.error("Error deleting post:", error);
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "60vh",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (!post) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Typography variant="h5" align="center">
                    Post not found
                </Typography>
            </Container>
        );
    }

    const isAuthor = user && user.id === post.author_id;

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper sx={{ p: 4 }}>
                {post.image_url && (
                    <Box
                        component="img"
                        src={post.image_url}
                        alt={post.title}
                        sx={{
                            width: "100%",
                            height: 400,
                            objectFit: "cover",
                            mb: 4,
                            borderRadius: 1,
                        }}
                    />
                )}

                <Typography variant="h3" component="h1" gutterBottom>
                    {post.title}
                </Typography>

                <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" color="text.secondary">
                        By {post.author.full_name} •{" "}
                        {new Date(post.created_at).toLocaleDateString()}
                    </Typography>
                </Box>

                <Divider sx={{ mb: 4 }} />

                <Typography
                    variant="body1"
                    sx={{
                        whiteSpace: "pre-wrap",
                        "& p": { mb: 2 },
                    }}
                >
                    {post.content}
                </Typography>

                {isAuthor && (
                    <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
                        <Button
                            component={Link}
                            to={`/blog/edit/${post.id}`}
                            variant="contained"
                            color="primary"
                        >
                            Edit Post
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            {deleting ? <CircularProgress size={24} /> : "Delete Post"}
                        </Button>
                    </Box>
                )}
            </Paper>
        </Container>
    );
};

export default BlogPost; 