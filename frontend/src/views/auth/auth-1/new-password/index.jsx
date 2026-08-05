import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Button, Card, Col, Container, Form, FormControl, FormLabel, Row } from "react-bootstrap";
import axios from "axios";

const Index = () => {
  const [searchParams] = useSearchParams();
  const emailFromUrl = searchParams.get("email") || "";
  const navigate = useNavigate();

  const [email, setEmail] = useState(emailFromUrl);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault(); // ← very important
    setError("");
    setMessage("");

    if (!email) {
      setError("Email is required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/auth/reset-password", {
        email,
        password,
      });

      setMessage("Password updated successfully! Redirecting...");
      setTimeout(() => {
        navigate("/auth/login");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "100vh", background: "#f8f9fa" }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={5}>
            <Card className="p-4 shadow-sm">
              <div className="text-center mb-4">
                <h4 className="fw-bold">Reset Password</h4>
                <p className="text-muted">Enter your new password</p>
              </div>

              <Form onSubmit={handleSubmit}>
                {message && <div className="alert alert-success">{message}</div>}
                {error && <div className="alert alert-danger">{error}</div>}

                <div className="mb-3">
                  <FormLabel>Email</FormLabel>
                  <FormControl
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <FormLabel>New Password</FormLabel>
                  <FormControl
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="d-grid">
                  <Button type="submit" variant="primary" disabled={loading}>
                    {loading ? "Updating..." : "Update Password"}
                  </Button>
                </div>
              </Form>

              <p className="text-center mt-3 mb-0">
                <Link to="/auth/login">Back to Sign In</Link>
              </p>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Index;