import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Outlet } from "react-router-dom";
import { authActions } from "../../store/auth-slice";
import { Button } from "react-bootstrap";

const Welcome = () => {
  const email = useSelector((state) => state.auth.userEmail);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(authActions.logout());
    navigate("/login");
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "250px",
          background: "#f8f9fa",
          padding: "20px",
          borderRight: "1px solid #ddd",
        }}
      >
        <h4 style={{ marginBottom: "30px" }}>📬 Mailbox</h4>

        <Button
          variant="primary"
          className="w-100 mb-3"
          onClick={() => navigate("/mailbox")}
        >
          ✉️ Compose
        </Button>

        <Button
          variant="outline-secondary"
          className="w-100 mb-3"
          onClick={() => navigate("/inbox")}
        >
          📥 Inbox
        </Button>

        <Button
          variant="outline-secondary"
          className="w-100 mb-3"
          onClick={() => navigate("/sent")}
        >
          📤 Sent
        </Button>

        <hr />

        <div style={{ marginTop: "auto" }}>
          <p>
            Logged in as: <br />
            <strong style={{ wordBreak: "break-word" }}>{email}</strong>
          </p>
          <Button onClick={logoutHandler} variant="danger" className="w-100">
            🚪 Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "30px" }}>
        <h2>Welcome to your mailbox 🎉</h2>
        <p>Select an option from the left menu.</p>

        {/* 👉 This will render child routes like Inbox, Sent, Mailbox */}
        <Outlet />
      </div>
    </div>
  );
};

export default Welcome;
