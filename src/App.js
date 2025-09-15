import { Routes, Route } from "react-router-dom";
import store from "./store";
import Signup from "./components/pages/Signup";
import { Provider } from "react-redux";
import Login from "./components/pages/Login";
import Navbar from "./components/UI/Navbar";

function App() {
  return (
    <Provider store={store}>
      <Navbar />
      {console.log(process.env.REACT_APP_FIREBASE_API_KEY)}
      <Routes>
        <Route path="/" element={<div>Home Page</div>} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Provider>
  );
}

export default App;
