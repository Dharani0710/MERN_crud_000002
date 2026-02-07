import { useEffect, useState } from "react";

export default function Todo() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const apiUrl = "http://localhost:8000";

  /* ---------------- ADD TODO ---------------- */
  const handlerSubmit = () => {
    setError("");
    setMessage("");

    if (!title.trim() || !description.trim()) {
      setError("Title and Description are required");
      return;
    }

    fetch(apiUrl + "/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    })
      .then((res) => res.json())
      .then((data) => {
        setTodos([...todos, data]);
        setTitle("");
        setDescription("");
        setMessage("Item added successfully");
        setTimeout(() => setMessage(""), 3000);
      })
      .catch(() => setError("Failed to create todo"));
  };

  /* ---------------- GET TODOS ---------------- */
  useEffect(() => {
    getItems();
  }, []);

  const getItems = () => {
    fetch(apiUrl + "/todos")
      .then((res) => res.json())
      .then((data) => setTodos(data));
  };

  /* ---------------- EDIT TODO ---------------- */
  const handleEdit = (item) => {
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
  };

  /* ---------------- UPDATE TODO ---------------- */
  const handleUpdate = () => {
    if (!editTitle.trim() || !editDescription.trim()) {
      setError("Title and Description are required");
      return;
    }

    fetch(apiUrl + `/todos/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: editTitle,
        description: editDescription,
      }),
    })
      .then((res) => res.json())
      .then((updatedTodo) => {
        setTodos(
          todos.map((todo) =>
            todo._id === editId ? updatedTodo : todo
          )
        );
        setEditId(null);
        setEditTitle("");
        setEditDescription("");
      });
  };

  /* ---------------- DELETE TODO ---------------- */
  const handleDelete = (id) => {
    fetch(apiUrl + `/todos/${id}`, { method: "DELETE" }).then(() => {
      setTodos(todos.filter((todo) => todo._id !== id));
    });
  };

  return (
    <>
      <div className="row p-3 bg-success text-light">
        <h1>Todo Project with MERN Stack</h1>
      </div>

      <div className="row mt-3">
        <h3>Add Item</h3>

        {message && <p className="text-success">{message}</p>}
        {error && <p className="text-danger">{error}</p>}

        <div className="form-group d-flex gap-2">
          <input
            className="form-control"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            className="form-control"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button className="btn btn-dark" onClick={handlerSubmit}>
            Submit
          </button>
        </div>
      </div>

      <div className="row mt-3">
        <h3>Tasks</h3>

        <ul className="list-group">
          {todos.map((item) => (
            <li
              key={item._id}
              className="list-group-item bg-info d-flex justify-content-between align-items-center my-2"
            >
              {editId === item._id ? (
                <div className="d-flex gap-2 w-75">
                  <input
                    className="form-control"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                  <input
                    className="form-control"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  />
                </div>
              ) : (
                <div>
                  <strong>{item.title}</strong>
                  <div>{item.description}</div>
                </div>
              )}

              <div className="d-flex gap-2">
                {editId === item._id ? (
                  <button className="btn btn-success" onClick={handleUpdate}>
                    Update
                  </button>
                ) : (
                  <button
                    className="btn btn-warning"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>
                )}

                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(item._id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
