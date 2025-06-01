class UsuariosController {
  constructor() {}

  async consultarDetalle(req, res) {
    try {
      const admin = require('./firebaseAdmin');
      let iden = req.query.iden;
      const userDoc = await admin.firestore().collection('users').doc(iden).get();

      if (!userDoc.exists) {
        return res.status(404).json({ error: 'Usuario no encontrado: ' + iden });
      }

      const userData = userDoc.data();
      return res.status(200).json(userData);
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  async ingresar(req, res) {
    try {
      // 🔍 DEBUGGING PROFUNDO
      console.log("🔍 === DEBUGGING COMPLETO ===");
      console.log("🔍 req.body:", req.body);
      console.log("🔍 req.body type:", typeof req.body);
      console.log("🔍 req.body keys:", Object.keys(req.body || {}));
      console.log("🔍 req.rawBody:", req.rawBody);
      console.log("🔍 req.headers:", req.headers);
      
      // Validación de objeto plano
      if (typeof req.body !== 'object' || req.body === null || Array.isArray(req.body)) {
        console.log("❌ Datos inválidos - no es objeto plano");
        return res.status(400).send('Datos inválidos. Se esperaba un objeto plano.');
      }

      const admin = require('./firebaseAdmin');

      // 🔍 INTENTAR DIFERENTES FORMAS DE OBTENER LOS DATOS
      let userData;
      
      // Intento 1: req.body directo
      if (req.body && typeof req.body === 'object') {
        console.log("✅ Usando req.body directo");
        userData = {
          dni: req.body.dni || '',
          nombre: req.body.nombre || '',
          apellidos: req.body.apellidos || '',
          email: req.body.email || '',
          fechaCreacion: new Date().toISOString()
        };
      }
      // Intento 2: Si req.body es string, parsearlo
      else if (typeof req.body === 'string') {
        console.log("🔄 req.body es string, parseando...");
        const parsed = JSON.parse(req.body);
        userData = {
          dni: parsed.dni || '',
          nombre: parsed.nombre || '',
          apellidos: parsed.apellidos || '',
          email: parsed.email || '',
          fechaCreacion: new Date().toISOString()
        };
      }
      else {
        console.log("❌ No se pudo procesar req.body");
        return res.status(400).send('No se pudo procesar los datos');
      }

      console.log("🔍 userData final:", userData);

      // 🔍 VALIDACIÓN MÁS PERMISIVA PARA DEBUG
      const camposVacios = [];
      if (!userData.dni || userData.dni.trim() === '') camposVacios.push('dni');
      if (!userData.nombre || userData.nombre.trim() === '') camposVacios.push('nombre');
      if (!userData.email || userData.email.trim() === '') camposVacios.push('email');
      
      if (camposVacios.length > 0) {
        console.log("❌ Campos vacíos:", camposVacios);
        console.log("❌ userData completo:", JSON.stringify(userData, null, 2));
        
        // 🔍 MOSTRAR VALORES EXACTOS
        console.log("🔍 Valores exactos:");
        console.log(`dni: "${userData.dni}" (length: ${userData.dni ? userData.dni.length : 'undefined'})`);
        console.log(`nombre: "${userData.nombre}" (length: ${userData.nombre ? userData.nombre.length : 'undefined'})`);
        console.log(`email: "${userData.email}" (length: ${userData.email ? userData.email.length : 'undefined'})`);
        
        return res.status(400).send(`Campos vacíos encontrados: ${camposVacios.join(', ')}`);
      }

      console.log("✅ Datos válidos, guardando en Firestore...");

      // Intentar guardar en Firestore
      const docRef = await admin.firestore().collection('users').add(userData);

      console.log("✅ Usuario guardado con ID:", docRef.id);
      res.status(200).json({ 
        message: "Usuario agregado exitosamente", 
        id: docRef.id,
        data: userData
      });

    } catch (err) {
      console.error("❌ Error completo:", err);
      console.error("❌ Error stack:", err.stack);
      res.status(500).send(`Error del servidor: ${err.message}`);
    }
  }
}

module.exports = new UsuariosController();