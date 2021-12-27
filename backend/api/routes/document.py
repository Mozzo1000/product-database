from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
import os
#from models import Document, DocumentSchema, db

document_endpoint = Blueprint('document', __name__)

#@document_endpoint.route("/v1/document/<id>")
#def get_document_by_product(id):
#    document_schema = DocumentSchema(many=False)
#    document = Document.query.get(id)
#    return jsonify(document_schema.dump(document))

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config["ALLOWED_EXTENSIONS"]

@document_endpoint.route("/v1/document", methods=["POST"])
def add_document():
    if "file" not in request.files:
        return jsonify({
            "error": "Bad request",
            "message": "file not given"
        }), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({
            "error": "Bad request",
            "message": "file is empty"
        }), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(current_app.config["UPLOAD_FOLDER"], filename))
        return {
            "message": "Upload complete",
            "name": filename
        }, 201