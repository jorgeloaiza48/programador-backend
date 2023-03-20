
//const controller = require('./controller')
const express = require('express')
const cors = require('cors');
const app = express()
const bodyParser = require('body-parser');
const path = require('path');
//const history = require('connect-history-api-fallback');

//Al desplegar el proyecto en un servicio remoto es necesario que las rutas del backend empiecen con 'api' para no confundirlas
//app.use(history()); // Colocamos este middleware cuando estamos usando el BrowserRouter
//app.use('/', express.static(path.join(__dirname, '/build/')));
app.use(express.static(path.join(__dirname, 'build')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
app.use(bodyParser.json())
app.use(cors())


//use cors to allow cross origin resource sharing
app.use(
    cors({
        //origin: 'http://localhost:3000',
        //origin: 'https://programador-cursos.onrender.com',
        // methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
        // allowedHeaders: ['Content-Type', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
        credentials: true,
    })
);

app.use((req,res,next)=>{
    //res.header('Access-Control-Allow-Origin','http://localhost:3000');
    res.header('Access-Control-Allow-Methods','GET,POST,PUT,PATCH,DELETE');
    res.header('Access-Control-Allow-Methods','Content-Type','Authorization');
    res.send()
    next(); 
})

app.use('/api/user',require('./routes/api/user'))
app.use('/login',   require('./routes/login/login'))
app.use('/borrar-curso',require('./routes/borrarCurso/borrarcurso'))

//app.post('/api/create-user', controller.createUser)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => { console.log("Server listening on port ", PORT) })