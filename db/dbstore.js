// Dependecncies
const util = require('util');
const fs = require('fs');

const uuidv1 = require('uuid/v1');


const readNote = util.promisify(fs.readFile);
const writeNote = util.promisify(fs.writeFile);

class dbstore {
    write(note) {
        return writeNote('db/db.json', JSON.stringify(note));
    }

    read() {
        return readNote('db/db.json', 'utf8');
    }

    retrieveNotes() {
        return this.read().then(notes => {
            let notesResponse;
            try {
                notesResponse = [].concat(JSON.parse(notes));
            } catch (err) {
                notesResponse = [];
            }
            return notesResponse;
        });
    }

    addNote(note) {
        const { title, text } = note;
        if (!title || !text) {
            throw new Error('Cannot be blank');
        }
        // Unique ID
        let newNote = { title, text, id: uuidv1() };

        // Retrieve Notes, add the new note, update notes
        return this.retrieveNotes()
            .then(notes => [...notes, newNote])
            .then(updatedNotes => this.write(updatedNotes))
            .then(() => newNote);
    }

    // Delete Note function
    deleteNote(id) {
        return this.retrieveNotes()
            .then((notes) => notes.filter((note) => note.id !== id))
            .then((filteredNotes) => this.write(filteredNotes));
    }
}

module.exports = new dbstore();