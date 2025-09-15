import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../../store/auth"; 
import { useNavigate } from "react-router-dom";
import { Form, Button, Card, Alert, Container } from "react-bootstrap";

const Signup =() =>{
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const error = useSelector((state) => state.auth.error);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // Redirect if already logged in
  if (isAuthenticated) {
    navigate("/");
  }

  const formSubmitHandler = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    dispatch(signupUser({ email, password }));
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "90vh" }}>
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <Card className="shadow-lg">
          <Card.Body>
            <h2 className="text-center mb-4">Sign Up</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={formSubmitHandler}>
              <Form.Group id="email" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group id="password" className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group id="confirmPassword" className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </Form.Group>

              <Button className="w-100" type="submit">Sign Up</Button>
            </Form>

            <div className="text-center mt-3">
              Already have an account?{" "}
              <Button
                variant="link"
                onClick={() => navigate("/login")}
                className="p-0"
              >
                Login
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
}

export default Signup;
