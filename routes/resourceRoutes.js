const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer-middleware");
const { getResources, uploadResource, getSubjects } = require("../controllers/resourceController");

router.get("/resources", getResources);
router.post("/upload", upload.single("resource"), uploadResource);
router.get("/subjects", getSubjects);

module.exports = router;
