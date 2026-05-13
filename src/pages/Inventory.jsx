import { useState, useEffect } from "react";

function Inventory({ users }) {
  const [items, setItems] = useState([]);

  const [type, setType] = useState("Tablet");
  const [comment, setComment] = useState("");
  const [userId, setUserId] = useState("");

  const [filter, setFilter] = useState("");
  const [userFilter, setUserFilter] = useState("");
  const [search, setSearch] = useState("");

  const [editingItem, setEditingItem] = useState(null);

  const [template, setTemplate] = useState("simple");

  const [loading, setLoading] = useState(false);

  // GET
  useEffect(() => {
    fetch("http://localhost:5248/api/inventory")
      .then((res) => res.json())
      .then((data) => setItems(data));
  }, []);

  // ADD
  const addItem = () => {
    if (!comment.trim() || !userId) return;

    const selectedUser = users.find(
      (u) => u.id === Number(userId)
    );

    if (!selectedUser) return;

    const newItem = {
      type,
      comment,
      userId: Number(userId),
      user: `${selectedUser.firstName} ${selectedUser.lastName}`,
      date: new Date().toISOString().split("T")[0],
      active: true
    };

    fetch("http://localhost:5248/api/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem)
    });

    setItems((prev) => [...prev, newItem]);

    setComment("");
    setUserId("");
    setType("Tablet");
  };

  // EDIT
  const editItem = (item) => {
    setEditingItem(item);
    setType(item.type);
    setComment(item.comment);
    setUserId(item.userId.toString());
  };

  const saveEdit = () => {
    const selectedUser = users.find(
      (u) => u.id === Number(userId)
    );

    if (!selectedUser) return;

    const updatedItem = {
      ...editingItem,
      type,
      comment,
      userId: Number(userId),
      user: `${selectedUser.firstName} ${selectedUser.lastName}`
    };

    fetch(`http://localhost:5248/api/inventory/${editingItem.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedItem)
    })
      .then((res) => res.json())
      .then((data) => {
        setItems((prev) =>
          prev.map((i) => (i.id === data.id ? data : i))
        );

        setEditingItem(null);
        setComment("");
        setUserId("");
        setType("Tablet");
      });
  };

  // DELETE
  const deleteItem = async (id) => {
    await fetch(`http://localhost:5248/api/inventory/${id}`, {
      method: "DELETE"
    });

    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  // FILTER
  const filteredItems = items.filter((item) => {
    return (
      item.active &&
      (filter === "" || item.type === filter) &&
      (userFilter === "" || item.user === userFilter) &&
      (search === "" ||
        item.comment.toLowerCase().includes(search.toLowerCase()))
    );
  });

  // EXPORT PDF
  const exportPDF = async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams();

      if (filter) params.append("type", filter);
      if (search) params.append("comment", search);
      if (userFilter) params.append("user", userFilter);

      params.append("template", template);

      const response = await fetch(
        `http://localhost:5248/api/inventory/export?${params.toString()}`
      );

      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "inventory.pdf";
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("PDF export failed");
    }

    setLoading(false);
  };

  return (
    <div>
      <h2>Inventory</h2>

      {/* FORM */}
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option>Tablet</option>
        <option>Phone</option>
        <option>SIM card</option>
        <option>Laptop</option>
      </select>

      <input
        placeholder="Comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      <select value={userId} onChange={(e) => setUserId(e.target.value)}>
        <option value="">Select user</option>
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.firstName} {u.lastName}
          </option>
        ))}
      </select>

      <button onClick={editingItem ? saveEdit : addItem}>
        {editingItem ? "Save" : "Add"}
      </button>

      {/* FILTERS */}
      <div style={{ marginTop: 20 }}>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All</option>
          <option>Tablet</option>
          <option>Phone</option>
          <option>SIM card</option>
          <option>Laptop</option>
        </select>

        <select
          value={userFilter}
          onChange={(e) => setUserFilter(e.target.value)}
        >
          <option value="">All users</option>
          {users.map((u) => (
            <option key={u.id} value={`${u.firstName} ${u.lastName}`}>
              {u.firstName} {u.lastName}
            </option>
          ))}
        </select>

        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* EXPORT */}
      <div style={{ marginTop: 20 }}>
        <select value={template} onChange={(e) => setTemplate(e.target.value)}>
          <option value="simple">Simple</option>
          <option value="modern">Modern</option>
        </select>

        <button onClick={exportPDF} disabled={loading}>
          {loading ? "Generating PDF..." : "Export PDF"}
        </button>
      </div>

      {/* TABLE */}
      <table style={{ width: "100%", marginTop: 20, borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Type</th>
            <th>Comment</th>
            <th>User</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredItems.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: 20 }}>
                No items found
              </td>
            </tr>
          ) : (
            filteredItems.map((item) => (
              <tr key={item.id}>
                <td>{item.type}</td>
                <td>{item.comment}</td>
                <td>{item.user}</td>
                <td>{item.date}</td>
                <td>
                  <button onClick={() => editItem(item)}>Edit</button>
                  <button onClick={() => deleteItem(item.id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Inventory;



// http://localhost:5173/ copy->paste
