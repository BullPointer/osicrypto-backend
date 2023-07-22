const express = require("express");
const router = express.Router();
const multer = require("multer");
const crypto = require("crypto");

const storage = multer.diskStorage({
  destination: (err, file, cb) => cb(null, "uploads"),
  filename: (err, file, cb) => cb(null, crypto.randomUUID() + file.originalname),
});
const fileFilter = (err, file, cb) => {
  file.mimetype === "image/jpeg" || file.mimetype === "image/png"
    ? cb(null, true)
    : cb(null, false);
};

const upload = multer({
  storage: storage,
  limits: { fieldSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter,
});

const blogController = require("../controllers/blogs");

router.get("/", blogController.get_all_blogs);
router.get("/:blogId", blogController.get_blog);
router.post("/", upload.single("blogImage"), blogController.create_blog);
router.patch("/:blogId", upload.single("blogImage"), blogController.update_blog);
router.delete("/:blogId", blogController.delete_blog);

module.exports = router;
