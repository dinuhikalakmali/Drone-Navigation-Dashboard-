import { useState } from "react";
import AppLogo from "@/components/AppLogo";
import PasswordInputWithStrength from "@/components/PasswordInputWithStrength";
import { currentYear } from "@/helpers";
import { Link, useNavigate } from "react-router";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  FormControl,
  FormLabel,
  Row,
} from "react-bootstrap";
import signupImage from "@/assets/images/login-background.png";

const Signup = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSignup = (e) => {
    e.preventDefault();
    // Add API call for signup
    console.log({ name, email, password });
    navigate("/auth/login"); // Redirect to login after signup
  };

  return (
    <div
      className="d-flex flex-column flex-md-row"
      style={{ minHeight: "100vh" }}
    >
      {/* Left Image Section */}
      <Col
        md={6}
        className="d-none d-md-flex align-items-center justify-content-center position-relative p-0"
        style={{
          backgroundImage: `url(${signupImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.4)",
          }}
        ></div>
        <div className="text-white text-center px-3" style={{ zIndex: 1 }}>
          <h1 className="display-5 fw-bold">Join Us!</h1>
          <p className="lead">
            Create your account to access the Asset Management Dashboard
          </p>
        </div>
      </Col>

      {/* Right Form Section */}
      <Col
        md={6}
        className="d-flex align-items-center justify-content-center bg-light"
      >
        <Container>
          <Row className="justify-content-center">
            <Col xxl={8} md={10} sm={12}>
              <Card className="p-5 shadow-lg border-0 rounded-4">
                <div className="text-center mb-4">
                  <h3 className="fw-bold text-primary">
                    Asset Management System
                  </h3>
                  <p className="text-muted mt-3">
                    Let’s get you started. Create your account below.
                  </p>
                </div>

                <Form onSubmit={handleSignup}>
                  <Form.Group className="mb-3" controlId="name">
                    <FormLabel className="fw-semibold">Name</FormLabel>
                    <FormControl
                      type="text"
                      placeholder="ABCD"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="email">
                    <FormLabel className="fw-semibold">Email Address</FormLabel>
                    <FormControl
                      type="email"
                      placeholder="ABCD@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="password">
                    <PasswordInputWithStrength
                      id="password"
                      label="Password"
                      name="password"
                      password={password}
                      setPassword={setPassword}
                      placeholder="••••••••"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="terms">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="termAndPolicy"
                        required
                      />
                      <label
                        className="form-check-label"
                        htmlFor="termAndPolicy"
                      >
                        Agree to the Terms & Policy
                      </label>
                    </div>
                  </Form.Group>

                  <div className="d-grid">
                    <Button
                      type="submit"
                      className="btn-primary py-2 fw-semibold"
                    >
                      Create Account
                    </Button>
                  </div>
                </Form>

                <p className="text-center text-muted mt-4 mb-0">
                  Already have an account?{" "}
                  <Link
                    to="/auth/login"
                    className="text-decoration-none fw-semibold text-primary"
                  >
                    Login
                  </Link>
                </p>
              </Card>

              <p className="text-center text-muted mt-4 mb-0">
                © {currentYear} Asset Management System • All Rights Reserved
              </p>
            </Col>
          </Row>
        </Container>
      </Col>
    </div>
  );
};

export default Signup;
