import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { authActions } from "../../store/auth-slice";
import { Navbar as RBNavbar, Nav, Container, Button } from "react-bootstrap";

const Navbar = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const userEmail = useSelector((state) => state.auth.userEmail);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(authActions.logout());
    navigate("/login");
  };

  return (
    <RBNavbar bg="dark" variant="dark" expand="lg">
      <Container>
        <RBNavbar.Brand as={Link} to="/">MyApp</RBNavbar.Brand>
        <RBNavbar.Toggle aria-controls="basic-navbar-nav" />
        <RBNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            {!isAuthenticated && (
              <>
                <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
                <Nav.Link as={NavLink} to="/signup">Sign Up</Nav.Link>
              </>
            )}
            {isAuthenticated && (
              <>
                <span className="text-white me-3">{userEmail}</span>
                <Button variant="outline-light" onClick={logoutHandler}>Logout</Button>
              </>
            )}
          </Nav>
        </RBNavbar.Collapse>
      </Container>
    </RBNavbar>
  );
};

export default Navbar;
