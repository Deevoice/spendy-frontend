import React, { useState } from "react";
import {
    Container,
    Paper,
    Typography,
    Box,
    Avatar,
    Button,
    TextField,
    Grid,
    Divider,
    Alert,
} from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../api";
import Sessions from "../components/Sessions";

const Profile: React.FC = () => {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        full_name: user?.full_name || "",
        email: user?.email || "",
    });
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            const response = await api.put("/users/me", formData);
            updateUser(response.data);
            setSuccess("Profile updated successfully");
            setIsEditing(false);
        } catch (error: any) {
            setError(error.response?.data?.detail || "Failed to update profile");
        }
    };

    if (!user) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Typography variant="h5" align="center">
                    Please log in to view your profile.
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                    <Avatar
                        src={user.avatar}
                        alt={user.full_name}
                        sx={{ width: 100, height: 100, mr: 3 }}
                    />
                    <Box>
                        <Typography variant="h4" component="h1">
                            {user.full_name}
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {user.email}
                        </Typography>
                    </Box>
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {success}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Full Name"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
                        </Grid>
                    </Grid>

                    <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                        {isEditing ? (
                            <>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                >
                                    Save Changes
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        setIsEditing(false);
                                        setFormData({
                                            full_name: user.full_name,
                                            email: user.email,
                                        });
                                    }}
                                >
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setIsEditing(true)}
                            >
                                Edit Profile
                            </Button>
                        )}
                    </Box>
                </form>

                <Divider sx={{ my: 4 }} />

                <Sessions />
            </Paper>
        </Container>
    );
};

export default Profile; 