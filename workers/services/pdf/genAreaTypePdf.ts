
import { mailSender } from "../../mail/mailSender";
import PDFDocumentWithTables from "pdfkit-table";
import fs from "fs";
import { getAreaTypes } from "../../../request/fetch/getAreaType";

export const genAreaTypePdf = async (email: string) => {
    const doc = new PDFDocumentWithTables({ margin: 30 });
    const outputPath = 'public/area_types.pdf';
    doc.pipe(fs.createWriteStream(outputPath));
    try {
        console.log("Loading Data...");
        let { items } = await getAreaTypes();
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
        doc.fontSize(20).text("Gray To Green - Area Types", { align: "center" });
        doc.moveDown(2); // Additional space below title
        const table: any = {
            headers: ['Id', 'Name', "Created", "Last Update"],
            rows: [...items.map((e) => {
                return [e.id, e.name, e.created, e.updated]
            })]
        };

        doc.table(table, {
            padding: [4],
            columnSpacing: 10,
            minRowHeight: 5,
        });

        doc.end();
        console.log("Complete Excel Generate");
        await mailSender("Area Types List Pdf Report", email, ["area_types.pdf"])
    } catch (error) {
        doc.end()
        console.log(error);
    }
}