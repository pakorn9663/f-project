const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const uri = "mongodb://127.0.0.1:27017"; // เปลี่ยนเป็น MongoDB ของคุณหากจำเป็น
const client = new MongoClient(uri);
const dbName = "ecommerce";
const collectionName = "student";

app.get('/api/students', async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const students = await db.collection(collectionName).find().toArray();

        if (students.length === 0) {
            return res.json([{ name: "Example Student", SID: "12345678" }]);
        }

        res.json(students);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving students');
    }
});

app.post('/api/students', async (req, res) => {
    try {
        await client.connect();
        const db = client.db(dbName);
        const { name, SID } = req.body;

        if (!name || !SID) return res.status(400).send('Missing student data');

        await db.collection(collectionName).insertOne({ name, SID });
        res.status(201).send('Student added');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error adding student');
    }
});

app.delete('/api/students/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await client.connect();
        const db = client.db(dbName);

        // Try to delete the student
        const result = await db.collection(collectionName).deleteOne({ SID: id });

        // Check if any document was deleted
        if (result.deletedCount === 0) {
            // If no student with that SID was found, return a 404
            return res.status(404).send('Student not found');
        }

        // Send a 204 status (No Content) to indicate successful deletion
        res.status(204).send();
    } catch (err) {
        console.error('Error deleting student:', err);
        res.status(500).send('Error deleting student');
    } finally {
        // Ensure the database connection is closed after the operation
        await client.close();
    }
});


app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on http://10.53.1.30:${port}`);
});
