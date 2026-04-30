import React, { useState } from "react";
import "./App.css";

function App() {
  // Form state
  const [name, setName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [email, setEmail] = useState("");

  // Handle form submission
  const handleAddBill = (e) => {
    e.preventDefault();

    const newBill = {
      name,
      dueDate,
      email,
    };

    console.log("Bill Data", newBill);

    // Send to backend
    fetch(`${import.meta.env.VITE_API_URL}/bills`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBill),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Server error");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Saved to backend:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    // Reset form
    setName("");
    setDueDate("");
    setEmail("");
  };

  return (
    <div>
      <h1>Bill Reminder App</h1>

      {/* Form */}
      <form onSubmit={handleAddBill}>
        <div>
          <label>Bill Name: </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Due Date: </label>
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button type="submit">Add Bill</button>
      </form>
    </div>
  );
}

export default App;