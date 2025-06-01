var express = require('express');
var cors = require("cors");
var serverless = require('serverless-http');
var port = process.env.PORT || 5000;
var app = express();
var usuroutes = require("../../backend/routes/usuariosrutas.js");

//Ejemplo de función con manejo posterior de persistencia
//segundo comentario

// ✅ ORDEN IMPORTANTE: Configurar middlewares ANTES de las rutas
app.use(cors());
app.use(express.json({ limit: '10mb' })); // ✅ Aumentar límite y configurar antes
app.use(express.urlencoded({ extended: true })); // ✅ Agregar para formularios

// ✅ DEBUGGING: Middleware para ver qué llega
app.use('/.netlify/functions', (req, res, next) => {
  console.log('🔍 Método:', req.method);
  console.log('🔍 URL:', req.url);
  console.log('🔍 Headers:', req.headers);
  console.log('🔍 Body RAW:', req.body);
  console.log('🔍 Body type:', typeof req.body);
  next();
});

var router = express.Router();
router.use("/usuarios", usuroutes);

// ✅ CORREGIR: El orden era incorrecto
app.use('/.netlify/functions', router);

// ✅ EXPORTAR: Configuración correcta para serverless
exports.handler = serverless(app);