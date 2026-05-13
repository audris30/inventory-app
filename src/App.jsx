import { useState, useEffect } from "react";
import Users from "./pages/Users";
import Inventory from "./pages/Inventory";

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5248/api/users")
      .then(res => res.json())
      .then(data => setUsers(data));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <Users users={users} setUsers={setUsers} />
      <hr />
      <Inventory users={users} />
    </div>
  );
}

export default App;
