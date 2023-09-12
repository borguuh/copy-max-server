import expressJwt from "express-jwt";

export const requireSignin = expressJwt({
  getToken: (req, res) => {
    const token =
      req.cookies.token ||
      req.body.token ||
      req.query.token ||
      req.headers["x-access-token"];
    console.log(token);
    return token;
  },
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
});
