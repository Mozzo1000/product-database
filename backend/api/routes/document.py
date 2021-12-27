from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
import os
from models import Document, DocumentSchema, db
import mimetypes

document_endpoint = Blueprint('document', __name__)

@document_endpoint.route("/v1/document/<id>")
def get_document_by_product(id):
    document_schema = DocumentSchema(many=True)
    document = Document.query.filter_by(product_id=id).all()
    return jsonify(document_schema.dump(document))

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
    if not request.form.get("product_id"):
        return jsonify({
            "error": "Bad request",
            "message": "product_id not given"
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
        new_document = Document(name=filename, type=mimetypes.guess_type(filename)[0], product_id=request.form.get("product_id"))
        new_document.save_to_db()
        return {
            "message": "Upload complete",
            "name": filename
        }, 201

@document_endpoint.route('/v1/document/<id>', methods=["DELETE"])
def remove_document(id):
    #Note, we are not removing the file from the filessytem.
    document = Document.query.get(id)
    try: 
        db.session.delete(document)
        db.session.commit()
        return jsonify({'message': f'Document with id {id} has been removed'}), 200
    except:
        return jsonify({'message': 'Something went wrong'}), 500