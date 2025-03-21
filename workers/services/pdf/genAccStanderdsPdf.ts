
import { mailSender } from "../../mail/mailSender";
import PDFDocumentWithTables from "pdfkit-table";
import fs from "fs";
import { getAreaTypes } from "../../../request/fetch/getAreaType";
import { getAccredationStandars } from "../../../request/fetch/getAccStanders";

export const genAccStanderdsPdf = async (email: string) => {
    const doc = new PDFDocumentWithTables({ margin: 30 });

    const outputPath = 'public/acc-standards.pdf';
    doc.pipe(fs.createWriteStream(outputPath));
    try {
        console.log("Loading Data...");
        let { items } = await getAccredationStandars();
        items.forEach((e) => {
            // delete non required Fields
            // @ts-ignore
            delete e.collectionId;
            // @ts-ignore
            delete e.collectionName;
        });

        // Set Image Path and Dimensions
        const imagePath = 'public/main-logo.png';
        const imageWidth = 100; // Width of the image
        const imageHeight = 35; // Height of the image

        // Calculate X Position to Center the Image
        const xPos = (doc.page.width - imageWidth) / 2;

        // Add Image at Centered Position
        doc.image(imagePath, xPos, 50, { // 50 is the Y position for top margin
            width: imageWidth,
            height: imageHeight,

        });

        // Move Down to Place Title Below Image
        doc.moveDown(6); // Adjust spacing as needed
        doc.fontSize(20).text("Gray To Green - Accredation Standars", { align: "center" });
        doc.moveDown(2); // Additional space below title
        const table: any = {
            headers: ['Id', 'Title', "Created", "Last Update"],
            rows: [...items.map((e) => {
                return [e.id, e.title, e.created, e.updated]
            })]
        };

        doc.table(table, {
            padding: [4],
            columnSpacing: 10,
            minRowHeight: 5,
        });

        doc.end();
        console.log("Complete Excel Generate");
        await mailSender("Blog Category List Pdf Report", email, ["acc-standards.pdf"])
    } catch (error) {
        doc.end()
        console.log(error);
    }
}