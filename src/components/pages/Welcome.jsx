import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authActions } from "../../store/auth-slice";
import { Button, Container } from "react-bootstrap";

const Welcome = () => {
  const email = useSelector((state) => state.auth.userEmail);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(authActions.logout());
    navigate("/login");
  };

  return (
    <Container className="text-center mt-5">
      <h1>Welcome to your mail box 🎉</h1>
      <p>You are logged in as <strong>{email}</strong></p>
      <Button onClick={logoutHandler} variant="danger">
        Logout
      </Button>
    </Container>
  );
};

export default Welcome;
