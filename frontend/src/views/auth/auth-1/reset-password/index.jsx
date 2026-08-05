import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Col, Container, Form, FormControl, FormLabel, Row } from "react-bootstrap";
import axios from "axios";
import AppLogo from "@/components/AppLogo";
import { currentYear } from "@/helpers";

const Index = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/forgot-password", {
        email,
      });

      setMessage(response.data.message || "Reset link sent successfully!");
      setEmail("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-box overflow-hidden align-items-center d-flex">
      <Container>
        <Row className="justify-content-center">
          <Col xxl={4} md={6} sm={8}>
            <Card className="p-4">
              <div className="auth-brand text-center mb-4">
                <AppLogo />
                <p className="text-muted w-lg-75 mt-3 mx-auto">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <Form onSubmit={handleSubmit}>
                {message && <p className="text-success text-center">{message}</p>}
                {error && <p className="text-danger text-center">{error}</p>}

                <div className="mb-3">
                  <FormLabel>
                    Email address <span className="text-danger">*</span>
                  </FormLabel>
                  <FormControl
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <Form.Check
                    type="checkbox"
                    id="termAndPolicy"
                    label="Agree the Terms & Policy"
                    required
                  />
                </div>

                <div className="d-grid">
                  <Button type="submit" className="btn-primary fw-semibold py-2" disabled={loading}>
                    {loading ? "Sending..." : "Send Request"}
                  </Button>
                </div>
              </Form>

              <p className="text-muted text-center mt-4 mb-0">
                Return to{" "}
                <Link to="/auth/login" className="text-decoration-underline link-offset-3 fw-semibold">
                  Sign in
                </Link>
              </p>
            </Card>

            <p className="text-center text-muted mt-4 mb-0">
              © {currentYear} Intelligent Drone-Based System For Real Time Dashboard
            </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Index;