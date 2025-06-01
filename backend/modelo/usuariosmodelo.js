class UsuariosController {
  constructor() {} // ✅ Corregido: era "construct()"

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
      console.log("Datos recibidos:", req.body); // ✅ Debug

      // Validación de objeto plano
      if (typeof req.body !== 'object' || req.body === null || Array.isArray(req.body)) {
        return res.status(400).send('Datos inválidos. Se esperaba un objeto plano.');
      }

      const admin = require('./firebaseAdmin');

      // ✅ NUEVA IMPLEMENTACIÓN: Crear un objeto limpio con solo los campos necesarios
      const userData = {
        dni: req.body.dni || '',
        nombre: req.body.nombre || '',
        apellidos: req.body.apellidos || '',
        email: req.body.email || '',
        fechaCreacion: new Date().toISOString()
      };

      // ✅ VALIDACIÓN MEJORADA con logging detallado
      const camposFaltantes = [];
      if (!userData.dni || userData.dni.trim() === '') camposFaltantes.push('dni');
      if (!userData.nombre || userData.nombre.trim() === '') camposFaltantes.push('nombre');
      if (!userData.email || userData.email.trim() === '') camposFaltantes.push('email');
      
      if (camposFaltantes.length > 0) {
        console.log("❌ Datos recibidos:", userData);
        console.log("❌ Campos faltantes:", camposFaltantes);
        return res.status(400).send(`Faltan campos requeridos: ${camposFaltantes.join(', ')}`);
      }

      console.log("✅ Datos válidos, guardando:", userData);

      // Agrega el documento con ID generado automáticamente
      const docRef = await admin.firestore().collection('users').add(userData);

      console.log("✅ Usuario guardado con ID:", docRef.id);
      res.status(200).json({ 
        message: "Usuario agregado exitosamente", 
        id: docRef.id 
      });

    } catch (err) {
      console.error("❌ Error al guardar usuario:", err);
      res.status(500).send(err.message);
    }
  }
}

module.exports = new UsuariosController();