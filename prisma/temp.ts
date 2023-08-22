/*Document to File Relationship:

One-to-One: Each Document is related to one File, and each File can be related to one Document.
In the Document model, there's a fileId field which is unique. 
This ensures that each Document can be linked to only one File.
The file field in the Document model establishes this relation using the @relation directive,
linking the fileId field in Document to the id field in File.
Conversely, in the File model, there's a field document which is of type Document?.
The ? means this relation is optional; a File may or may not be associated with a Document.

File to Metadata Relationship:
One-to-One: Each File is related to one Metadata, and each Metadata can be related to one File.
In the File model, there's a metadataId field which is unique. This ensures that each File can
be linked to only one Metadata.
The metadata field in the File model establishes this relation using the @relation directive,
linking the metadataId field in File to the id field in Metadata.
In the Metadata model, there's a field file which is of type File?. Again, the ? signifies that
this relation is optional; a Metadata may or may not be associated with a File.

Summary:
A Document has a one-to-one relationship with a File.
A File has a one-to-one relationship with Metadata.
Every Document can point to a single File, and every File can 
back-reference a Document(but this is optional).
Every File can point to a single Metadata, and every Metadata can back-reference a
File (but this is also optional).
The optionality in the back-references (document in File and file in Metadata) allows
for flexibility. For instance, you might have a File that hasn't been associated
with a Document yet, or a Metadata that isn't linked to any File
*/