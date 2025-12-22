import React, { useState } from "react";
import ValuationHistory from "./ValuationHistory";
import RevaluationHistory from "./RevaluationHistory";
import AnswerCopyHistory from "./AnswerCopyHistory";

export default function AdminHistory() {
  const [tab, setTab] = useState("valuation");

  return (
    <div className="admin-page">
      <div className="tab-bar mb-3">
        <button className="btn-blue" onClick={() => setTab("valuation")}>Valuation</button>
        <button className="btn-green" onClick={() => setTab("revaluation")}>Revaluation</button>
        <button className="btn-blue" onClick={() => setTab("copy")}>Answer Copy</button>
      </div>

      {tab === "valuation" && <ValuationHistory />}
      {tab === "revaluation" && <RevaluationHistory />}
      {tab === "copy" && <AnswerCopyHistory />}
    </div>
  );
}
