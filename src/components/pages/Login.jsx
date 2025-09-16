import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../store/auth";
import { Form, Button, Card, Alert, Container } from "react-bootstrap";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const error = useSelector((state) => state.auth.error);

  const formSubmitHandler = async (e) => {
    e.preventDefault();
    const success = await dispatch(loginUser({ email, password }));
    console.log("Login success:", success);
    if (success) {
      navigate("/welcome");
    }
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: "90vh" }}
    >
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <Card className="shadow-lg">
          <Card.Body>
            <h2 className="text-center mb-4">Login</h2>
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

              <Button className="w-100" type="submit">
                Login
              </Button>
            </Form>

            <div className="text-center mt-3">
              Doesn't have an account?{" "}
              <Button
                variant="link"
                onClick={() => navigate("/signup")}
                className="p-0"
              >
                Signup
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    </Container>
  );
};

export default Login;
