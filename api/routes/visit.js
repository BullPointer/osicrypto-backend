const express = require("express");
const router = express.Router();

const { make_visitors, get_visitors } = require("../controllers/visits");

router.get("/", make_visitors);
router.get("/get", get_visitors);

module.exports = router;