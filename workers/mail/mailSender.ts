import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
        user: "info@idealedesigns.com",
        pass: "zdsy loxg brow eywi",
    },
});

// async..await is not allowed in global scope, must use a wrapper
export async function mailSender(title: string, email: string, fileNames: string[]) {
    console.log("Sending Email...");

    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: '"Gray To Green Reports - 👻" <codexsourav404@gmail.com>', // sender address
        to: email, // list of receivers
        subject: title, // Subject line
        text: title + " files with attachment", // plain text body
        attachments: fileNames.map((e) => {
            return {
                filename: e,
                path: 'public/' + e
            }
        })
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}
