#!flask/bin/python
from flask import Flask, jsonify, abort, make_response
import json

app = Flask(__name__)
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
    user = [u for u in users if u['user_name'] == user_name]
    if len(user) == 0:
        abort(404)
    return jsonify({'user': user[0]})

@app.route('/users/register/', methods=['POST'])
def registerUser():
    if not request.json or not 'user_name' in request.json:
        abort(400)
    user = {
        'user_name': request.json['user_name'],
        'name': request.json['name'],
        'last_name': request.json['last_name'],
        'password': request.json['last_name']
    }
    users.append(user)
    return jsonify({'user': user}), 201

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