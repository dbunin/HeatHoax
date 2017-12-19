#!flask/bin/pythopn
import json
import re
import simplejson
import bcrypt
import codecs
from bson import json_util
from flask import Flask, abort, jsonify, make_response, request
from flask_pymongo import PyMongo

from pymongo import MongoClient

client = MongoClient('mongodb://127.0.0.1:27017')

# Get the sampleDB database
mongo = client.sampleDB

app = Flask(__name__)
# mongo = PyMongo(app)
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

@app.route('/countries/<int:month>', methods=['GET'])
def getCountriesMonth(month):
    if month not in range(1, 13):
        return json_util.dumps({'Error': 'The month is not correct'})
    countries = json.loads(readCountries())
    city_of_month = [x for x in countries if x['date'] == month]
    for x in city_of_month:
        x['city'].encode('latin1')
    return json.dumps(city_of_month)


@app.route('/users/', methods=['GET'])
def getUsers():
    usersa = mongo.db.users.find()
    return json_util.dumps(usersa)

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
        hashed = bcrypt.hashpw(password.encode('utf8'), user['password'])
        if hashed == user['password']:
            return jsonify({'result': 'Success'})
        else:
            return jsonify({'result': 'Incorrect password'})
    else:
        return jsonify({'result': 'Incorrect email'})


@app.route('/users/register/', methods=['POST'])
def registerUser():
    email = request.form['inputEmail']
    if not re.match(r'^[A-Za-z0-9\.\+_-]+@[A-Za-z0-9\._-]+\.[a-zA-Z]*$', email):
        return jsonify({'result': 'Email is incorrect'})
    password = request.form['inputPassword']
    if mongo.db.users.find_one({'email': email}):
        return jsonify({'result': 'Email already exist'})
    else:
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode('utf8'), salt)
        mongo.db.users.insert({'email': email, 'password': hashed, 'authenticated': False})
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
    return json.load(codecs.open('data.json', 'r', 'utf-8'))

if __name__ == '__main__':
    app.run(host='192.168.104.10',debug=True, port=10001)

# class User:
#     def __init__(user_name, name, last_name, password):
#         self.user_name = user_name
#         self.name = name
#         self.last_name = last_name
#         self.password = password
