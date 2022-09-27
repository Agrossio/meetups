/* ***************
 *      RUTA:    *
 *   api/cron/   *
 * ***************/

import { testEmail } from "../../../util/mailer";

const SECRET = process.env.NEXTAUTH_SECRET

const user = {
    name: "Mati",
    email: "agrossio@hotmail.com"
}

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const { authorization } = req.headers;

            // console.log("-----------------FUNCIONA_CRON_JOB---------------")

            testEmail(user)

            if (authorization === `Bearer ${SECRET}`) {
                res.status(200).json({ success: true });
            } else {
                res.status(401).json({ success: false });
            }
        } catch (err) {
            res.status(500).json({ statusCode: 500, message: err.message });
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}