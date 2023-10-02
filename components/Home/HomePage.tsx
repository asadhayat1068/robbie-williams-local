"use client";

import React, { useState, useEffect } from "react";

function HomePage() {
  const [message, setMessage] = useState("Hello World!");

  return (
    <div>
      <h2>API Test</h2>
      <p>{message}</p>
    </div>
  );
}

export default HomePage;
