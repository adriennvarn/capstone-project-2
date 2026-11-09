#!/usr/bin/env python3

from flask import request, make_response
from flask_restful import Resource

from config import create_app, db, api

class Health(Resource):
    def get(self):
        response = {
            "status": "ok"
        }
        
        return response, 200
    
    
api.add_resource(Health, "/health", endpoint="health")

#  App must be created after api resources are added, as the api.init_app is in create_app
app = create_app()

if __name__ == "__main__":
    app.run(debug=True)