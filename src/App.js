import { Routes, Route } from "react-router-dom";
import store from "./store";
import Signup from "./components/pages/Signup";
import { Provider } from "react-redux";
import Sent from "./components/mailbox/Sent";
import Inbox from "./components/mailbox/Inbox";
import Login from "./components/pages/Login";
import Navbar from "./components/UI/Navbar";
import Mailbox from "./components/mailbox/Mailbox";
import Welcome from "./components/pages/Welcome";
import ProtectedRoute from "./components/UI/ProtectedRoute"; // ✅ import

function App() {
  return (
    <Provider store={store}>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Welcome />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ✅ Protected Routes */}
        <Route
          path="/welcome"
          element={
            <ProtectedRoute>
              <Welcome />
            </ProtectedRoute>
          }
        />
        <Route
          path="/inbox"
          element={
            <ProtectedRoute>
              <Inbox />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sent"
          element={
            <ProtectedRoute>
              <Sent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/mailbox"
          element={
            <ProtectedRoute>
              <Mailbox />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Provider>
  );
}

export default App;
