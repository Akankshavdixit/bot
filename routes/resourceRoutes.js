const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer-middleware");
const { getResources, uploadResource, getSubjects, getYears, getBranches, getCategories } = require("../controllers/resourceController");

router.get("/resources", getResources);
router.post("/upload", upload.single("resource"), uploadResource);
router.get("/subjects", getSubjects);
router.get("/years", getYears);
router.get("/branches", getBranches);
router.get("/categories", getCategories);

module.exports = router;
