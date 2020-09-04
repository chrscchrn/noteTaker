//Import
const bodyParser = require('body-parser');
const express = require("express");
const path = require("path");
const fs = require("fs");

//setting up Express
const app = express();

//receive js and CSS files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('./'));

//MiddleWare for POSTing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Maybe Notes Array
const db = require("./db/db.json");

//global variables
let id = db.length;
let newNotes = [];

// Routes
//===================================================
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

// View Notes
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

// Display Notes link
app.get("/api/notes", (req, res) => {
    fs.readFile('db/db.json', 'utf8', (err, contents) => {
        var words = JSON.parse(contents);
        res.send(words);
    });
});

// Create New Note - takes in JSON input - does not automatically update. Refresh page!
app.post("/api/notes", (req, res) => {
    req.body.id = parseInt(id);
    id++;
    fs.readFile('./db/db.json', 'utf8', (err, contents) => {
        newNotes = JSON.stringify([...JSON.parse(contents), req.body], null, 2);
        fs.writeFile('./db/db.json', newNotes, (err) => {
            if (err) throw err;
        });
    });
});

//Delete note
app.delete('/api/notes/:id', (req, res) => {
    fs.readFile('db/db.json',(err, data) => {
        // Check for error
        if (err) throw err;
        let deleteId = req.params.id;

        // Handle data gathering for json update
        let readData = JSON.parse(data);
        for (let i in readData) (readData[i].id == deleteId) ? readData.splice(i, 1): null;
        
        // Write updated json to array 
        fs.writeFile('db/db.json', JSON.stringify(readData, null, 2), (err) => {

            // Check for error
            if (err) throw err;
            res.send('200');
        });
    });
})


// Starts the server to begin listening
// ==============================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));