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
      console.log("Datos recibidos:", req.body); // ✅ Verifica los datos entrantes

      // Validación de objeto plano
      if (typeof req.body !== 'object' || req.body === null || Array.isArray(req.body)) {
        return res.status(400).send('Datos inválidos. Se esperaba un objeto plano.');
      }

      const admin = require('./firebaseAdmin');

      // Agrega el documento con ID generado automáticamente
      const docRef = await admin.firestore().collection('users').add(req.body);

      res.status(200).send("Usuario agregado");
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
}

module.exports = new UsuariosController();
