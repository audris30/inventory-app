import { useState } from "react";

function Users({ users, setUsers }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const addUser = () => {
    if (!firstName || !lastName) return;

    const newUser = {
      id: Date.now(),
      firstName,
      lastName
    };

    setUsers((prev) => [...prev, newUser]);

    setFirstName("");
    setLastName("");
  };

  return (
    <div>
      <h2>Users</h2>

      <input
        placeholder="First name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />

      <input
        placeholder="Last name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />

      <button onClick={addUser}>Add user</button>

      <ul>
        {users.map((u) => (
          <li key={u.id}>
            {u.firstName} {u.lastName}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Users;
