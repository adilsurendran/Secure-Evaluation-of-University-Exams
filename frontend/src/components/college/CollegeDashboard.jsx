import React from "react";
import api from "../../../api";
import { useEffect } from "react";
import { useState } from "react";

function CollegeDashboard() {
    const collegeId = localStorage.getItem("collegeId");
    const [staff,setStaff] = useState("")
    const [student,setStudent] = useState("")
useEffect(()=>{getDashDetails()},[])
  const getDashDetails = async(req,res)=>{
    try{
const res = await api.get(`/colleges/details/${collegeId}`)
console.log(res);
setStaff(res.data.staff)
setStudent(res.data.student)

    }
    catch(e){
      console.log(e);
    }
  }
  return (
    <div>
      <h1>College Dashboard</h1>

      <div className="dashboard-grid">

        <div className="dashboard-card">
          <h3>Total Students</h3>
          <p>{student}</p>
        </div>

        <div className="dashboard-card">
          <h3>Total Staff</h3>
          <p>{staff}</p>
        </div>

        {/* <div className="dashboard-card">
          <h3>Uploaded Answer Sheets</h3>
          <p>--</p>
        </div>

        <div className="dashboard-card">
          <h3>Pending Revaluation</h3>
          <p>--</p>
        </div> */}

      </div>
    </div>
  );
}

export default CollegeDashboard;
