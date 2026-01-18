// import { useEffect } from "react";

// const SecurePdfViewer = ({ url }) => {
    

//   useEffect(() => {
//     const blockActions = (e) => {
//       if (
//         e.ctrlKey &&
//         ["s", "p"].includes(e.key.toLowerCase())
//       ) {
//         e.preventDefault();
//       }
//     };

//     document.addEventListener("keydown", blockActions);
//     document.addEventListener("contextmenu", e => e.preventDefault());

//     return () => {
//       document.removeEventListener("keydown", blockActions);
//     };
//   }, []);

//   return (
//     <iframe
//       src={`${url}#toolbar=0&navpanes=0&scrollbar=1`}
//       title="Secure PDF Viewer"
//       style={{
//         width: "100%",
//         height: "100vh",
//         border: "none"
//       }}
//     />
//   );
// };

// export default SecurePdfViewer;

import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const SecurePdfViewer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const pdfUrl = location.state?.url;

  // Prevent direct access
  useEffect(() => {
    if (!pdfUrl) {
      navigate(-1);
    }
  }, [pdfUrl, navigate]);

  // Block download shortcuts
  useEffect(() => {
    const blockKeys = (e) => {
      if (e.ctrlKey && ["s", "p"].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", blockKeys);
    document.addEventListener("contextmenu", e => e.preventDefault());

    return () => {
      document.removeEventListener("keydown", blockKeys);
    };
  }, []);

  if (!pdfUrl) return null;

  return (
    <iframe
      src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`}
      style={{ width: "100%", height: "100vh", border: "none" }}
      title="Secure PDF Viewer"
    />
  );
};

export default SecurePdfViewer;

