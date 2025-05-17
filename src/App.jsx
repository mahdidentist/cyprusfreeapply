import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./HomePage";
import UniversityPage from "./UniversityPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/university/:id" element={<UniversityPage />} />
    </Routes>
  );
}