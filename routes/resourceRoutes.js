const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer-middleware");
const { getResources, uploadResource } = require("../controllers/resourceController");

router.get("/resources", getResources);
router.post("/upload", upload.single("resource"), uploadResource);

module.exports = router;
