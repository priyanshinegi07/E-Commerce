//this is a middleware func and we are exporting it so that we can use it in other files

const multer = require("multer");
const path = require("path")

module.exports.isLoggedIn = (req, res, next) => {
  //checks whether user is autheticated or not
  if (!req.isAuthenticated()) {
      console.log("User is not authenticated");
      
      req.flash("error", "You need to login first!");
      res.redirect("/login");
  }
  else {
    console.log(req.user, "is logged in")
    next();
  }
  
};
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, "/public/temp"))
    },
    filename: function (req, file, cb) {
      //if user uploads the file with same name multiple times then it will be overritten so not a ood praction to keep original name but as file is for short duration on server so we can keep
      cb(null, file.originalname)
    }
  })
  
module.exports.upload = multer({ storage })


