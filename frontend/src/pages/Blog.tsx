import React, { useState, useEffect } from "react";
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Button,
    Pagination,
} from "@mui/material";
import { Link } from "react-router-dom";
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
}

const Blog: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { user } = useAuth();
    const postsPerPage = 6;

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await api.get(
                    `/blog/?skip=${(page - 1) * postsPerPage}&limit=${postsPerPage}`
                );
                setPosts(response.data);
                // Assuming we get total count from the API
                setTotalPages(Math.ceil(response.data.length / postsPerPage));
            } catch (error) {
                console.error("Error fetching blog posts:", error);
            }
        };

        fetchPosts();
    }, [page]);

    const handlePageChange = (
        event: React.ChangeEvent<unknown>,
        value: number
    ) => {
        setPage(value);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 4,
                }}
            >
                <Typography variant="h4" component="h1">
                    Blog
                </Typography>
                {user && (
                    <Button
                        component={Link}
                        to="/blog/new"
                        variant="contained"
                        color="primary"
                    >
                        Create Post
                    </Button>
                )}
            </Box>

            <Grid container spacing={4}>
                {posts.map((post) => (
                    <Grid item key={post.id} xs={12} sm={6} md={4}>
                        <Card
                            sx={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            {post.image_url && (
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={post.image_url}
                                    alt={post.title}
                                />
                            )}
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {post.title}
                                </Typography>
                                <Typography
                                    sx={{
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        display: "-webkit-box",
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: "vertical",
                                    }}
                                >
                                    {post.content}
                                </Typography>
                                <Button
                                    component={Link}
                                    to={`/blog/${post.slug}`}
                                    sx={{ mt: 2 }}
                                >
                                    Read More
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Pagination
                    count={totalPages}
                    page={page}
                    onChange={handlePageChange}
                    color="primary"
                />
            </Box>
        </Container>
    );
};

export default Blog; 