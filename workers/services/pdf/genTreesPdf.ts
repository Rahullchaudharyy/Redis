import { loadAllTrees } from "../../../request/fetch/trees";
import PDFDocument from "pdfkit-table";
import fs from "fs";
import type { Tree } from "../../../interface/treeOrders";
import { ageOfDays } from "../../../helper/dateTime";
import { mailSender } from "../../mail/mailSender";

export const genPdfTrees = async (email: string) => {
    const doc = new PDFDocument({ margin: 30 });
    const outputPath = 'public/trees.pdf';
    doc.pipe(fs.createWriteStream(outputPath)); // Output PDF to file

    try {
        console.log("loading trees...");
        const data: Tree[] = await loadAllTrees();  // Fetch tree data

        if (!data || data.length === 0) {
            console.log("No tree data available.");
            doc.fontSize(14).text("No tree data available.", { align: "center" });
        } else {
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
            doc.fontSize(20).text("Gray To Green - Tree Report", { align: "center" });
            doc.moveDown(2); // Additional space below title

            const table = {
                headers: ["Tree Id", "Order Id", "Tree Name", "Tree Type", "Project", "Area Name", "Planting Date", "Planted By", "Status"],
                rows: [...data.map((e) => {
                    return [e.treeId, e.orderIdNo, e.treeName, e.expand?.unit?.name, e.expand?.project?.name, (e.area?.areaName || "N/A"), ageOfDays(e.plant_date), e.expand?.planted_by ? e.expand?.planted_by?.first_name + " " + e.expand?.planted_by?.last_name : "N/A", e.status.toUpperCase()]
                })]
            };

            doc.table(table as any, {
                padding: [4],
                columnSpacing: 10,
                minRowHeight: 5,
            })
            doc.end();  // Finalize the PDF document
            await mailSender("Trees List Pdf Report", email, ["trees.pdf"])
        }
    } catch (error) {
        console.log("Error loading trees:", error);
        doc.fontSize(14).text("An error occurred while loading tree data.", { align: "center" });
        doc.end();  // Finalize the PDF document
    }
};
