import { loadPaginatedData } from "../../../request/actions";
import { getSdgsList } from "../../../request/fetch/getSdgList";
import { getUnitTypes } from "../../../request/fetch/getUnitTypeList";
import { mailSender } from "../../mail/mailSender";
import fs from "fs";
import PDFDocumentWithTables from "pdfkit-table";

export const genUnitTypePdf = async (email: string) => {
    const doc = new PDFDocumentWithTables({ margin: 0 });
    const outputPath = 'public/unit_types.pdf';
    doc.pipe(fs.createWriteStream(outputPath));
    try {
        console.log("Loading Data...");
        let data = await loadPaginatedData(getUnitTypes);
        data.forEach((e) => {
            e.project_type = e.expand?.project_type?.map((e) => e.name).join(",") as any;
            e.parameters = e.parameters.map((e) => `(${e.name}--${e.value})`).join(" , ") as any;
            e.sdg = e.expand?.sdg?.map((e) => e.name).join(",") as any;

            // delete non required Fields
            // @ts-ignore
            delete e.collectionId;
            // @ts-ignore
            delete e.collectionName;
            delete e.expand;
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
        doc.fontSize(20).text("Gray To Green - Unit Types", { align: "center" });
        doc.moveDown(2); // Additional space below title
        const table: any = {
            headers: ['Id', 'Name', "Orm Unit", "Parameters", "Prefix", "Project Type", "Sdgs", "Unit", "Created", "Last Update"],
            rows: [...data.map((e) => {
                return [e.id, e.name, e.orm_unit, e.parameters, e.prefix, e.project_type, e.sdg, e.unit, e.created, e.updated]
            })]
        };

        doc.table(table, {
            padding: [4],
            columnSpacing: 10,
            minRowHeight: 5,
        });

        doc.end();
        await mailSender("Unit Types Pdf Report", email, ["unit_types.pdf"])
    } catch (e) {
        doc.end();
        console.log(e);
    }
}