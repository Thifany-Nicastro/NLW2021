import nodemailer, { Transporter } from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';

class SendMailService {
    private client: Transporter;

    constructor() {
        nodemailer.createTestAccount().then((account) => {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT),
                auth: {
                  user: process.env.SMTP_USER,
                  pass: process.env.SMTP_PASS
                }
            });

            this.client = transporter;
        })
    }
    
    async execute(to: string, subject: string, variables: object, path: string) {
        const templateFileContent = fs.readFileSync(path).toString("utf-8");

        const mailTemplateParse = handlebars.compile(templateFileContent);

        const html = mailTemplateParse(variables)

        const message = await this.client.sendMail({
            to,
            subject,
            html,
            from: "NPS <noreply@nps.com.br>"
        });
    }
}

export default new SendMailService();