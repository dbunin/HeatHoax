#!flask/bin/python
from flask import Flask, jsonify, abort, make_response, request
from flask_pymongo import PyMongo
import json

app = Flask(__name__)
mongo = PyMongo(app)
# temperary dictionary
users = [
    {
        'user_name': u'dmytro.bunin',
        'name': u'Bunin',
        'last_name': u'Bunin', 
        'password': u'password'
    },
    {
        'user_name': u'alex.v',
        'name': u'Alexandru',
        'last_name': u'Vinerean', 
        'password': u'password'
    }
]

@app.route('/countries/', methods=['GET'])
def getCountries():
    return readCountries()

@app.route('/users/', methods=['GET'])
def getUsers():
    return jsonify(users)

@app.route('/users/<string:user_name>', methods=['GET'])
def getUser(user_name):
    user = mongo.db.users.find_one_or_404({'_id': username})
    return jsonify({'user': user})

@app.route('/users/login/', methods=['POST'])
def loginUser():
    email = request.form['inputEmail']
    password = request.form['inputPassword']
    user = mongo.db.users.find_one({'email': email})
    if user:
        if User.validate_login(user['password'], password):
            user_obj = User(email)
            return redirect(url_for('user.profile'))
        else:
            print('Incorrect Credentials')
    else:
        return redirect(url_for('home.register'))

@app.route('/users/register/', methods=['POST'])
def registerUser():
    email = request.form['inputEmail']
    password = request.form['inputPassword']
    if mongo.db.users.find_one({'email': email}):
        return jsonify({'result': 'Email already exist'})
    else:
        mongo.db.users.insert({'email': email, 'password': password, 'authenticated': False})
        return jsonify({'result': 'Registered'})

@app.route('/users/update/<string:user_name>', methods=['PUT'])
def update_user(user_name):
    user = [user for user in users if user['user_name'] == user_name]
    if len(user) == 0:
        abort(404)
    if not request.json:
        abort(400)
    if 'name' in request.json and type(request.json['name']) is not unicode:
        abort(400)
    if 'last_name' in request.json and type(request.json['last_name']) is not unicode:
        abort(400)
    if 'password' in request.json and type(request.json['password']) is not unicode:
        abort(400)
    user[0]['name'] = request.json.get('name', user[0]['name'])
    user[0]['last_name'] = request.json.get('last_name', user[0]['last_name'])
    user[0]['password'] = request.json.get('password', user[0]['password'])
    return jsonify({'user': user[0]})

@app.route('/users/delete/<int:user_name>', methods=['DELETE'])
def delete_user(user_name):
    user = [user for user in users if user['user_name'] == user_name]
    if len(user) == 0:
        abort(404)
    users.remove(user[0])
    return jsonify({'result': True})

@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)

def readCountries():
    with open('data.json', 'r') as f:
        return json.load(f)

if __name__ == '__main__':
    app.run(debug=True)

# class User:
#     def __init__(user_name, name, last_name, password):
#         self.user_name = user_name
#         self.name = name
#         self.last_name = last_name
#         self.password = password