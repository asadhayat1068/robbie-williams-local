"use client";

import React, { useState, useEffect } from "react";

function HelloComponent() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Use the fetch function to call our API
    fetch("/api/hello")
      .then((response) => response.json())
      .then((data) => setMessage(data.text))
      .catch((error) => console.error("Error fetching data:", error));
  }, []); // The empty array means this useEffect will run once when the component mounts

  return (
    <div>
      <h2>API Test</h2>
      <p>{message}</p>
    </div>
  );
}

export default HelloComponent;
