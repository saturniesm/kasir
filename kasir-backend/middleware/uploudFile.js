const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folderPath = path.join(__dirname, "../images/menu");
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    cb(null, folderPath);
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
  },
});

exports.upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype.startsWith("image/jpeg") ||
      file.mimetype.startsWith("image/png")
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only jpeg and png files are allowed!"), false);
    }
  },
});
