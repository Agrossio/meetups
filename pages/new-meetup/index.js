import { useRouter } from 'next/router';
import Head from 'next/head'
import { Fragment } from 'react';

import NewMeetupForm from '../../components/meetups/NewMeetupForm';

function NewMeetupPage() {

    const router = useRouter()
    async function addMeetupHandler(enteredMeetupData) {

        // console.log(enteredMeetupData)

        const response = await fetch('/api/new-meetup', {
            method: 'post',
            body: JSON.stringify(enteredMeetupData),     // convierto la info ingresada en el form a json con JSON.stringify
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log(response)
        const data = await response.json();
        console.log(data);

        router.replace('/') // replace hace lo mismo que push pero evita que el usuario pueda usar el boton atras del browser

    }

    return (
        <Fragment>
            <Head>
                <title>Add a New Meetup</title>
                <meta name="description" content="Add your own meetups and create amazing networking events." />
            </Head>
            <NewMeetupForm onAddMeetup={addMeetupHandler} />
        </Fragment>
    );
}

export default NewMeetupPage;