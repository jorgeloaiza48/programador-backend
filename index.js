
//const controller = require('./controller')
const express = require('express')
const cors = require('cors');
const app = express()
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}`})   //carga las variables del archivo .env

//Al desplegar el proyecto en un servicio remoto es necesario que las rutas del backend empiecen con 'api' para no confundirlas
//app.use(history()); // Colocamos este middleware cuando estamos usando el BrowserRouter
//app.use('/', express.static(path.join(__dirname, '/build/')));
app.use(express.static(path.join(__dirname, 'build')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
app.use(bodyParser.json())
app.use(cors())


app.use('/api/user', require('./routes/api/user')) //crea un usuario(actualiza el json con el nuevo usuario)
app.use('/login', require('./routes/login/login')) //inicio de sesión
app.use('/borrar-curso', require('./routes/borrarCurso/borrarcurso')) //borra un curso específico
app.use('/borrar-toda-programacion', require('./routes/borrarTodaLaProgramacion/borrarTodaLaprogramacion')) //borra toda la programacion del año
app.use('/update-user', require('./routes/preferencias/preferencias'))//guarda los cursos creados por cada usuario
app.use('/forgot-password', require('./routes/olvidoPassword/olvidoPassword'))
//app.use('/reset-password', require('./routes/olvidoPassword/newPassword'))
// app.use('/token-verify/:id/:token', require('./routes/olvidoPassword/tokenVerify'))

app.get('/reset-password/:id/:token', require('./routes/olvidoPassword/tokenVerify').tokenverify)
app.post('/reset-password/:id',   require('./routes/olvidoPassword/newPassword').newPassword)


//Esta línea realiza una prueba con la extensión "REST client" para comprobar las peticiones https://www.youtube.com/watch?v=6vOZSUDgSoM
app.use('/prueba', function (req, res) {
    res.send("Realizando una prueba")
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => { console.log("Server listening on port ", PORT) })