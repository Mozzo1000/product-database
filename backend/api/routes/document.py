from flask import Blueprint, request, jsonify, current_app, send_from_directory
from werkzeug.utils import secure_filename
import os
from models import Document, DocumentSchema, db
import mimetypes
import hashlib
import platform
from datetime import datetime
from api.utils import admin_required
from sqlalchemy.exc import IntegrityError

document_endpoint = Blueprint('document', __name__)

@document_endpoint.route('/v1/documents/storage/<path:filename>', methods=['GET'])
def get_document(filename):
    directory = os.path.join(os.getcwd(), current_app.config['UPLOAD_FOLDER'])
    return send_from_directory(directory, filename, as_attachment=False)

@document_endpoint.route("/v1/documents/<id>")
def get_document_by_product(id):
    document_schema = DocumentSchema(many=True)
    if request.args.get('type'):
        document = Document.query.filter(Document.product_id==id, Document.type.contains(request.args.get('type'))).all()
    else:
        document = Document.query.filter_by(product_id=id).all()
    return jsonify(document_schema.dump(document))

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in current_app.config["ALLOWED_EXTENSIONS"]

@document_endpoint.route("/v1/documents", methods=["POST"])
@admin_required()
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
        filename = secure_filename(os.path.basename(file.filename))
        filetype = mimetypes.guess_type(filename)[0]
        if filetype:
            file.save(os.path.join(current_app.config["UPLOAD_FOLDER"], filename))
            file_size = os.path.getsize(os.path.abspath(os.path.join(current_app.config["UPLOAD_FOLDER"], filename)))

            file_hash = hashlib.sha256() # Create the hash object, can use something other than `.sha256()` if you wish
            with open(os.path.join(current_app.config["UPLOAD_FOLDER"], filename), 'rb') as f: # Open the file to read it's bytes
                fb = f.read(65536) # Read from the file. Take in the amount declared above
                while len(fb) > 0: # While there is still data being read from the file
                    file_hash.update(fb) # Update the hash
                    fb = f.read(65536) # Read the next block from the file
            checksum = file_hash.hexdigest()

            if platform.system() == 'Windows':
                file_creation_date = datetime.utcfromtimestamp(os.path.getctime(os.path.join(current_app.config["UPLOAD_FOLDER"], filename))).strftime('%Y-%m-%d')
            else:
                stat = os.stat(os.path.join(current_app.config["UPLOAD_FOLDER"], filename))
                try:
                    file_creation_date = datetime.utcfromtimestamp(stat.st_birthtime).strftime('%Y-%m-%d')
                except AttributeError:
                    file_creation_date = datetime.utcfromtimestamp(stat.st_mtime).strftime('%Y-%m-%d')
            try:
                new_document = Document(name=filename, 
                                        type=filetype, 
                                        product_id=request.form.get("product_id"), 
                                        checksum=checksum, size=file_size, 
                                        file_created_at=file_creation_date)
                new_document.save_to_db()
            except IntegrityError:
                return jsonify({
                    "error": "Bad request",
                    "message": "Document name already exists in database"
                }), 400
            return {
                "message": "Upload complete",
                "name": filename
            }, 201
        else:
            return jsonify({
                "error": "Bad request",
                "message": "Could not determine file type"
            }), 400

@document_endpoint.route('/v1/documents/<id>', methods=["DELETE"])
@admin_required()
def remove_document(id):
    #Note, we are not removing the file from the filessytem.
    document = Document.query.get(id)
    try: 
        db.session.delete(document)
        db.session.commit()
        return jsonify({'message': f'Document with id {id} has been removed'}), 200
    except:
        return jsonify({'message': 'Something went wrong'}), 500