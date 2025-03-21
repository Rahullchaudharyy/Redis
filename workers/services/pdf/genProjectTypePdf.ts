import PDFDocumentWithTables from "pdfkit-table";
import { loadPaginatedData } from "../../../request/actions";
import { getProjectType } from "../../../request/fetch/project_type";
import fs from "fs";
import { mailSender } from "../../mail/mailSender";

export const genProjectTypePdf = async (email: string) => {
    const doc = new PDFDocumentWithTables({ margin: 30 });
    const outputPath = 'public/project_types.pdf';
    doc.pipe(fs.createWriteStream(outputPath)); // Output PDF to file
    try {
        console.log("Loading Data...");
        let data = await loadPaginatedData(getProjectType);
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
        doc.fontSize(20).text("Gray To Green - Project Types", { align: "center" });
        doc.moveDown(2); // Additional space below title
        const table: any = {
            headers: ['Id', 'Name', "Parameters", "Unit Measurement", "Created", "Last Update"],
            rows: [...data.map((e) => {
                return [e.id, e.name, e.parameters, e.unit_measurement, e.created, e.updated]
            })]
        };

        doc.table(table, {
            padding: [4],
            columnSpacing: 10,
            minRowHeight: 5,
        })
        doc.end();
        await mailSender("Project Types Pdf Report", email, ["project_types.pdf"])
    } catch (e) {
        doc.end();
        console.log(e);
    }
}