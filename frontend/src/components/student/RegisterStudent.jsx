import React, { useState } from "react";

function RegisterStudent() {
  const [form, setForm] = useState({
    name: "",
    dob: "",
    gender: "",
    address: "",
    phone: "",
    email: "",
    course: "",
    admissionYear: "",
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let err = {};

    if (!form.name.trim()) err.name = "Name required";
    if (!form.dob) err.dob = "Date of birth required";
    if (!form.gender) err.gender = "Gender required";

    if (!form.address.trim()) err.address = "Address required";

    if (!/^[6-9]\d{9}$/.test(form.phone))
      err.phone = "Invalid phone number";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      err.email = "Invalid email";

    if (!form.course.trim()) err.course = "Course required";
    if (!/^\d{4}$/.test(form.admissionYear))
      err.admissionYear = "Enter valid year";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (validate()) alert("Student Registered Successfully!");
  };

  return (
    <div className="bgg">
            <div className="form-container">
      <h2>Student Registration</h2>
      <form onSubmit={submit}>
        <input placeholder="Name"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <p className="error">{errors.name}</p>

        <input type="date"
          onChange={(e) => setForm({ ...form, dob: e.target.value })}
        />
        <p className="error">{errors.dob}</p>

        <select onChange={(e) => setForm({ ...form, gender: e.target.value })}>
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
        <p className="error">{errors.gender}</p>

        <textarea placeholder="Address"
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
        <p className="error">{errors.address}</p>

        <input placeholder="Phone"
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <p className="error">{errors.phone}</p>

        <input placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <p className="error">{errors.email}</p>

        <input placeholder="Course"
          onChange={(e) => setForm({ ...form, course: e.target.value })}
        />
        <p className="error">{errors.course}</p>

        <input placeholder="Admission Year"
          onChange={(e) =>
            setForm({ ...form, admissionYear: e.target.value })
          }
        />
        <p className="error">{errors.admissionYear}</p>

        <button>Submit</button>
      </form>
    </div>
    </div>

  );
}

export default RegisterStudent;
