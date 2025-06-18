import React, { useState, useEffect } from "react";
import {
    Box,
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
} from "@mui/material";
import {
    Delete as DeleteIcon,
    Computer as ComputerIcon,
    Phone as PhoneIcon,
    Tablet as TabletIcon,
} from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../api";

interface Session {
    id: number;
    ip: string | null;
    user_agent: string | null;
    created_at: string;
    last_used_at: string;
    is_active: boolean;
}

const Sessions: React.FC = () => {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
    const { user } = useAuth();

    const fetchSessions = async () => {
        try {
            const response = await api.get("/auth/sessions");
            setSessions(response.data);
        } catch (error) {
            console.error("Error fetching sessions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    const handleDeleteSession = async (sessionId: number) => {
        setSelectedSessionId(sessionId);
        setConfirmDialogOpen(true);
    };

    const confirmDeleteSession = async () => {
        if (!selectedSessionId) return;

        setDeleting(true);
        try {
            await api.delete(`/auth/sessions/${selectedSessionId}`);
            await fetchSessions();
        } catch (error) {
            console.error("Error deleting session:", error);
        } finally {
            setDeleting(false);
            setConfirmDialogOpen(false);
            setSelectedSessionId(null);
        }
    };

    const handleRevokeOtherSessions = async () => {
        setDeleting(true);
        try {
            await api.delete("/auth/sessions");
            await fetchSessions();
        } catch (error) {
            console.error("Error revoking other sessions:", error);
        } finally {
            setDeleting(false);
        }
    };

    const getDeviceIcon = (userAgent: string | null) => {
        if (!userAgent) return <ComputerIcon />;
        const agent = userAgent.toLowerCase();
        if (agent.includes("mobile")) return <PhoneIcon />;
        if (agent.includes("tablet")) return <TabletIcon />;
        return <ComputerIcon />;
    };

    if (!user) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Typography variant="h5" align="center">
                    Please log in to view your sessions.
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="h4" component="h1">
                    Active Sessions
                </Typography>
                <Button
                    variant="outlined"
                    color="error"
                    onClick={handleRevokeOtherSessions}
                    disabled={deleting}
                >
                    {deleting ? <CircularProgress size={24} /> : "Revoke Other Sessions"}
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Device</TableCell>
                            <TableCell>IP Address</TableCell>
                            <TableCell>Last Active</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sessions.map((session) => (
                            <TableRow key={session.id}>
                                <TableCell>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        {getDeviceIcon(session.user_agent)}
                                        <Typography>
                                            {session.user_agent?.split("(")[0] || "Unknown Device"}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>{session.ip || "Unknown"}</TableCell>
                                <TableCell>
                                    {new Date(session.last_used_at).toLocaleString()}
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDeleteSession(session.id)}
                                        disabled={deleting}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={confirmDialogOpen}
                onClose={() => setConfirmDialogOpen(false)}
            >
                <DialogTitle>Confirm Session Deletion</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to revoke this session? You will be logged out from this device.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={confirmDeleteSession}
                        color="error"
                        disabled={deleting}
                    >
                        {deleting ? <CircularProgress size={24} /> : "Revoke"}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Sessions; 