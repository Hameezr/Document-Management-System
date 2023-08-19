import mongoose from 'mongoose';
const uuid = require('uuid');

const MetadataMongooseSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["audio", "video", "application", "image"],
        required: true
    },
    attributes: {
        type: mongoose.Schema.Types.Mixed,  // Mixed type to accept any structure
        required: true
    }
});

const DocumentSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => uuid.v4()
      },
    title: String,
    file: {
        fileName: String,
        fileExtension: String,
        contentType: String,
        tags: [{ key: String, name: String }],
        metadata: MetadataMongooseSchema,
    },
    author: String,
    createdAt: Date,
    updatedAt: Date
});

const DocumentModel = mongoose.model('Document', DocumentSchema);

export default DocumentModel;
