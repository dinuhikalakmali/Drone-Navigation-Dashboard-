import { useState } from "react";
import { currentYear } from "@/helpers";
import { useNavigate } from "react-router";
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
import axios from "axios";
import loginImage from "@/assets/images/login-background.png";

const Index = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    // navigate("/dashboard");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email: username, password }
      );
      console.log(response);

      if (response.status == 200) {
        if (response.data.user.type == "site engineer" || response.data.user.type == "project supervisor" || response.data.user.type == "quality manager") {
          localStorage.setItem(
            "authToken",
            response.data.token || "dummyToken"
          );
          localStorage.setItem("userData", JSON.stringify(response.data.user));
          navigate("/dashboard");
        }
        else {
          setError("User type is invalid!")
        }
        
      } else {
        setError("Username or password is incorrect");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div
      className="d-flex flex-column flex-md-row"
      style={{ minHeight: "100vh" }}
    >
      {/* Left Side Image */}
      <Col
        md={6}
        className="d-none d-md-flex align-items-center justify-content-center position-relative p-0"
        style={{
          backgroundImage: `url(${loginImage})`,
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
            backgroundColor: "rgba(0,0,0,0.4)", // subtle overlay
          }}
        ></div>
        <div className="text-white text-center px-3" style={{ zIndex: 1 }}>
          <h1 className="display-5 fw-bold">Intelligent Drone-Based System For Real Time Dashboard</h1>
          <p className="lead">
            Sign in to access your Intelligent Drone-Based System For Real Time Dashboard
          </p>
        </div>
      </Col>

      {/* Right Side Login Form */}
      <Col
        md={6}
        className="d-flex align-items-center justify-content-center bg-light"
      >
        <Container>
          <Row className="justify-content-center">
            <Col xxl={8} md={10} sm={12}>
              <Card className="p-5 shadow-lg border-0 rounded-4">
                {/* Brand / Logo */}
                <div className="text-center mb-4">
                  <h3 className="fw-bold text-primary">
                    Intelligent Drone-Based System For Real Time Dashboard
                  </h3>
                  <p className="text-muted">
                    Sign in to your account to continue
                  </p>
                </div>

                {/* Login Form */}
                <Form onSubmit={handleLogin}>
                  {error && <p className="text-danger text-center">{error}</p>}

                  <Form.Group className="mb-3" controlId="username">
                    <FormLabel className="fw-semibold">Username</FormLabel>
                    <FormControl
                      type="email"
                      placeholder="Enter your email"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="password">
                    <FormLabel className="fw-semibold">Password</FormLabel>
                    <FormControl
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <Form.Check
                      type="checkbox"
                      label="Remember me"
                      id="rememberMe"
                    />
                    <a
                      href="/auth-1/reset-password"
                      className="text-decoration-none"
                    >
                      Forgot Password?
                    </a>
                  </div>

                  <div className="d-grid">
                    <Button
                      type="submit"
                      className="btn-primary py-2 fw-semibold"
                    >
                      Sign In
                    </Button>
                  </div>
                </Form>
              </Card>

              <p className="text-center text-muted mt-4 mb-0">
                © {currentYear} Intelligent Drone-Based System For Real Time Dashboard• All Rights Reserved
              </p>
            </Col>
          </Row>
        </Container>
      </Col>
    </div>
  );
};

export default Index;
