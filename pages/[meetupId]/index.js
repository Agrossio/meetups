import { Fragment } from "react"
import Head from 'next/head'
import MeetupDetail from "../../components/meetups/MeetupDetail";

import { MongoClient, ObjectId } from "mongodb"; // como esto solo lo usamos en "getStaticProps" no va a ser parte del bundle de tecnologias del cliente

function MeetupDetails(props) {

    return (
        <Fragment>
            <Head>
                <title>{props.meetupData.title}</title>
                <meta name="description" content={props.meetupData.description} />
            </Head>
            <MeetupDetail
                image={props.meetupData.image}
                title={props.meetupData.title}
                address={props.meetupData.address}
                description={props.meetupData.description}
            />
        </Fragment>
    );
}

export async function getStaticProps(context) {

    /* para obtener el meetupId que viene por params no puedo usar el useRouter hook con la query property porque solo se puede usar en
     * el Component Function de React (no aca).
     * Para eso puedo usar el parametro context que tb existe en getStaticProps con la propiedad params:
     */

    const meetupId = context.params.meetupId; // tiene que ser el mismo nombre que esta entre [] en la carpeta o archivo de la pagina

    //seteamos la conexion:
    const client = await MongoClient.connect('mongodb+srv://agrossio:Monkey25@cluster0.bv7s061.mongodb.net/meetups?retryWrites=true&w=majority') // aca meetups es el nombre de la db

    // accedemos a la db:
    const db = client.db();

    // accedemos a la coleccion:
    const meetupsCollection = db.collection('meetups'); // de.collection recibe como parametro un string con el nombre de la coleccion

    // busco en la colleccion el documento (la meetup) que tiene el meetupId del params:
    const selectedMeetup = await meetupsCollection.findOne({ _id: ObjectId(meetupId) }); // ObjectId convierte el string en el ObjetctId que necesita mongo

    client.close();

    return {
        props: {
            meetupData: {
                id: selectedMeetup._id.toString(),
                title: selectedMeetup.title,
                address: selectedMeetup.address,
                image: selectedMeetup.image,
                description: selectedMeetup.description,
            },
        },
    }
}

/* Para que funcione el dinamic routing cuando uso getStaticProps (con getServerSideProps no hace falta)
 * tengo que agregar la funcion getStaticPaths
 */

export async function getStaticPaths() {

    /* Next necesita pre-generar todas la versiones de esta pagina dinamica por adelantado que van a ser
     * posiblemente llamadas por el usuario con la url dinamica.
     * Esta funcion le dice a Next cuales van a ser los valores que va a tomar la url dinamica (meetupId)
     * para poder pre-generar cada pagina
     *
     */

    /* fallback le dice a Next si el arreglo paths que le sigue contiene todos los parametros
     * soportados (false) o solo algunos (true).
     * Si es false y el usuario ingresa 'm3' entonces vera un error 404.
     * Si es true y el usuario ingresa 'm3' entonces Next tratara de generar una pagina para el id 'm3'
     * dinamicamente en el servidor para ese request.
     * 
     * El true esta bueno cuando hay ciertas paginas que se piden muy seguido (mas populares) y queremos que ya esten generadas
     * por defecto antes de que el user las pida. Entonces le decimos a Next que ya las tenga pre-renderizadas
     *
     */

    //seteamos la conexion:
    const client = await MongoClient.connect('mongodb+srv://agrossio:Monkey25@cluster0.bv7s061.mongodb.net/meetups?retryWrites=true&w=majority') // aca meetups es el nombre de la db

    // accedemos a la db:
    const db = client.db();

    // accedemos a la coleccion:
    const meetupsCollection = db.collection('meetups'); // de.collection recibe como parametro un string con el nombre de la coleccion

    /* buscamos todos los documentos de la coleccion y los pedimos en forma de array
     * el primer parametro dice las condiciones de la busqueda y el 2do que campos queremos que traiga de cada documento (registro)
     * el 1er objeto vacio es para que traiga todos los documentos de la coleccion y el 2do dice que campos queremos que traiga de cada documento
    */
    const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray(); // le pedimos que traiga solo los ids de todos los meetups en forma de arreglo

    client.close();

    return {
        fallback: 'blocking',
        paths: meetups.map(meetup => {
            return {
                params: { meetupId: meetup._id.toString() }
            }
        })
    }
}

export default MeetupDetails