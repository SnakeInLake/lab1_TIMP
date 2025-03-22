import psycopg2
import psycopg2.extras
from flask import Flask, jsonify, request, g
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# --- Настройки подключения к PostgreSQL ---
DATABASE = 'employees_db'
USER = 'employee_admin'
PASSWORD = '12345'
HOST = 'localhost'
PORT = '5432'

# --- Функции для работы с базой данных ---

def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = psycopg2.connect(
            dbname=DATABASE,
            user=USER,
            password=PASSWORD,
            host=HOST,
            port=PORT,
            cursor_factory=psycopg2.extras.RealDictCursor  
        )
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()

def init_db():
    with app.app_context():
        db = get_db()
        with app.open_resource('schema.sql', mode='r') as f:
            with db.cursor() as cur:
                cur.execute(f.read())
        db.commit()

# --- Конечные точки апи ---

@app.route('/api/employees', methods=['GET'])
def get_employees():
    db = get_db()
    sort = request.args.get('sort', 'id') 
    order = request.args.get('order', 'asc')

    allowed_sort_columns = ['id', 'name', 'position', 'details']
    allowed_order_values = ['asc', 'desc']

    if sort not in allowed_sort_columns:
        return jsonify({'message': 'Invalid sort column'}), 400

    if order not in allowed_order_values:
        return jsonify({'message': 'Invalid sort order'}), 400

    with db.cursor() as cur:
        query = f"SELECT * FROM employees ORDER BY {sort} {order}"
        cur.execute(query)
        print(query)
        employees = cur.fetchall() 
    return jsonify(employees)

@app.route('/api/employees/<int:employee_id>', methods=['GET'])
def get_employee(employee_id):
    db = get_db()
    with db.cursor() as cur:
        cur.execute('SELECT * FROM employees WHERE id = %s', (employee_id,))
        employee = cur.fetchone()
    if employee:
        return jsonify(employee)
    return jsonify({"message": "Employee not found"}), 404

@app.route('/api/employees', methods=['POST'])
def create_employee():
    if not request.json or 'name' not in request.json or 'position' not in request.json or 'details' not in request.json:
        return jsonify({"message": "Bad Request - Name, position, and details are required"}), 400

    db = get_db()
    with db.cursor() as cur:
        cur.execute(
            'INSERT INTO employees (name, position, details) VALUES (%s, %s, %s) RETURNING *', 
            (request.json['name'], request.json['position'], request.json['details'])
        )
        new_employee = cur.fetchone()
    db.commit()
    return jsonify(new_employee), 201

@app.route('/api/employees/<int:employee_id>', methods=['PUT'])
def update_employee(employee_id):
    if not request.json:
        return jsonify({"message": "Bad Request"}), 400

    db = get_db()
    with db.cursor() as cur:
        cur.execute('SELECT * FROM employees WHERE id = %s', (employee_id,)) 
        employee = cur.fetchone()
    if not employee:
        return jsonify({"message": "Employee not found"}), 404

    with db.cursor() as cur:
        cur.execute(
            'UPDATE employees SET name = %s, position = %s, details = %s WHERE id = %s RETURNING *',
            (
                request.json.get('name', employee['name']),
                request.json.get('position', employee['position']),
                request.json.get('details', employee['details']),
                employee_id
            )
        )
        updated_employee = cur.fetchone()

    db.commit()
    return jsonify(updated_employee)

@app.route('/api/employees/<int:employee_id>', methods=['DELETE'])
def delete_employee(employee_id):
    db = get_db()
    with db.cursor() as cur:
      cur.execute('DELETE FROM employees WHERE id = %s RETURNING id', (employee_id,)) 
      deleted_employee = cur.fetchone()
    db.commit()
    if deleted_employee is None:
        return jsonify({'message': 'Employee not found'}), 404

    return jsonify({'message': 'Employee deleted'}), 200

if __name__ == '__main__':
    # init_db() # Для разворачивания на другом компьютере
    app.run(debug=True, host='0.0.0.0', port=5000)