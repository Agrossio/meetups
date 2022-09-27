// /api/new-meetup
// POST /api/new-meetup

/*
 * todo el codigo que este escrito dentro de /api se va a ejecutar del lado del servidor y nunca va a llegar al cliente.
 * Por lo tanto las credenciales estan seguras en esta parte del codigo
 * 
 * EN MONGODB COLLECTIONS SON LAS TABLAS Y DOCUMENTS SON LOS REGISTROS
 */

import { MongoClient } from 'mongodb';
const { MONGODB_URI, MONGODB_DB } = process.env;

async function handler(req, res) {

    if (req.method === 'POST') {

        try {
            const data = req.body
            const { title, image, address, description } = data;

            // seteamos la conexion:
            const client = await MongoClient.connect(MONGODB_URI) // aca meetups es el nombre de la db

            const db = client.db();

            const meetupsCollection = db.collection('meetups'); // db.collection recibe como parametro un string con el nombre de la coleccion

            // insertOne es un command query para insertar un nuevo documento (que es un objeto) en la coleccion:
            const result = await meetupsCollection.insertOne(data)
            console.log(result)

            client.close();

            res.status(201).json({ message: 'Meetup inserted!' })

        } catch (error) {
            console.log(error)
            res.status(503).send(error)
        }
    }

}

export default handler;