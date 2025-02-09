const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// เชื่อมต่อ MongoDB
mongoose.connect("mongodb://localhost:27017/studentDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// สร้าง Schema และ Model
const studentSchema = new mongoose.Schema({
    SID: String,
    name: String,
});

const Student = mongoose.model("Student", studentSchema);

// ดึงข้อมูลนักศึกษาทั้งหมด
app.get("/students", async (req, res) => {
    const students = await Student.find();
    res.json(students);
});

// เพิ่มนักศึกษาใหม่
app.post("/students", async (req, res) => {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.json(newStudent);
});

// ลบนักศึกษา
app.delete("/students/:id", async (req, res) => {
    await Student.findByIdAndDelete(req.params.id);
    res.json({ message: "ลบสำเร็จ" });
});

// แก้ไขข้อมูลนักศึกษา
app.put("/students/:id", async (req, res) => {
    const updatedStudent = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedStudent);
});

// ค้นหาด้วยชื่อหรือลงท้ายด้วย SID
app.get("/students/search/:query", async (req, res) => {
    const query = req.params.query;
    const result = await Student.find({
        $or: [{ name: { $regex: query, $options: "i" } }, { SID: { $regex: query, $options: "i" } }],
    });
    res.json(result);
});

// เริ่มเซิร์ฟเวอร์
app.listen(5000, () => console.log("Server running on port 5000"));
