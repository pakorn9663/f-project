const apiUrl = 'http://10.53.1.30:3000/api/students';

// ดึงข้อมูลนักศึกษาและแสดงในตาราง
async function fetchStudents() {
    try {
        const response = await fetch(apiUrl);
        console.log(response);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const students = await response.json();
        console.log('Students fetched:', students); // ตรวจสอบข้อมูลที่ได้มา
        renderStudents(students);
    } catch (error) {
        console.error('Error fetching students:', error);
    }
}

function renderStudents(students) {
    const tableBody = document.getElementById('student-table');
    tableBody.innerHTML = '';
    students.forEach(student => {
        const row = document.createElement('tr');
        row.innerHTML = `
      <td class="border p-2">${student.name}</td>
      <td class="border p-2">${student.SID}</td>
      <td class="border p-2">
    
        <button class="bg-red-500 text-white p-1 rounded" onclick="deleteStudent('${student.SID}')">Delete</button>
      </td>
    `;
        tableBody.appendChild(row);
    });
}

// เพิ่มข้อมูลนักศึกษา
document.getElementById('student-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const sid = document.getElementById('sid').value;

    if (name && sid) {
        try {
            await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, SID: sid }),
            });

            document.getElementById('name').value = '';
            document.getElementById('sid').value = '';
            fetchStudents();
        } catch (error) {
            console.error('Error adding student:', error);
        }
    }
});

// ลบข้อมูลนักศึกษา
async function deleteStudent(id) {
    try {
        await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
        fetchStudents();
    } catch (error) {
        console.error('Error deleting student:', error);
    }
}

fetchStudents();
