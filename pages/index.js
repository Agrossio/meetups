// import { useEffect, useState } from 'react';
import Head from 'next/head'
import { Fragment } from 'react';
import { MongoClient } from 'mongodb';  // como esto solo lo usamos en "getStaticProps" no va a ser parte del bundle de tecnologias del cliente


import MeetupList from '../components/meetups/MeetupList';



/* 
Sacamos esta data de la DB y no usamos mas el arreglo dummy
const DUMMY_MEETUPS = [
    {
        id: 'm1',
        title: 'A First Meetup',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Taipei_101_2009_amk.jpg/800px-Taipei_101_2009_amk.jpg',
        address: 'Some address 5, 12345 Some City',
        description: 'This is a first meetup!'
    },
    {
        id: 'm2',
        title: 'A Second Meetup',
        image: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Iloilo.Public.Market02.jpg',
        address: 'Some address 543, 12345 Some City',
        description: 'This is a second meetup!'
    },
] */

function HomePage(props) {

    // al recibir el objeto props de getStaticProps no hace falta el estado ni el useEffect para hacer el http request

    // const [loadMeetups, setLoadMeetups] = useState([])

    //  useEffect(() => {

    /* 
     * IMPORTANTE: PRE-RENDERING - Cuando hay que esperar a que se ejecute una promesa para obtener data:
     * useEffect ejecuta la callback despues
     * de que la funcion componente (HomePage) fue ejecutada por lo tanto inicialmente
     * el estado (loadMeetups) esta vacio o con info que no es la del http request de ese momento.
     * Es por esto que la primera vez que el componente se renderiza no tiene la info que nos interesa.
     * Este comportamiento hace que el codigo fuente de la pagina no tenga la informacion completa (vacia o vieja) afectando
     * el SEO de nuestro sitio ya que los crawlers de los buscadores no van a ver la informacion completa/correcta
     * Para esto se usa el pre-rendering con <--- getStaticProps() y getServerSideProps() --->
     */


    // 1) send http request to fetch data
    // 2) setState:

    //   setLoadMeetups(DUMMY_MEETUPS);  // simulamos con DUMMY_MEETUPS el pedido async http

    // }, [])

    // las meetups son las que recibe <HomePage /> gracias al pre-rendering dentro del objeto props:

    return (
        <Fragment>
            <Head>
                <title>Mati Meetups</title>
                <meta name="description" content="Browse a huge list of highly active React meetups!" />
            </Head>
            <MeetupList meetups={props.meetups} />
        </Fragment>
    );
}

export async function getStaticProps() {

    /* Este nombre getStaticProps esta reservado y si Next encuentra esta funcion durante el proceso de pre-rendering,
     * lo primero que hace es ejecutarla y hasta que no se termine de ejecutar no entra en la Component Function.
     * El trabajo de esta funcion es preparar props para esta pagina (solo se puede usar en componentes guardados
     * dentro de la carpeta "pages").
     *
     * De esta forma tenemos la posibilidad de cargar data antes de que la Component Function es ejecutada y asi el
     * componente se renderiza con la data cargada correctamente.
     *
     * Dentro de esta funcion se puede escribir cualquier codigo que normalmente correria en un servidor (acceder a
     * un file system, conectarse de forma segura a una db) porque el codigo escrito aca dentro nunca llegara ni nunca
     * se ejecutara del lado del cliente porque este codigo se ejecuta durante el build process (no en el servidor, ni
     * tampoco del lado del browser de los visitantes)
     */

    // 1) fetch data from an API
    // 2) acceder a un file system
    // 3) etc
    // ...)
    // 10) una vez terminado de realizar las funciones necesarias debemos retornar un objeto de configuracion: 

    /*
     * Sin revalidate se hace el getStaticProps solo cuando se buildea la app. Es
     * decir que si la data cambio, para poder tener la info actualizada debemos buildear
     * de nuevo el sitio
     *
     */

    /*
     * NO HACE FALTA HACER EL FETCH A NUESTRA API YA QUE EL CODIGO DENTRO DE getStaticProps/getServerSideProps
     * CORRE EN EL SERVER (O DURANTE EL BUILD - NO EN EL BROWSER). Por lo tanto aca se puede escribir directamente
     * el codigo para obtener de la db la info o en una funcion helper que ejecutamos aca.
     * Por lo tanto no necesitamos enviar un request a nuestra ruta API, podemos inmediatamente ejecutar el codigo aca.
     *
     */

    //seteamos la conexion:
    const client = await MongoClient.connect('mongodb+srv://agrossio:Monkey25@cluster0.bv7s061.mongodb.net/meetups?retryWrites=true&w=majority') // aca meetups es el nombre de la db

    // accedemos a la db:
    const db = client.db();

    // accedemos a la coleccion:
    const meetupsCollection = db.collection('meetups'); // de.collection recibe como parametro un string con el nombre de la coleccion

    // buscamos todos los documentos (registros) de la coleccion y los pedimos en forma de array
    const meetups = await meetupsCollection.find().toArray();

    client.close();

    return {
        props: {                    // el objeto props es el objeto que recibe el componente <HomePage /> como prop
            meetups: meetups.map(meetup => {
                return {
                    title: meetup.title,
                    address: meetup.address,
                    image: meetup.image,
                    id: meetup._id.toString(),
                }


            }),
        },
        // Incremental Static Generation: next va a generar la data con el build y cada 10 segundos desde el server
        // mientras tenga pedidos de esta pagina.
        // Con esto nos aseguramos que la data tiene como maximo 10 segs de antiguedad (o los segs que pongamos)
        revalidate: 10  // los segundos que usamos depende de la frecuencia de actualizacion de la data en la db, archivos, etc

    };
}

// export async function getServerSideProps(context) {

//     /*
//      * getServerSideProps es como getStaticProps pero se ejecuta con cada pedido de esta pagina que hace el cliente
//      * por eso no hace falta el revalidate. La desventaja de getServerSideProps es que necesita esperar a que la pagina
//      * se genere en cada pedido que el cliente le hace al servidor, por lo tanto es mas lenta la carga de la pagina.
//      * Por lo tanto, sino tenemos data que cambie todo el tiempo y tamporo necesitamos la informacion del pedido (context.req)
//      * por ej para autenticacion debemos usar getStaticProps ya que es mucho mas rapido ya que la pagina puede ser chacheada
//      * y reutilizada.
//      * 
//      * Para este proyecto de Meetups es mas correcto usar getStaticProps por lo tanto lo comentamos
//      * 
//      */

//     // 1) fetch data from an API
//     // 2) acceder a un file system
//     // 3) etc
//     // ...)
//     // 10) una vez terminado de realizar las funciones necesarias debemos retornar un objeto de configuracion: 

//     // con el parametro context puedo obtener (tambien se puede usar en getStaticProps pero en ese caso no tiene req y res):

//     const req = context.req;    // puedo obtener el contenido del request
//     const res = context.res;    // puedo generar contenido del response (no me queda claro para que sirve en este caso)


//     return {
//         props: {
//             meetups: DUMMY_MEETUPS,
//         }
//     };
// }

export default HomePage;