import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Outlet } from "react-router-dom";
import { authActions } from "../../store/auth-slice";
import { Button, Badge } from "react-bootstrap";

const Welcome = () => {
  const email = useSelector((state) => state.auth.userEmail);
  const [unreadCount, setUnreadCount] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const dbUrl = process.env.REACT_APP_FIREBASE_DB_URL;

  const sanitizeEmail = (email) => email.replace(/\./g, ",");

  // 🔹 Fetch unread count
  useEffect(() => {
    if (!email) return;

    const fetchUnreadCount = async () => {
      try {
        const response = await fetch(
          `${dbUrl}/mails/${sanitizeEmail(email)}/inbox.json`
        );
        const data = await response.json();
        if (data) {
          const mails = Object.values(data);
          const count = mails.filter((mail) => !mail.read).length;
          setUnreadCount(count);
        }
      } catch (err) {
        console.error("❌ Error fetching unread count:", err.message);
      }
    };

    fetchUnreadCount();
  }, [email, dbUrl]);

  const logoutHandler = () => {
    dispatch(authActions.logout());
    navigate("/login");
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
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
          className="w-100 mb-3 d-flex justify-content-between align-items-center"
          onClick={() => navigate("/inbox")}
        >
          <span>📥 Inbox</span>
          {unreadCount > 0 && (
            <Badge bg="primary" pill>
              {unreadCount}
            </Badge>
          )}
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

      <div style={{ flex: 1, padding: "30px" }}>
        <h2>Welcome to your mailbox 🎉</h2>
        <p>Select an option from the left menu.</p>

        <Outlet />
      </div>
    </div>
  );
};

export default Welcome;
