from flask import Flask, jsonify, request 
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

students = [
    {"id": 1, "name": "Alice Johnson", "age": 20, "course": "Computer Science"},
    {"id": 2, "name": "Charles Wabera", "age": 22, "course": "Information Technology"},
    {"id": 3, "name": "Altie Achieng", "age": 21, "course": "Software Engineering"}
]


@app.route('/students', methods=['GET'])
def get_students():
    return jsonify(students), 200


@app.route('/students/<int:student_id>', methods=['GET'])
def get_student(student_id):
    student = next((s for s in students if s['id'] == student_id), None)
    if student is None:
        return jsonify({"error": "Student not found"}), 404
        
    
    return jsonify(student), 200

@app.route('/students', methods=['POST'])
def add_student():
    data = request.get_json()
   
    if not data or 'name' not in data or 'age' not in data or 'course' not in data:
        return jsonify({"error": "Name, age, and course are required"}), 400
    
    new_id = max([s['id'] for s in students],default = 0) + 1 

    new_student = {
        "id": new_id,
        "name": name,
        "age": age,
        "course": course
    }
    
    students.append(new_student)
    return jsonify(new_student), 201

@app.route('/students/<int:student_id>', methods=['PUT'])
def update_student(student_id):
    student = next((s for s in students if s['id'] == student_id), None)
    
    if student is None:
        return jsonify({"error": "Student not found"}), 404
    
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    student["name"] = data.get("name", student["name"])
    student["age"] = data.get("age", student["age"])
    student["course"] = data.get("course", student["course"])

    return jsonify(student), 200

@app.route('/students/<int:student_id>', methods=['DELETE'])
def delete_student(student_id):
    global students

    student = next((student for student in students if student["id"] == student_id), None)

    if student is None:
        return jsonify({"error": "Student not found"}), 404

    students = [s for s in students if s["id"] != student_id]
    return jsonify({"message": "Student deleted successfully"}), 200

if __name__ == '__main__':
    app.run(debug=True)