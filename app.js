const express = require('express');
const path = require('path');

const app = express();

// Configurar el motor de vistas EJS
app.set('views', path.join(__dirname, './source/views'));
app.set('view engine', 'ejs');

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, './source/public')));

app.use('/node_modules', express.static('node_modules'));
app.use('/estilos', express.static('source/estilos'));


//variables
var pestaña = "Interfaces SIG"

// Rutas para las páginas

// pagina de inicio
app.get ('/', (req,res) => {
  res.render('index',{
      pestaña:pestaña
  })
});
app.get('/map1', (req, res) => {
  res.render('layout1', { title: 'Mapa de los delitos de alto impaxcto en Bogotá', body: '' ,script: 'main1.bundle.js' });
});

app.get('/map2', (req, res) => {
  res.render('layout2', { title: 'Mapa  de ubicación de Bomberos Y policías en Bogotá',body: '',script: 'main2.bundle.js' });
});

app.get('/map3', (req, res) => {
  res.render('layout2', { title: 'Mapa de centros de atención en Bogotá',body: '',script: 'main3.bundle.js' });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto ${PORT}`);
});
