#!flask/bin/python
from flask import Flask, jsonify, abort
import json

app = Flask(__name__)

@app.route('/countries')
def index():
    return readCountries()

def readCountries():
    with open('data.json', 'r') as f:
        return json.load(f)

if __name__ == '__main__':
    app.run(debug=True)
