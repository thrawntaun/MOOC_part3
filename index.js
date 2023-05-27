console.log('hello world');
const express = require('express');
const http = require('http');
const app = express();
const cors = require('cors');
const Note = require('./models/note');
require('dotenv').config();
app.use(cors());
// const app = http.createServer((request, response) => {
//   response.writeHead(200, { 'Content-Type': 'text/plain' })
//   response.end('Hello World')
// })
app.use(express.json());
app.use(express.static('build'));
let notes = [
    {
      id: 1,
      content: "HTML is easy",
      important: true
    },
    {
      id: 2,
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
  ];
//   const app = http.createServer((request, response) => {
//     response.writeHead(200, { 'Content-Type': 'application/json' })
//     response.end(JSON.stringify(notes))
//   })


const generateId = () => {
    const maxId = notes.length > 0
      ? Math.max(...notes.map(n => n.id))
      : 0
    return maxId + 1
  };

app.post('/api/notes', (request, response) => {
    const body = request.body;
    if(!body.content)
    {
        return response.status(400).json({
            error: 'content missing'
        })
    }
    const note ={
        content: body.content,
        import: body.important || false,
        id: generateId(),
    }
    notes = notes.concat(note);
    response.json(note);
  });
  
app.get('/',(request,response) =>{
    response.send('<h1>Hello World!</h1>');

});

app.get('/api/notes',(request,response) =>{
    Note.find({}).then(notes =>{
        response.json(notes);
  });  
});

app.get('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id);
    const note = notes.find(note => note.id === id);
    if(note)
    {   
        response.json(note);
    }
    else
    {
        response.status(404).end();
    }
    
  });


app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id !== id)
  
    response.status(204).end();
  });


  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  };
  
  app.use(unknownEndpoint);
  

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);