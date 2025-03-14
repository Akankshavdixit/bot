const pool = require("../config/db");
 const bucket = require("../config/firebase");
 
 exports.getResources = async (req, res) => {
     try {
         const { year, branch, category } = req.query;
 
        
         const yearQuery = await pool.query("SELECT y_id FROM years WHERE y_name = $1", [year]);
         const branchQuery = await pool.query("SELECT b_id FROM branches WHERE b_name = $1", [branch]);
         const categoryQuery = await pool.query("SELECT c_id FROM categories WHERE c_name = $1", [category]);
 
         if (yearQuery.rowCount === 0 || branchQuery.rowCount === 0 || categoryQuery.rowCount === 0) {
             return res.status(404).json({ error: "Invalid year, branch, or category" });
         }
 
         const y_id = yearQuery.rows[0].y_id;
         const b_id = branchQuery.rows[0].b_id;
         const c_id = categoryQuery.rows[0].c_id;
 
       
         const resourcesQuery = await pool.query(
             "SELECT * FROM resources WHERE r_year = $1 AND r_branch = $2 AND r_category = $3",
             [y_id, b_id, c_id]
         );
 
         res.json(resourcesQuery.rows);
     } catch (err) {
         console.error(err);
         res.status(500).json({ error: "Failed to fetch resources" });
     }
 };
 
 exports.uploadResource = async (req, res) => {
     try {
         const { name, year, branch, category } = req.body;
         const resource = req.file;
 
         if (!resource) {
             return res.status(400).json({ success: false, message: "No file uploaded" });
         }
 
         const yearQuery = await pool.query("SELECT y_id FROM years WHERE y_name = $1", [year]);
         const branchQuery = await pool.query("SELECT b_id FROM branches WHERE b_name = $1", [branch]);
         const categoryQuery = await pool.query("SELECT c_id FROM categories WHERE c_name = $1", [category]);
 
         if (yearQuery.rowCount === 0 || branchQuery.rowCount === 0 || categoryQuery.rowCount === 0) {
             return res.status(404).json({ error: "Invalid year, branch, or category" });
         }
 
         const y_id = yearQuery.rows[0].y_id;
         const b_id = branchQuery.rows[0].b_id;
         const c_id = categoryQuery.rows[0].c_id;
 
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
                 "INSERT INTO resources (r_name, r_year, r_branch, r_category, r_url) VALUES ($1, $2, $3, $4, $5)",
                 [name, y_id, b_id, c_id, url]
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