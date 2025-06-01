class UsuariosController {
  construct() {}

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
    console.log("Datos recibidos:", req.body);

    // Validación de objeto plano
    if (typeof req.body !== 'object' || req.body === null || Array.isArray(req.body)) {
      return res.status(400).send('Datos inválidos. Se esperaba un objeto plano.');
    }

    const admin = require('./firebaseAdmin');

    // 🔥 SOLUCIÓN: Crear un objeto limpio con solo los campos necesarios
    const userData = {
      dni: req.body.dni || '',
      nombre: req.body.nombre || '',
      apellidos: req.body.apellidos || '',
      email: req.body.email || '',
      fechaCreacion: new Date().toISOString() // Opcional: agregar timestamp
    };

    // Validar que los campos requeridos no estén vacíos
    if (!userData.dni || !userData.nombre || !userData.email) {
      return res.status(400).send('Faltan campos requeridos: dni, nombre, email');
    }

    const docRef = await admin.firestore().collection('users').add(userData);
    
    res.status(200).json({ 
      message: "Usuario agregado", 
      id: docRef.id 
    });
    
  } catch (err) {
    console.error("Error al guardar usuario:", err);
    res.status(500).send(err.message);
  }
}
}

module.exports = new UsuariosController();
