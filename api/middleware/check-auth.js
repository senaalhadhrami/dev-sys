const jwt = require("jsonwebtoken");
const { secret} = require('../config.json');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1]; // bearer token-here  -->  [1] to take the token after split at position 1
    const decodedToken = jwt.verify(token, secret); // retrieve saved token data
    req.userData = {email:decodedToken.email, userId:decodedToken.userId, role:decodedToken.role,  active:decodedToken.active};  // create new object userData on the express() request so it will be available to next middleware 
    if(req.userData.active === 'yes'){ 
      next();
    }else{ 
      res.status(200).json({ message: "User not active!" });
    }
    
  } catch (error) {
    res.status(401).json({ message: "Auth failed!" }); 
  }
};
