import React, { useState } from "react";

function RegisterStaff() {
  const [form, setForm] = useState({
    name: "",
    qualification: "",
    phone: "",
    email: "",
    department: "",
    joinDate: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let err = {};

    if (!form.name.trim()) err.name = "Name required";
    if (!form.qualification.trim()) err.qualification = "Qualification required";

    if (!/^[6-9]\d{9}$/.test(form.phone))
      err.phone = "Invalid phone number";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      err.email = "Invalid email";

    if (!form.department.trim()) err.department = "Department required";
    if (!form.joinDate) err.joinDate = "Joining date required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (validate()) alert("Staff Registered Successfully!");
  };

  return (
        <div className="bgg">

    <div className="form-container">
      <h2>Staff Registration</h2>
      <form onSubmit={submit}>
        <input
          placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <p className="error">{errors.name}</p>

        <input
          placeholder="Qualification"
          onChange={(e) =>
            setForm({ ...form, qualification: e.target.value })
          }
        />
        <p className="error">{errors.qualification}</p>

        <input
          placeholder="Phone"
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <p className="error">{errors.phone}</p>

        <input
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <p className="error">{errors.email}</p>

        <input
          placeholder="Department"
          onChange={(e) =>
            setForm({ ...form, department: e.target.value })
          }
        />
        <p className="error">{errors.department}</p>

        <input
          type="date"
          onChange={(e) => setForm({ ...form, joinDate: e.target.value })}
        />
        <p className="error">{errors.joinDate}</p>

        <button>Submit</button>
      </form>
    </div>
    </div>
  );
}

export default RegisterStaff;
