"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const marked_1 = require("marked");
require("dotenv").config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// setting up storage engine for multer
const uploadDir = path_1.default.join(__dirname, "uploads");
const storage = multer_1.default.diskStorage({
    destination: (req, file, cd) => {
        cd(null, uploadDir);
    },
    filename: (req, file, cd) => {
        cd(null, `${file.fieldname}_${Date.now()}${path_1.default.extname(file.originalname)}`);
    },
});
const uploads = (0, multer_1.default)({ storage });
// static html form to upload file
app.get("/", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "views", "index.html"));
});
// route to handle file upload and markdown conversion
app.post("/upload", uploads.single("markdown"), (req, res) => {
    if (!req.file) {
        res.status(400).send("No file uploaded.");
        return;
    }
    const filePath = path_1.default.join(uploadDir, req.file.filename);
    fs_1.default.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send("Error reading file.");
            return;
        }
        // convert to markdown
        const markdown = (0, marked_1.marked)(data);
        res.send(`
      <h1 style="font-size: 24px; font-weight: bold; color: #16a34a; margin: 16px 0; text-align: center;">
  File uploaded successfully
</h1>

<h2 style="font-size: 20px; font-weight: 600; color: #1f2937; margin-bottom: 8px;">
  Markdown:
</h2>

<div style="font-size: 18px; line-height: 1.6; color: #374151; background-color: #f9fafb; padding: 16px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border: 1px solid #d1d5db; overflow: auto;">
  ${markdown}
</div>

      `);
    });
});
app.listen(PORT, () => {
    console.log(`App listening to http://localhost:${PORT}`);
});
