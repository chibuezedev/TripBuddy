import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Chat from "@/components/chat";
import Login from "@/components/login";

function App() {
  const [user, setUser] = useState(null);
  const [secret, setSecret] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedSecret = localStorage.getItem("token");
    if (savedUser && savedSecret) {
      setUser(savedUser);
      setSecret(savedSecret);
    }
  }, []);
console.log("user token", secret)
console.log("User saved", user)
  const isAuth = Boolean(user) && Boolean(secret);
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              isAuth ? (
                <Navigate to="/chat" />
              ) : (
                <Login setUser={setUser} setSecret={setSecret} />
              )
            }
          />
          <Route
            path="/chat"
            element={
              isAuth ? (
                <Chat user={user} secret={secret}/>
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
