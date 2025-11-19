const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

import React, { useState, useEffect } from "react";

function UploadForm({ onQuizReady, setError }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileId, setFileId] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [numQuestions, setNumQuestions] = useState(10);
  const [questionTypes, setQuestionTypes] = useState({
    mcq: true,
    short: true,
    fillblank: true,
    tf: true
  });

  const handleQuestionTypeChange = (type) => {
    setQuestionTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    // Validate at least one question type is selected
    const selectedTypes = Object.keys(questionTypes).filter(type => questionTypes[type]);
    if (selectedTypes.length === 0) {
      setError("Please select at least one question type.");
      return;
    }

    setLoading(true);
    setError("");
    setProgress(0);
    setStatusMessage("Uploading file...");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("num_questions", numQuestions.toString());
    formData.append("question_types", selectedTypes.join(','));

    try {
      const res = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        body: formData,
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setFileId(data.file_id);
      setStatusMessage("Processing document...");
      setProgress(10);
    } catch (err) {
      setError("Upload error: " + err.message);
      setLoading(false);
    }
  };

  // Poll backend for progress
  useEffect(() => {
    if (!fileId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`${API_BASE}/quiz/${fileId}`);
        const data = await res.json();

        if (data.status === "done") {
          setStatusMessage("Quiz generated successfully!");
          setProgress(100);
          onQuizReady(data.quiz);
          setLoading(false);
          clearInterval(interval);
        } else if (data.status === "running") {
          setProgress(data.progress || 0);
          setStatusMessage(`Generating quiz... ${data.progress || 0}%`);
        } else if (data.status === "error") {
          throw new Error(data.error || "Quiz generation failed");
        }
      } catch (err) {
        setError("Error: " + err.message);
        setLoading(false);
        clearInterval(interval);
      }
    }, 2000); // Poll every 2 seconds

    return () => clearInterval(interval);
  }, [fileId, onQuizReady, setError]);

  return (
    <div className="p-8 rounded-lg backdrop-blur-lg bg-white/10 shadow-md max-w-md mx-auto border-1 border-white/50">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Upload Document (PDF, DOCX, TXT)
          </label>
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            disabled={loading}
          />
        </div>

        {file && (
          <div className="text-sm text-green-300 p-2 rounded">
            Selected: {file.name}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-white mb-2">
            Number of Questions: {numQuestions}
          </label>
          <input
            type="range"
            min="1"
            max="50"
            value={numQuestions}
            onChange={(e) => setNumQuestions(parseInt(e.target.value))}
            disabled={loading}
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-xs text-gray-300 mt-1">
            <span>1</span>
            <span>25</span>
            <span>50</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-3">
            Question Types
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex items-center space-x-2 p-2 bg-white/20 rounded-lg cursor-pointer hover:bg-white/30 transition">
              <input
                type="checkbox"
                checked={questionTypes.mcq}
                onChange={() => handleQuestionTypeChange('mcq')}
                disabled={loading}
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <span className="text-sm text-white">Multiple Choice</span>
            </label>
            <label className="flex items-center space-x-2 p-2 bg-white/20 rounded-lg cursor-pointer hover:bg-white/30 transition">
              <input
                type="checkbox"
                checked={questionTypes.short}
                onChange={() => handleQuestionTypeChange('short')}
                disabled={loading}
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <span className="text-sm text-white">Short Answer</span>
            </label>
            <label className="flex items-center space-x-2 p-2 bg-white/20 rounded-lg cursor-pointer hover:bg-white/30 transition">
              <input
                type="checkbox"
                checked={questionTypes.fillblank}
                onChange={() => handleQuestionTypeChange('fillblank')}
                disabled={loading}
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <span className="text-sm text-white">Fill in Blank</span>
            </label>
            <label className="flex items-center space-x-2 p-2 bg-white/20 rounded-lg cursor-pointer hover:bg-white/30 transition">
              <input
                type="checkbox"
                checked={questionTypes.tf}
                onChange={() => handleQuestionTypeChange('tf')}
                disabled={loading}
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <span className="text-sm text-white">True/False</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !file}
          className="w-full bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold transition-colors"
        >
          {loading ? "Processing..." : "Upload & Generate Quiz"}
        </button>
      </form>

      {loading && (
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm text-gray-200 mb-2">
            <span>{statusMessage}</span>
            <span className="font-semibold">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-indigo-600 h-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadForm;