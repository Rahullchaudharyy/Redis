import { loadPaginatedData } from "../../../request/actions";
import { getSdgsList } from "../../../request/fetch/getSdgList";
import { mailSender } from "../../mail/mailSender";
import fs from "fs";
import PDFDocumentWithTables from "pdfkit-table";
export const genSdgListPdf = async (email: string) => {
    const doc = new PDFDocumentWithTables({ margin: 30 });
    const outputPath = 'public/sdgs_list.pdf';
    doc.pipe(fs.createWriteStream(outputPath)); // Output PDF to file
    try {
        console.log("Loading Data...");
        let data = await loadPaginatedData(getSdgsList);
        data.forEach((e) => {
            e.parameters = e.parameters.join(',') as any
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
        doc.fontSize(20).text("Gray To Green - Sdgs List", { align: "center" });
        doc.moveDown(2); // Additional space below title
        const table: any = {
            headers: ['Id', 'Name', "Image", "Parameters", "Main Color", "Sub Color", "Created", "Last Update"],
            rows: [...data.map((e) => {
                return [e.id, e.name, e.image, e.parameters, e.main_color, e.sub_color, e.created, e.updated]
            })]
        };

        doc.table(table, {
            padding: [4],
            columnSpacing: 10,
            minRowHeight: 5,
        })
        doc.end();
        await mailSender("Sdgs List Pdf Report", email, ["sdgs_list.pdf"])
    } catch (error) {
        doc.end();
        console.log(error);
    }
}