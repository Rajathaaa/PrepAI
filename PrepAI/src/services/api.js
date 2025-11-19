// src/services/api.js
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function uploadPdf(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    body: formData
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Upload failed");
  }

  return await res.json(); // { success: true }
}

export async function fetchGeneratedQuiz() {
  const res = await fetch(`${API_BASE}/quiz`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Could not fetch generated quiz");
  }
  return await res.json(); // backend's quiz JSON
}
