// const roleMiddleware = (allowedRoles = []) => {
//   return (req, res, next) => {

//     // req.user is set by authMiddleware
//     if (!req.user || !req.user.role) {
//       return res.status(401).json({ msg: "Unauthorized" });
//     }

//     // Normalize roles to array
//     if (!Array.isArray(allowedRoles)) {
//       allowedRoles = [allowedRoles];
//     }

//     // Check role
//     if (!allowedRoles.includes(req.user.role)) {
//       return res.status(403).json({
//         msg: "Access denied for this role"
//       });
//     }

//     next();
//   };
// };

// export default roleMiddleware;

const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
        console.log("USER ROLE:", req.user.role);
    console.log("ALLOWED ROLES:", allowedRoles);


    if (!req.user || !req.user.role) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      console.log("denieddd hereeeeeeeeeeee");
      
      return res.status(403).json({
        msg: "Access denied for this role"
      });
    }

    next();
  };
};

export default roleMiddleware;
