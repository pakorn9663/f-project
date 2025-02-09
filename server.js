const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// เชื่อมต่อ MongoDB (ecommerce > student)
mongoose.connect("mongodb://localhost:27017/ecommerce", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("✅ Connected to MongoDB")).catch(err => console.error("❌ Failed to connect to MongoDB", err));

// สร้าง Schema และ Model สำหรับ student
const studentSchema = new mongoose.Schema({
    SID: String,
    name: String,
});

const Student = mongoose.model("student", studentSchema); // ใช้คอลเลกชัน student

//  ดึงข้อมูลนักศึกษาทั้งหมด
app.get("/student", async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        console.error("❌ Error fetching students", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// 🆕 เพิ่มนักศึกษาใหม่
app.post("/student", async (req, res) => {
    try {
        const newStudent = new Student(req.body);
        await newStudent.save();
        res.status(201).json(newStudent); // ส่ง status 201 (Created)
    } catch (err) {
        console.error("❌ Error creating student", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ️ ลบนักศึกษา
app.delete("/student/:id", async (req, res) => {
    try {
        await Student.findByIdAndDelete(req.params.id);
        res.json({ message: "ลบสำเร็จ" });
    } catch (err) {
        console.error("❌ Error deleting student", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// ✏️ แก้ไขข้อมูลนักศึกษา
app.put("/student/:id", async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedStudent);
    } catch (err) {
        console.error("❌ Error updating student", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

//  ค้นหาด้วยชื่อหรือ SID
app.get("/student/search/:query", async (req, res) => {
    try {
        const query = req.params.query;
        const result = await Student.find({
            $or: [{ name: { $regex: query, $options: "i" } }, { SID: { $regex: query, $options: "i" } }],
        });
        res.json(result);
    } catch (err) {
        console.error("❌ Error searching students", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

//  เริ่มเซิร์ฟเวอร์ที่ PORT 3000
app.listen(3000, () => console.log("✅ Server running on port 3000"));