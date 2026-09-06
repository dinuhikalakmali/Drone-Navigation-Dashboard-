import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Col, Container, Row, Table, Button, Form, Badge, Spinner, Modal } from "react-bootstrap";
import axios from "axios";

const UserRoleManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [editingUserId, setEditingUserId] = useState(null);
    const [editingRole, setEditingRole] = useState("");
    const [savingId, setSavingId] = useState(null);

    // Create User Modal States
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newUserData, setNewUserData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        type: "site engineer",
    });
    const [creatingUser, setCreatingUser] = useState(false);

    const AVAILABLE_ROLES = [
        { value: "admin", label: "Admin" },
        { value: "project supervisor", label: "Project Supervisor" },
        { value: "site engineer", label: "Site Engineer" },
        { value: "qa officer", label: "QA Officer" },
    ];

    // Fetch all users
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await axios.get("http://localhost:5000/api/auth/users", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                },
            });

            if (response.data.success) {
                setUsers(response.data.data || []);
            } else {
                setError("Failed to fetch users");
            }
        } catch (err) {
            console.error("Error fetching users:", err);
            setError(err.response?.data?.message || "Error fetching users. Make sure the backend is running.");
        } finally {
            setLoading(false);
        }
    };

    const handleEditRole = (userId, currentRole) => {
        setEditingUserId(userId);
        setEditingRole(currentRole);
    };

    const handleCancelEdit = () => {
        setEditingUserId(null);
        setEditingRole("");
    };

    const handleSaveRole = async (userId, userName) => {
        if (!editingRole) {
            setError("Please select a role");
            return;
        }

        setSavingId(userId);
        setError("");

        try {
            const response = await axios.put(
                `http://localhost:5000/api/auth/users/${userId}/role`,
                { role: editingRole },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                }
            );

            if (response.data.success || response.status === 200) {
                setSuccess(`Role updated successfully for ${userName}`);
                setUsers(users.map((user) =>
                    user._id === userId ? { ...user, type: editingRole } : user
                ));
                setEditingUserId(null);
                setEditingRole("");

                // Clear success message after 3 seconds
                setTimeout(() => setSuccess(""), 3000);
            }
        } catch (err) {
            console.error("Error updating role:", err);
            setError(err.response?.data?.message || "Failed to update role");
        } finally {
            setSavingId(null);
        }
    };

    const getRoleBadgeColor = (role) => {
        switch (role?.toLowerCase()) {
            case "admin":
                return "danger";
            case "project supervisor":
                return "primary";
            case "site engineer":
                return "info";
            case "qa officer":
                return "success";
            default:
                return "secondary";
        }
    };

    const handleOpenCreateModal = () => {
        setShowCreateModal(true);
        setError("");
        setSuccess("");
    };

    const handleCloseCreateModal = () => {
        setShowCreateModal(false);
        setNewUserData({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            type: "site engineer",
        });
    };

    const handleNewUserChange = (e) => {
        const { name, value } = e.target;
        setNewUserData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCreateUser = async () => {
        setError("");

        // Validation
        if (!newUserData.name || !newUserData.email || !newUserData.password) {
            setError("Name, email, and password are required");
            return;
        }

        if (newUserData.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        if (newUserData.password !== newUserData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (!newUserData.type) {
            setError("Please select a role");
            return;
        }

        setCreatingUser(true);

        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/register",
                {
                    name: newUserData.name,
                    email: newUserData.email,
                    password: newUserData.password,
                    type: newUserData.type,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                    },
                }
            );

            if (response.data.user || response.status === 201) {
                setSuccess(`User ${newUserData.name} created successfully!`);
                handleCloseCreateModal();
                fetchUsers(); // Refresh the user list
                setTimeout(() => setSuccess(""), 3000);
            }
        } catch (err) {
            console.error("Error creating user:", err);
            setError(
                err.response?.data?.message ||
                "Failed to create user. Please try again."
            );
        } finally {
            setCreatingUser(false);
        }
    };

    return (
        <Container fluid>
            <Row>
                <Col lg={12}>
                    <Card className="shadow-sm">
                        <CardHeader className="bg-light d-flex justify-content-between align-items-center gap-2">
                            <h5 className="mb-0">User Role Management</h5>
                            <div className="d-flex gap-2">
                                <Button
                                    variant="success"
                                    size="sm"
                                    onClick={handleOpenCreateModal}
                                    disabled={loading}
                                >
                                    + Create New User
                                </Button>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={fetchUsers}
                                    disabled={loading}
                                >
                                    {loading ? "Refreshing..." : "Refresh"}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardBody>
                            {error && (
                                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                                    {error}
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setError("")}
                                    ></button>
                                </div>
                            )}

                            {success && (
                                <div className="alert alert-success alert-dismissible fade show" role="alert">
                                    {success}
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => setSuccess("")}
                                    ></button>
                                </div>
                            )}

                            {loading ? (
                                <div className="text-center py-5">
                                    <Spinner animation="border" role="status">
                                        <span className="visually-hidden">Loading users...</span>
                                    </Spinner>
                                </div>
                            ) : users.length === 0 ? (
                                <div className="alert alert-info">No users found</div>
                            ) : (
                                <Table striped bordered hover responsive className="align-middle">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Current Role</th>
                                            <th>Change Role</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((user) => (
                                            <tr key={user._id}>
                                                <td className="fw-bold">{user.name || "N/A"}</td>
                                                <td>{user.email}</td>
                                                <td>
                                                    <Badge bg={getRoleBadgeColor(user.type)}>
                                                        {user.type?.toUpperCase() || "USER"}
                                                    </Badge>
                                                </td>
                                                <td>
                                                    {editingUserId === user._id ? (
                                                        <Form.Select
                                                            value={editingRole}
                                                            onChange={(e) => setEditingRole(e.target.value)}
                                                            size="sm"
                                                        >
                                                            <option value="">Select a role</option>
                                                            {AVAILABLE_ROLES.map((role) => (
                                                                <option key={role.value} value={role.value}>
                                                                    {role.label}
                                                                </option>
                                                            ))}
                                                        </Form.Select>
                                                    ) : (
                                                        <span className="text-muted">
                                                            {editingUserId !== user._id && "Click Edit to change"}
                                                        </span>
                                                    )}
                                                </td>
                                                <td>
                                                    {editingUserId === user._id ? (
                                                        <div className="d-flex gap-2">
                                                            <Button
                                                                variant="success"
                                                                size="sm"
                                                                onClick={() =>
                                                                    handleSaveRole(user._id, user.name)
                                                                }
                                                                disabled={savingId === user._id}
                                                            >
                                                                {savingId === user._id ? (
                                                                    <>
                                                                        <Spinner
                                                                            animation="border"
                                                                            size="sm"
                                                                            className="me-2"
                                                                        />
                                                                        Saving...
                                                                    </>
                                                                ) : (
                                                                    "Save"
                                                                )}
                                                            </Button>
                                                            <Button
                                                                variant="secondary"
                                                                size="sm"
                                                                onClick={handleCancelEdit}
                                                            >
                                                                Cancel
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <Button
                                                            variant="primary"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleEditRole(user._id, user.type)
                                                            }
                                                        >
                                                            Edit
                                                        </Button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            {/* Info Card */}
            <Row className="mt-4">
                <Col lg={12}>
                    <Card className="bg-light border-0">
                        <CardBody>
                            <h6 className="mb-3">Role Definitions:</h6>
                            <ul className="mb-0">
                                <li>
                                    <strong>Admin:</strong> Full access to all features including
                                    user management and system settings.
                                </li>
                                <li>
                                    <strong>Project Supervisor:</strong> Full access to all
                                    project-related features.
                                </li>
                                <li>
                                    <strong>Site Engineer:</strong> Access to inspection,
                                    defects, reports, and assets.
                                </li>
                                <li>
                                    <strong>QA Officer:</strong> Access to defect reviews and
                                    quality assurance features.
                                </li>
                            </ul>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            {/* Create User Modal */}
            <Modal show={showCreateModal} onHide={handleCloseCreateModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Create New User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && (
                        <div className="alert alert-danger alert-dismissible fade show" role="alert">
                            {error}
                            <button
                                type="button"
                                className="btn-close"
                                onClick={() => setError("")}
                            ></button>
                        </div>
                    )}

                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Full Name *</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={newUserData.name}
                                onChange={handleNewUserChange}
                                placeholder="Enter full name"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Email Address *</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={newUserData.email}
                                onChange={handleNewUserChange}
                                placeholder="Enter email address"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password *</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={newUserData.password}
                                onChange={handleNewUserChange}
                                placeholder="Minimum 6 characters"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Confirm Password *</Form.Label>
                            <Form.Control
                                type="password"
                                name="confirmPassword"
                                value={newUserData.confirmPassword}
                                onChange={handleNewUserChange}
                                placeholder="Re-enter password"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>User Role *</Form.Label>
                            <Form.Select
                                name="type"
                                value={newUserData.type}
                                onChange={handleNewUserChange}
                            >
                                {AVAILABLE_ROLES.map((role) => (
                                    <option key={role.value} value={role.value}>
                                        {role.label}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={handleCloseCreateModal}
                        disabled={creatingUser}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="success"
                        onClick={handleCreateUser}
                        disabled={creatingUser}
                    >
                        {creatingUser ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2" />
                                Creating...
                            </>
                        ) : (
                            "Create User"
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default UserRoleManagement;
