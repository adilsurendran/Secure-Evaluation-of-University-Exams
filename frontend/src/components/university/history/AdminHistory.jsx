import React, { useState } from "react";
import ValuationHistory from "./ValuationHistory";
import RevaluationHistory from "./RevaluationHistory";
import AnswerCopyHistory from "./AnswerCopyHistory";

export default function AdminHistory() {
  const [tab, setTab] = useState("valuation");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .history-container {
          padding: 32px;
          min-height: 100vh;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 25%, #bfdbfe 50%, #e0f2fe 75%, #f0f9ff 100%);
          font-family: 'Inter', sans-serif;
        }

        .history-header {
          text-align: center;
          margin-bottom: 32px;
          padding: 40px;
          background: white;
          border-radius: 24px;
          box-shadow: 0 8px 32px rgba(30, 64, 175, 0.15);
          border: 3px solid #60a5fa;
          animation: headerGlow 3s ease-in-out infinite;
        }

        @keyframes headerGlow {
          0%, 100% {
            border-color: #60a5fa;
            box-shadow: 0 8px 32px rgba(96, 165, 250, 0.2);
          }
          50% {
            border-color: #3b82f6;
            box-shadow: 0 12px 48px rgba(59, 130, 246, 0.4);
          }
        }

        .history-header h2 {
          font-size: 42px;
          font-weight: 900;
          background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 12px 0;
          animation: slideDown 0.8s ease;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .tab-bar {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-bottom: 32px;
          background: white;
          padding: 12px;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(30, 64, 175, 0.1);
          width: fit-content;
          margin-left: auto;
          margin-right: auto;
          border: 1px solid #dbeafe;
        }

        .tab-btn {
          padding: 12px 24px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          background: transparent;
          color: #64748b;
        }

        .tab-btn:hover {
          background: #f0f9ff;
          color: #3b82f6;
        }

        .tab-btn.active {
          background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
          color: white;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }

        .history-content {
          animation: fadeInUp 0.8s ease;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <div className="history-container">
        <div className="history-header">
          <h2>📜 Historical Records</h2>
          <p style={{ color: '#64748b', margin: 0 }}>Review past valuation, revaluation, and answer sheet request data.</p>
        </div>

        <div className="tab-bar">
          <button
            className={`tab-btn ${tab === "valuation" ? "active" : ""}`}
            onClick={() => setTab("valuation")}
          >
            Valuation History
          </button>
          <button
            className={`tab-btn ${tab === "revaluation" ? "active" : ""}`}
            onClick={() => setTab("revaluation")}
          >
            Revaluation History
          </button>
          <button
            className={`tab-btn ${tab === "copy" ? "active" : ""}`}
            onClick={() => setTab("copy")}
          >
            Answer Copy History
          </button>
        </div>

        <div className="history-content">
          {tab === "valuation" && <ValuationHistory />}
          {tab === "revaluation" && <RevaluationHistory />}
          {tab === "copy" && <AnswerCopyHistory />}
        </div>
      </div>
    </>
  );
}
