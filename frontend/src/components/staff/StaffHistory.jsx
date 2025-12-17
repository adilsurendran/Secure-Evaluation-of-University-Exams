// import React, { useEffect } from 'react'
// import { useState } from 'react'
// import { Table } from 'react-bootstrap'
// import api from '../../../api';

// function StaffHistory() {
//   const staffId = localStorage.getItem("staffId");

//   const [selected,setSelected] = useState("valuation")
//   const [list,setlist] = useState([])
//   console.log(selected);

//   const GetSessions = async(req,res)=>{
//     try{
//       const res = await api.get(`/staff/evalhistory/${staffId}`,{params: { selected }} )
//       console.log(res);
//        setlist(res.data.history);
//     }
//     catch(e){
//       console.log(e);
//       alert(e.response.data.messsage || "failed")
      
//     }
//   }
//   useEffect(() => {
//     GetSessions();
//   }, [selected]);
//   console.log(list);
  
//   return (
//     <div>
//       <select name="examsession" id="examsession" className='w-50' value={selected} onChange={(e)=>setSelected(e.target.value)}>
//         <option value="valuation" defaultValue={"valuation"}>Normal</option>
//         <option value="revaluation">Revaluation</option>
//       </select>
//         <Table striped bordered hover variant="dark" className='w-50'>
//           <thead>
//             <tr>
//                 <th>#</th>
//                 <th>Session</th>
//                 <th>Subject code</th>
//                 <th>Subject</th>
//             </tr>
//             </thead>
//             <tbody>
//               {list.length == 0 ?(
//                 <tr>
//       <td colSpan="4" className="text-center text-muted">
//         No papers evaluated in this session
//       </td>
//     </tr>
//               ):(

              
//             list.map((evaluated,i)=>

//             <tr>
//                 <td>{i+1}</td>
//                 <td>{evaluated.sessionId.name}</td>
//                 <td>{evaluated.subjectId.subjectCode}</td>
//                 <td>{evaluated.subjectId.subjectName}</td>
//             </tr>
//                         )
// )
//             }
//             </tbody>
//             </Table>
//     </div>
//   )
// }

// export default StaffHistory
import React, { useEffect, useState } from "react";
import { Table, Card, Form, Container, Row, Col } from "react-bootstrap";
import api from "../../../api";
import StaffSidebar from "./StaffSidebar";

function StaffHistory() {
  const staffId = localStorage.getItem("staffId");

  const [selected, setSelected] = useState("valuation");
  const [list, setList] = useState([]);

  const GetSessions = async () => {
    try {
      const res = await api.get(`/staff/evalhistory/${staffId}`, {
        params: { selected },
      });
      setList(res.data.history || []);
    } catch (e) {
      console.log(e);
      alert(e.response?.data?.message || "Failed to load history");
    }
  };

  useEffect(() => {
    GetSessions();
  }, [selected]);

  return (
    <div className="d-flex staff-container">
      <StaffSidebar />
      
      <Container fluid className="p-4 staff-main">
        <Row className="mb-4">
          <Col>
            <h4 className="fw-semibold">Evaluation History</h4>
            <p className="text-muted mb-0">
              View all your evaluated papers across different sessions
            </p>
          </Col>
        </Row>

        {/* Filter Section */}
        <Row className="mb-4">
          <Col lg={4} md={6}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <Form.Group>
                  <Form.Label className="fw-medium mb-2">
                    Evaluation Type
                  </Form.Label>
                  <Form.Select
                    value={selected}
                    onChange={(e) => setSelected(e.target.value)}
                    className="border-2"
                  >
                    <option value="valuation">Normal Valuation</option>
                    <option value="revaluation">Revaluation</option>
                  </Form.Select>
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Table Section */}
        <Row>
          <Col>
            {/* <Card className="border-0 shadow-sm">
              <Card.Body className="p-0"> */}
              <div className="bg-white p-3 rounded-3">
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead className="bg-light">
                      <tr>
                        <th style={{ width: "5%" }} className="py-3 px-4 border-bottom">
                          #
                        </th>
                        <th style={{ width: "25%" }} className="py-3 px-4 border-bottom">
                          Session
                        </th>
                        <th style={{ width: "20%" }} className="py-3 px-4 border-bottom">
                          Subject Code
                        </th>
                        <th style={{ width: "50%" }} className="py-3 px-4 border-bottom">
                          Subject Name
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {list.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="text-center py-5">
                            <div className="d-flex flex-column align-items-center">
                              <i className="bi bi-folder-x text-muted" style={{ fontSize: "3rem" }}></i>
                              <p className="text-muted mt-3 mb-0 fs-5">
                                No papers evaluated in this session
                              </p>
                              <p className="text-muted">
                                Switch evaluation type or check back later
                              </p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        list.map((evaluated, i) => (
                          <tr key={evaluated._id} className="border-bottom">
                            <td className="py-3 px-4">{i + 1}</td>
                            <td className="py-3 px-4 fw-medium">
                              {evaluated.sessionId?.name}
                            </td>
                            <td className="py-3 px-4">
                              <span className="badge bg-secondary bg-opacity-10 text-secondary px-3 py-2">
                                {evaluated.subjectId?.subjectCode}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {evaluated.subjectId?.subjectName}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>
                
                {/* Summary Footer */}
                {list.length > 0 && (
                  <div className="bg-light py-3 px-4 border-top">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="text-muted">
                        Showing <span className="fw-medium">{list.length}</span> evaluated papers
                      </div>
                      <div className="text-muted">
                        {selected === "valuation" ? "Normal Valuation" : "Revaluation"}
                      </div>
                    </div>
                  </div>
                )}
              {/* </Card.Body>
            </Card> */}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default StaffHistory;