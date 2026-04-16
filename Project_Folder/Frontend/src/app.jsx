import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:5000/students";

function App() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    course: "",
  });

  const [searchId, setSearchId] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  function fetchStudents() {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => setStudents(data))
      .catch((error) => console.error("Error fetching students:", error));
  }

  function fetchStudentById() {
    if (!searchId) return;

    fetch(`${API_URL}/${searchId}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Student not found");
        }
        return res.json();
      })
      .then((data) => setSelectedStudent(data))
      .catch((error) => {
        console.error(error);
        setSelectedStudent(null);
        alert("Student not found");
      });
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "age" ? value : value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const studentData = {
      name: formData.name,
      age: Number(formData.age),
      course: formData.course,
    };

    if (editId) {
      fetch(`${API_URL}/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentData),
      })
        .then((res) => res.json())
        .then(() => {
          fetchStudents();
          resetForm();
        })
        .catch((error) => console.error("Error updating student:", error));
    } else {
      fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(studentData),
      })
        .then((res) => res.json())
        .then(() => {
          fetchStudents();
          resetForm();
        })
        .catch((error) => console.error("Error adding student:", error));
    }
  }

  function handleEdit(student) {
    setEditId(student.id);
    setFormData({
      name: student.name,
      age: student.age,
      course: student.course,
    });
  }

  function handleDelete(id) {
    fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        fetchStudents();
        if (selectedStudent && selectedStudent.id === id) {
          setSelectedStudent(null);
        }
      })
      .catch((error) => console.error("Error deleting student:", error));
  }

  function resetForm() {
    setFormData({
      name: "",
      age: "",
      course: "",
    });
    setEditId(null);
  }

  return (
    <div className="container">
      <h1>Student Management Application</h1>

      <section className="card">
        <h2>{editId ? "Update Student" : "Add New Student"}</h2>
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            name="name"
            placeholder="Student name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="age"
            placeholder="Age"
            value={formData.age}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="course"
            placeholder="Course"
            value={formData.course}
            onChange={handleChange}
            required
          />

          <div className="button-group">
            <button type="submit">
              {editId ? "Update Student" : "Add Student"}
            </button>
            {editId && (
              <button type="button" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="card">
        <h2>Retrieve Single Student by ID</h2>
        <div className="search-box">
          <input
            type="number"
            placeholder="Enter student ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
          <button onClick={fetchStudentById}>Search</button>
        </div>

        {selectedStudent && (
          <div className="selected-student">
            <h3>Student Found</h3>
            <p><strong>ID:</strong> {selectedStudent.id}</p>
            <p><strong>Name:</strong> {selectedStudent.name}</p>
            <p><strong>Age:</strong> {selectedStudent.age}</p>
            <p><strong>Course:</strong> {selectedStudent.course}</p>
          </div>
        )}
      </section>

      <section className="card">
        <h2>All Students</h2>
        {students.length === 0 ? (
          <p>No students found.</p>
        ) : (
          <div className="student-list">
            {students.map((student) => (
              <div key={student.id} className="student-card">
                <p><strong>ID:</strong> {student.id}</p>
                <p><strong>Name:</strong> {student.name}</p>
                <p><strong>Age:</strong> {student.age}</p>
                <p><strong>Course:</strong> {student.course}</p>

                <div className="button-group">
                  <button onClick={() => handleEdit(student)}>Edit</button>
                  <button onClick={() => handleDelete(student.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default App;