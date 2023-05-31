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

app.post('/api/notes', (request, response,next) => {
  //   const body = request.body;
  //   if(!body.content)
  //   {
  //       return response.status(400).json({
  //           error: 'content missing'
  //       })
  //   }
  //   const note ={
  //       content: body.content,
  //       import: body.important || false,
  //       id: generateId(),
  //   }
  //   notes = notes.concat(note);
  //   response.json(note);
  // });
      const body = request.body;
      if (body.content === undefined) {
        return response.status(400).json({ error: 'content missing' })
      }
      const note = new Note({
        content: body.content,
        important: body.important || false,
      })

      note.save().then(savedNote =>{
        response.json(savedNote);
      })
      .catch(error=>next(error));
    });

app.get('/',(request,response) =>{
    response.send('<h1>Hello World!</h1>');

});

app.get('/api/notes',(request,response) =>{
    Note.find({}).then(notes =>{
        response.json(notes);
  });  
});

app.get('/api/notes/:id', (request, response,next) => {
    // const id = Number(request.params.id);
    // const note = notes.find(note => note.id === id);
    // if(note)
    // {   
    //     response.json(note);
    // }
    // else
    // {
    //     response.status(404).end();
    // }
    
    Note.findById(request.params.id).then(note=>{

    if(note)
    {
      response.json(note);
    }
    else
    {
      response.status(404).end();
    }
    })
    .catch(error=>next(error));
    // .catch(error=>{
    //   console.log(error);
    //   response.status(400).send({ error: 'malformatted id' });
    // });
    
  });


  app.put('/api/notes/:id', (request, response, next)=>{
    const { content, important } = request.body;
    // const body =request.body;
    // const note = {
    //   content: body.content,
    //   important: body.important,
    // }
    Note.findByIdAndUpdate(request.params.id, 
      { content, important },
      { new: true, runValidators: true, context: 'query' }
    )
    .then(updatedNote =>{
      response.json(updatedNote)
    })
    .catch(error => next(error));
  });

  const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
    else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
    }
  
    next(error)
  }
  
  // this has to be the last loaded middleware.
  

// app.delete('/api/notes/:id', (request, response) => {
//     const id = Number(request.params.id)
//     notes = notes.filter(note => note.id !== id)
  
//     response.status(204).end();
//   });
app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})


  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  };
  
  app.use(unknownEndpoint);
  app.use(errorHandler);
  

const PORT = process.env.PORT || 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);