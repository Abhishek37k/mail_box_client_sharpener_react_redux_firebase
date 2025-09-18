import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, ListGroup, Button, Card } from "react-bootstrap";
import useFetch from "../CustomHooks/useFetch";

const Sent = () => {
  const [mails, setMails] = useState([]);
  const [selectedMail, setSelectedMail] = useState(null);
  const navigate = useNavigate();

  const sanitizeEmail = (email) => email.replace(/\./g, ",");
  const email = useSelector((state) => state.auth.userEmail);
  const dbUrl = process.env.REACT_APP_FIREBASE_DB_URL;

  const url = email
    ? `${dbUrl}/mails/${sanitizeEmail(email)}/sent.json`
    : null;

  const { data, loading, error } = useFetch(url);

  useEffect(() => {
    if (data) {
      const loadedMails = Object.keys(data).map((key) => ({
        id: key,
        ...data[key],
      }));
      setMails(loadedMails);
    } else if (data === null) {
      setMails([]);
    }
  }, [data]);

  return (
    <Container fluid className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="fw-bold">📤 Sent BOX</h2>

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
        {/* Left Mail List */}
        <Col md={4} style={{ maxHeight: "80vh", overflowY: "auto" }}>
          <ListGroup>
            {loading && <ListGroup.Item>Loading mails...</ListGroup.Item>}
            {error && <ListGroup.Item>Error: {error}</ListGroup.Item>}
            {!loading && mails.length === 0 && (
              <ListGroup.Item>No mails found</ListGroup.Item>
            )}

            {mails.map((mail) => (
              <ListGroup.Item
                key={mail.id}
                action
                active={selectedMail?.id === mail.id}
                onClick={() => setSelectedMail(mail)}
                className="mb-2 rounded shadow-sm"
              >
                <div className="fw-bold">Subject: {mail.subject}</div>
                <small className="text-muted">To: {mail.to}</small>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

        {/* Right Mail Details */}
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

export default Sent;
