from flask import Flask, jsonify
#from flaskext.mysql import MySQL
from flask_sqlalchemy import SQLAlchemy
from marshmallow import Schema, fields

db = SQLAlchemy()

app = Flask(__name__)
#mysql = MySQL()
app.config['MYSQL_DATABASE_USER'] = 'root'
app.config['MYSQL_DATABASE_PASSWORD'] = 'my-secret-pw'
app.config['MYSQL_DATABASE_DB'] = 'student'
app.config['MYSQL_DATABASE_HOST'] = '127.0.0.1'
#mysql.init_app(app)
#mysql.init_app(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:my-secret-pw@127.0.0.1:3306/student'
db.init_app(app)

class Student(db.Model):
    __tablename__ = 'students'
    StudentID = db.Column(db.Integer, primary_key=True)
    FirstName = db.Column(db.String(32), index=True)
    Surname = db.Column(db.String(32))

    def __init__(self, lastName, firstName):
        self.Surname = lastName
        self.FirstName = firstName

        def __repr__(self):
            return '<Student %r>' % self.FirstName

class StudentSchema(Schema):
    StudentID = fields.Number()
    FirstName = fields.Str()
    Surname = fields.Str()



@app.route('/')
def get_persons():
    data = Student.query.all()
    schema = StudentSchema(many=True)
    students = schema.dump(data)
    return jsonify(students)

if __name__ == "__main__":
    app.run(debug=True, host='localhost')