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
});

// สร้าง Schema และ Model สำหรับ student
const studentSchema = new mongoose.Schema({
    SID: String,
    name: String,
});

const Student = mongoose.model("student", studentSchema); // ใช้คอลเลกชัน student

// 🚀 ดึงข้อมูลนักศึกษาทั้งหมด
app.get("/student", async (req, res) => {
    const students = await Student.find();
    res.json(students);
});

// 🆕 เพิ่มนักศึกษาใหม่
app.post("/student", async (req, res) => {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.json(newStudent);
});

// 🗑️ ลบนักศึกษา
app.delete("/student/:id", async (req, res) => {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "ลบสำเร็จ" });
});

// ✏️ แก้ไขข้อมูลนักศึกษา
app.put("/student/:id", async (req, res) => {
    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedStudent);
});

// 🔍 ค้นหาด้วยชื่อหรือ SID
app.get("/student/search/:query", async (req, res) => {
    const query = req.params.query;
    const result = await Student.find({
        $or: [{ name: { $regex: query, $options: "i" } }, { SID: { $regex: query, $options: "i" } }],
    });
    res.json(result);
});

// 🚀 เริ่มเซิร์ฟเวอร์ที่ PORT 3000
app.listen(3000, () => console.log("✅ Server running on port 3000"));
