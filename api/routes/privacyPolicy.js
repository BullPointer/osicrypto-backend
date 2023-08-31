const express = require("express");
const router = express.Router();

const {
  get_privacy_policy,
  get_privacy_policies,
  delete_privacy_policies,
  create_or_edit_privacy_policies,
} = require("../controllers/privacyPolicies");
const {
  authorize_handle_auth,
  authorize_only_workers,
} = require("../middleware/check-for-auth");

router.get("/", get_privacy_policies);
router.get("/:policyId", get_privacy_policy);
router.patch("/", authorize_only_workers, create_or_edit_privacy_policies);
router.delete("/:policyId", authorize_handle_auth, delete_privacy_policies);

module.exports = router;
