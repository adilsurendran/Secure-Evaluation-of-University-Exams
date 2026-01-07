import React from "react";

export default function HistoryFilters({
  sessions,
  subjects,
  colleges,
  filters,
  setFilters
}) {
  return (
    <>
      <style>{`
        .filter-bar {
          display: flex;
          align-items: center;
          gap: 16px;
          background: white;
          padding: 24px;
          border-radius: 20px;
          box-shadow: 0 4px 20px rgba(30, 64, 175, 0.1);
          border: 2px solid #93c5fd;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .filter-bar select {
          padding: 12px 18px;
          border: 2px solid #dbeafe;
          border-radius: 12px;
          font-size: 14px;
          background: #f8fafc;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
          color: #1e293b;
          min-width: 200px;
          flex: 1;
        }

        .filter-bar select:focus {
          outline: none;
          border-color: #3b82f6;
          background: white;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }

        .filter-label {
          font-weight: 700;
          color: #1e40af;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-right: 8px;
        }

        @media (max-width: 768px) {
          .filter-bar {
            flex-direction: column;
            align-items: stretch;
          }
          .filter-bar select {
            min-width: 100%;
          }
        }
      `}</style>

      <div className="filter-bar">
        <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: '200px' }}>
          <span className="filter-label">Session:</span>
          <select
            value={filters.session}
            onChange={e => setFilters({ ...filters, session: e.target.value })}
          >
            <option value="">All Sessions</option>
            {sessions.map(s => (
              <option key={s._id} value={s._id}>
                {s.name} ({s.academicYear})
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: '200px' }}>
          <span className="filter-label">Subject:</span>
          <select
            value={filters.subject}
            onChange={e => setFilters({ ...filters, subject: e.target.value })}
          >
            <option value="">All Subjects</option>
            {subjects.map(s => (
              <option key={s._id} value={s._id}>
                {s.subjectName}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', flex: 1, minWidth: '200px' }}>
          <span className="filter-label">College:</span>
          <select
            value={filters.college}
            onChange={e => setFilters({ ...filters, college: e.target.value })}
          >
            <option value="">All Colleges</option>
            {colleges.map(c => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}
