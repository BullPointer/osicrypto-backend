const express = require("express");
const router = express.Router();

const {
  authorize_handle_auth,
  authorize_only_workers,
} = require("../middleware/check-for-auth");

const {
  get_faqs,
  get_faq,
  create_faqs,
  delete_faq,
  edit_faq,
} = require("../controllers/faqs");

router.get("/", get_faqs);
router.post("/", authorize_only_workers, create_faqs);
router.get("/:faqId", get_faq);
router.patch("/:faqId", authorize_only_workers, edit_faq);
router.delete("/:faqId", authorize_handle_auth, delete_faq);

module.exports = router;
