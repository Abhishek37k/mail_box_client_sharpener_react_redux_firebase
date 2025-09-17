import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

function MailEditor() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const dbUrl = process.env.REACT_APP_FIREBASE_DB_URL;
  console.log("Database URL:", dbUrl);
  const from = useSelector((state) => state.auth.userEmail);

  const sanitizeEmail = (email) => email.replace(/\./g, ",");

  const handleSend = async () => {
    const rawContent = convertToRaw(editorState.getCurrentContent());
    const htmlContent = draftToHtml(rawContent);

    const mailData = {
      from,
      to,
      subject,
      content: htmlContent,
      timestamp: Date.now(),
       read: false,   
    };

    console.log("📨 Preparing to send mail:", mailData);

    try {
      // 🔹 Save to Sender → Sent
      const senderResponse = await fetch(
        `${dbUrl}/mails/${sanitizeEmail(from)}/sent.json`,
        {
          method: "POST",
          body: JSON.stringify(mailData),
          headers: { "Content-Type": "application/json" },
        }
      );
      const senderData = await senderResponse.json();

      if (!senderResponse.ok) {
        throw new Error(senderData.error || "Failed to save in Sent box");
      }
      console.log("✅ Mail saved to SENT folder:", senderData);

      // 🔹 Save to Receiver → Inbox
      const receiverResponse = await fetch(
        `${dbUrl}/mails/${sanitizeEmail(to)}/inbox.json`,
        {
          method: "POST",
          body: JSON.stringify(mailData),
          headers: { "Content-Type": "application/json" },
        }
      );
      const receiverData = await receiverResponse.json();

      if (!receiverResponse.ok) {
        throw new Error(receiverData.error || "Failed to save in Inbox");
      }
      console.log("✅ Mail saved to RECEIVER's INBOX:", receiverData);

      // 🔹 Reset form
      alert("✅ Mail sent successfully!");
      setTo("");
      setSubject("");
      setEditorState(EditorState.createEmpty());
    } catch (err) {
      console.error("❌ Error sending mail:", err.message);
    }
  };

  return (
    <div style={{ maxWidth: "1000px", margin: "20px auto" }}>
      <input
        type="email"
        placeholder="To"
        value={to}
        onChange={(e) => setTo(e.target.value)}
        style={{
          width: "100%",
          marginBottom: "10px",
          padding: "8px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      />

      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        style={{
          width: "100%",
          marginBottom: "10px",
          padding: "8px",
          border: "1px solid #ccc",
          borderRadius: "5px",
        }}
      />

      <div
        style={{
          border: "1px solid #ccc",
          minHeight: "200px",
          margin: "10px 0",
        }}
      >
        <Editor
          editorState={editorState}
          onEditorStateChange={setEditorState}
          toolbar={{
            options: ["inline", "list", "textAlign", "link", "history"],
          }}
        />
      </div>

      <button
        onClick={handleSend}
        style={{
          background: "#007bff",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Send Mail
      </button>
    </div>
  );
}

export default MailEditor;
