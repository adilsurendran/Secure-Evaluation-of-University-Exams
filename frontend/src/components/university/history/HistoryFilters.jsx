import React from "react";

export default function HistoryFilters({
  sessions,
  subjects,
  colleges,
  filters,
  setFilters
}) {
  return (
    <div className="filter-bar">
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
  );
}
