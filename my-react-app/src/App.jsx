import React, { useState, useEffect } from "react";
import './App.css';

function App() {
  // Form state
  const [name, setName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [email, setEmail] = useState("");

  // Bills state
  const [bills, setBills] = useState([]);

  // Load bills from localStorage when app starts
  useEffect(() => {
    const savedBills = JSON.parse(localStorage.getItem("bills")) || [];
    setBills(savedBills);
  }, []);

  // Save bills to localStorage whenever bills change
  useEffect(() => {
    localStorage.setItem("bills", JSON.stringify(bills));
  }, [bills]);

  // Handle form submission
  const handleAddBill = (e) => {
    e.preventDefault();

    const newBill = {
      id: Date.now(), // unique id
      name,
      dueDate,
      email,
    };
    console.log("Bill Data", newBill);

    // Connecting to server 
    fetch(`${import.meta.env.VITE_API_URL}/bills`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(newBill)
})
  .then(response => {
    if (!response.ok) {
      throw new Error("Server error");
    }
    return response.json();
  })
  .then(data => {
    console.log("Saved to backend:", data);
  })
  .catch(error => {
    console.error("Error:", error);
  });

    setBills([...bills, newBill]);

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
