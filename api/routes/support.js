const express = require("express");
const router = express.Router();
const multer = require("multer");
const crypto = require("crypto");

const storage = multer.diskStorage({
  destination: (err, file, cb) => cb(null, "uploads"),
  filename: (err, file, cb) =>
    cb(null, crypto.randomUUID() + file.originalname),
});
const fileFilter = (err, file, cb) => {
  file.mimetype === "image/jpeg" || file.mimetype === "image/png"
    ? cb(null, true)
    : cb(
        new Error("Invalid file type. Only JPEG and PNG files are allowed."),
        false
      );
};

const upload = multer({
  storage: storage,
  limits: { fieldSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter,
});

const {
  authorize_handle_auth,
  authorize_only_workers,
} = require("../middleware/check-for-auth");
const {
  allow_only_users,
  allow_only_authorized,
  allow_only_admin_authorized,
} = require("../middleware/handle-chat-auth");

const {
  create_support,
  delete_support,
  get_all_support_by_user,
  get_all_support,
  get_support,
} = require("../controllers/supports");
const { make_chat } = require("../controllers/makeChats");

router.get("/", allow_only_users, get_all_support_by_user);
router.get("/get-all", allow_only_admin_authorized, get_all_support);
router.get("/:id", allow_only_authorized, get_support);
router.patch(
  "/make-chat/:id",
  upload.single("fileImage"),
  allow_only_authorized,
  make_chat
);
router.post(
  "/",
  upload.single("message[fileImage]"),
  allow_only_users,
  create_support
);
router.delete("/:id", allow_only_authorized, delete_support);

module.exports = router;
