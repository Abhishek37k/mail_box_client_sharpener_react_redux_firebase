import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  ListGroup,
  Button,
  Card,
  Badge,
} from "react-bootstrap";
import { mailActions } from "../../store/mail-slice";

const Inbox = () => {
  const [mails, setMails] = useState([]);
  const [selectedMail, setSelectedMail] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const sanitizeEmail = (email) => email.replace(/\./g, ",");
  const email = useSelector((state) => state.auth.userEmail);
  const dbUrl = process.env.REACT_APP_FIREBASE_DB_URL;

  // 🔹 Count unread mails
  const unreadCount = mails.filter((mail) => !mail.read).length;

  // 🔹 Select mail and mark as read
  const handleSelectMail = async (mail) => {
    setSelectedMail(mail);

    if (!mail.read) {
      try {
        // Update in Firebase
        await fetch(
          `${dbUrl}/mails/${sanitizeEmail(email)}/inbox/${mail.id}.json`,
          {
            method: "PATCH",
            body: JSON.stringify({ read: true }),
            headers: { "Content-Type": "application/json" },
          }
        );

        // Update local state
        setMails((prev) =>
          prev.map((m) => (m.id === mail.id ? { ...m, read: true } : m))
        );

        // Update Redux (if needed later)
        dispatch(mailActions.markAsRead(mail.id));
      } catch (err) {
        console.error("❌ Error marking mail as read:", err.message);
      }
    }
  };

  // 🔹 Fetch mails on load
  useEffect(() => {
    if (!email) return;

    const fetchMails = async () => {
      try {
        const response = await fetch(
          `${dbUrl}/mails/${sanitizeEmail(email)}/inbox.json`
        );
        const data = await response.json();
        if (data) {
          const loadedMails = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setMails(loadedMails);
        }
      } catch (err) {
        console.error("❌ Error fetching inbox:", err.message);
      }
    };

    fetchMails();
  }, [email, dbUrl]);
  const handleDeleteMail = async (mailId) => {
    try {
      await fetch(
        `${dbUrl}/mails/${sanitizeEmail(email)}/inbox/${mailId}.json`,
        {
          method: "DELETE",
        }
      );

      // Remove from local state
      setMails((prev) => prev.filter((mail) => mail.id !== mailId));

      // If the deleted mail was selected, clear it
      if (selectedMail?.id === mailId) {
        setSelectedMail(null);
      }
    } catch (err) {
      console.error("❌ Error deleting mail:", err.message);
    }
  };
  return (
    <Container fluid className="mt-4">
      {/* 🔹 Header with unread count */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold">
          📥 Inbox <Badge bg="primary">{unreadCount} Unread</Badge>
        </h2>
        <div>
          <Button
            variant="secondary"
            className="me-2"
            onClick={() => navigate("/welcome")}
          >
            ⬅ Back to Home
          </Button>
          <Button variant="primary" onClick={() => navigate("/mailbox")}>
            ✉️ Compose
          </Button>
        </div>
      </div>

      <Row>
        {/* 🔹 Left Mail List */}
        <Col md={4} style={{ maxHeight: "80vh", overflowY: "auto" }}>
          <ListGroup>
            {mails.length === 0 && (
              <ListGroup.Item>No mails found</ListGroup.Item>
            )}
            {mails.map((mail) => (
              <ListGroup.Item
                key={mail.id}
                action
                active={selectedMail?.id === mail.id}
                onClick={() => handleSelectMail(mail)}
                className="mb-2 rounded shadow-sm d-flex justify-content-between align-items-center"
              >
                <div>
                  <div className="fw-bold">{mail.subject}</div>
                  <small className="text-muted">From: {mail.from}</small>
                </div>
                {!mail.read && (
                  <span className="text-primary fw-bold fs-5">●</span>
                )}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteMail(mail.id)}
                >
                  🗑️
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

        {/* 🔹 Right Mail Details */}
        <Col md={8}>
          {selectedMail ? (
            <Card className="shadow-lg">
              <Card.Body>
                <h4 className="fw-bold ">Subject: {selectedMail.subject}  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <Button
                  variant="danger"
                  size="md"
                  onClick={() => handleDeleteMail(selectedMail.id)}
                >
                  🗑️
                </Button></h4>
                <p>
                  <strong>From:</strong> {selectedMail.from}
                </p>
                <p>
                  <strong>To:</strong> {selectedMail.to}
                </p>
                <hr />
                <div
                  dangerouslySetInnerHTML={{ __html: selectedMail.content }}
                />
              </Card.Body>
            </Card>
          ) : (
            <Card className="shadow-lg">
              <Card.Body className="text-center text-muted">
                <p>Select an email to view details</p>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Inbox;
