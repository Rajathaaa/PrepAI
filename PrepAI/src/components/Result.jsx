import React from "react";
import { useScore } from "./ScoreContext";

function Result({ questions, summary, onRestart }) {
  const { score } = useScore();
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold text-indigo-900 mb-2">
          Quiz Complete!
        </h2>
        <p className="text-gray-600 mb-6">
          Great job! You've finished all the questions.
        </p>
        <p className="text-3xl font-bold text-green-900">{`Your Result : ${score}/${questions.length}`}</p>
      </div>

      

      <div className="text-center">
        <button
          onClick={onRestart}
          className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 font-semibold transition-colors shadow-md"
        >
          Upload Another Document
        </button>
      </div>
    </div>
  );
}

export default Result;
