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
import useFetch from "../CustomHooks/useFetch";

const Inbox = () => {
  const [mails, setMails] = useState([]);
  const [selectedMail, setSelectedMail] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const sanitizeEmail = (email) => email.replace(/\./g, ",");
  const email = useSelector((state) => state.auth.userEmail);
  const dbUrl = process.env.REACT_APP_FIREBASE_DB_URL;

  const url = email
    ? `${dbUrl}/mails/${sanitizeEmail(email)}/inbox.json`
    : null;

  const { data, loading, error } = useFetch(url, 2000);

  useEffect(() => {
    if (data) {
      const loadedMails = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      setMails((prev) => {
        const prevIds = prev.map((m) => m.id).sort().join(",");
        const newIds = loadedMails.map((m) => m.id).sort().join(",");
        return prevIds !== newIds ? loadedMails : prev;
      });
    } else if (data === null) {
      setMails([]);
    }
  }, [data]);

  const unreadCount = mails.filter((mail) => !mail.read).length;

  const handleSelectMail = async (mail) => {
    setSelectedMail(mail);
    if (!mail.read) {
      try {
        await fetch(
          `${dbUrl}/mails/${sanitizeEmail(email)}/inbox/${mail.id}.json`,
          {
            method: "PATCH",
            body: JSON.stringify({ read: true }),
            headers: { "Content-Type": "application/json" },
          }
        );
        setMails((prev) =>
          prev.map((m) => (m.id === mail.id ? { ...m, read: true } : m))
        );
        dispatch(mailActions.markAsRead(mail.id));
      } catch (err) {
        console.error("❌ Error marking mail as read:", err.message);
      }
    }
  };

  const handleDeleteMail = async (mailId) => {
    try {
      await fetch(
        `${dbUrl}/mails/${sanitizeEmail(email)}/inbox/${mailId}.json`,
        { method: "DELETE" }
      );
      setMails((prev) => prev.filter((m) => m.id !== mailId));
    } catch (err) {
      console.error("❌ Error deleting mail:", err.message);
    }
  };

  return (
    <Container fluid className="mt-4">
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
        <Col md={4} style={{ maxHeight: "80vh", overflowY: "auto" }}>
          <ListGroup>
            {loading && <ListGroup.Item>Loading mails...</ListGroup.Item>}
            {error && <ListGroup.Item>Error: {error}</ListGroup.Item>}
            {!loading && mails.length === 0 && (
              <ListGroup.Item>No mails found</ListGroup.Item>
            )}
            {mails.map((mail) => (
              <ListGroup.Item
                as="div"
                key={mail.id}
                action
                active={selectedMail?.id === mail.id}
                className="mb-2 rounded shadow-sm d-flex justify-content-between align-items-center"
              >
                <div
                  onClick={() => handleSelectMail(mail)}
                  style={{ cursor: "pointer", flex: 1 }}
                >
                  <div className="fw-bold">{mail.subject}</div>
                  <small className="text-muted">From: {mail.from}</small>
                  {!mail.read && (
                    <span className="text-primary fw-bold fs-5 ms-2">●</span>
                  )}
                </div>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDeleteMail(mail.id)}
                >
                  🗑
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

        <Col md={8}>
          {selectedMail ? (
            <Card className="shadow-lg">
              <Card.Body>
                <h4 className="fw-bold">Subject: {selectedMail.subject}</h4>
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
