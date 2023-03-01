const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (request, file, cb) => {
    cb(null, `./cover`);
  },

  filename: (req, file, cb) => {
    cb(null, `cover-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  /** storage configuration */
  storage: storage,
  /** filter uploaded file */
  fileFilter: (req, file, cb) => {
    if (!file) {
      return cb(`No file passed`);
    }
    if (file.size === 0) {
      return cb(`File is empty`);
    }
    /** filter type of file */
    const acceptedType = [`image/jpg`, `image/jpeg`, `image/png`];
    if (!acceptedType.includes(file.mimetype)) {
      return cb(`Invalid file type (${file.mimetype})`);
    }
    /** filter size of file */
    const fileSize = req.headers[`content-length`];
    const maxSize = 1 * 1024 * 1024; /** max: 1MB */
    if (fileSize > maxSize) {
      return cb(`File size is too large`);
    }
    cb(null, true); /** accept upload */
  },
});

module.exports = upload;
