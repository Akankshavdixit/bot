const pool = require("../config/db");
 const bucket = require("../config/firebase");
 
 exports.getResources = async (req, res) => {
     try {
         const { year, branch, category, subject } = req.query;
 
        
         const yearQuery = await pool.query("SELECT y_id FROM years WHERE y_name = $1", [year]);
         const branchQuery = await pool.query("SELECT b_id FROM branches WHERE b_name = $1", [branch]);
         const categoryQuery = await pool.query("SELECT c_id FROM categories WHERE c_name = $1", [category]);
         const subjectQuery = await pool.query("SELECT s_id FROM subjects WHERE s_name = $1", [subject]);
         if (yearQuery.rowCount === 0 || branchQuery.rowCount === 0 || categoryQuery.rowCount === 0 || subjectQuery.rowCount === 0) {
             return res.status(404).json({ error: "Invalid year, branch, or category" });
         }
 
         const y_id = yearQuery.rows[0].y_id;
         const b_id = branchQuery.rows[0].b_id;
         const c_id = categoryQuery.rows[0].c_id;
         const s_id = subjectQuery.rows[0].s_id;
       
         const resourcesQuery = await pool.query(
             "SELECT * FROM resources WHERE r_year = $1 AND r_branch = $2 AND r_category = $3 AND r_subject = $4",
             [y_id, b_id, c_id, s_id]
         );
 
         res.json(resourcesQuery.rows);
     } catch (err) {
         console.error(err);
         res.status(500).json({ error: "Failed to fetch resources" });
     }
 };
 
 exports.uploadResource = async (req, res) => {
     try {
         const { name, year, branch, category, subject} = req.body;
         const resource = req.file;
 
         if (!resource) {
             return res.status(400).json({ success: false, message: "No file uploaded" });
         }
 
         const yearQuery = await pool.query("SELECT y_id FROM years WHERE y_name = $1", [year]);
         const branchQuery = await pool.query("SELECT b_id FROM branches WHERE b_name = $1", [branch]);
         const categoryQuery = await pool.query("SELECT c_id FROM categories WHERE c_name = $1", [category]);
         const subjectQuery = await pool.query("SELECT s_id FROM categories WHERE s_name = $1", [subject]);

         if (yearQuery.rowCount === 0 || branchQuery.rowCount === 0 || categoryQuery.rowCount === 0 || subjectQuery.rowCount === 0) {
             return res.status(404).json({ error: "Invalid year, branch, or category" });
         }
 
         const y_id = yearQuery.rows[0].y_id;
         const b_id = branchQuery.rows[0].b_id;
         const c_id = categoryQuery.rows[0].c_id;
         const s_id = subjectQuery.rows[0].s_id;
 
         const file = bucket.file(`resources/${Date.now()}_${resource.originalname}`);
         const stream = file.createWriteStream({
             metadata: { contentType: resource.mimetype },
         });
 
         stream.end(resource.buffer);
 
         stream.on("finish", async () => {
             
             const [url] = await file.getSignedUrl({
                 action: "read",
                 expires: "03-09-2030", 
             });
 
             await pool.query(
                 "INSERT INTO resources (r_name, r_year, r_branch, r_category, r_url, r_subject) VALUES ($1, $2, $3, $4, $5, $6)",
                 [name, y_id, b_id, c_id, url, s_id]
             );
 
             res.json({ message: "Resource uploaded successfully", url });
         });
 
         stream.on("error", (error) => {
             console.error(error);
             res.status(500).json({ error: "Firebase upload failed" });
         });
     } catch (err) {
         console.error(err);
         res.status(500).json({ error: "Upload failed" });
     }
 };


//curl -v -X POST "https://bot-f0c6.onrender.com/api/upload" -F "resource=@C:\Users\AKANKSHA\Documents\104405152_ExamForm.PDF" -F "name=bxe decode" -F "year=First year" -F "branch=Computer Engineering" -F "category=Decode"

//curl -X GET "https://bot-f0c6.onrender.com/api/resources?year=First%20year&branch=Computer%20Engineering&category=Decode"

