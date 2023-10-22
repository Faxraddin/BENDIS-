import jwt from "jsonwebtoken";

export const checkRole = (role) => {
  return (req, res, next) => {
    try {
      const token = req.cookies.jwt;
      if (!token) {
        return res
          .status(404)
          .send({ success: false, message: "Token is invalid" });
      }
      jwt.verify(token, "bendis", (err, user) => {
        if (err) {
          return res
            .status(401)
            .send({ success: false, message: "Token is wrong" });
        } else {
          if (user.role !== role) {
            return res.status(403).send({
              success: false,
              message: "Your role is not eligible for access to this section",
            });
          } else {
            req.user = user;
            next();
          }
        }
      });
    } catch (error) {
      return res.status(500).send({ success: false, error: error.message });
    }
  };
};
