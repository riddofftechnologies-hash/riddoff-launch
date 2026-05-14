import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import "./index.css";
import Careers from "./pages/Careers";

function CourseRedirect() {
  const { id } = useParams();
  window.location.replace(`https://www.riddoff.com/courses/${id}`);
  return null;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Careers />} />
        <Route path="/courses/:id" element={<CourseRedirect />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
