import PDFDocumentWithTables from "pdfkit-table";
import fs from "fs";
import { loadPaginatedData } from "../../../request/actions";
import { getTreeOrders } from "../../../request/fetch/getTreeOrders";
import type { TreeOrderItem } from "../../../interface/treeOrders";
import { mailSender } from "../../mail/mailSender";
export const genPdfTreeOrders = async (email: string) => {
    const doc = new PDFDocumentWithTables({ margin: 30 });
    const outputPath = 'public/trees_orders.pdf';
    doc.pipe(fs.createWriteStream(outputPath)); // Output PDF to file

    try {
        console.log("loading trees...");
        const data: TreeOrderItem[] = await loadPaginatedData(getTreeOrders);  // Fetch tree data

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
            doc.fontSize(20).text("Gray To Green - Tree Orders", { align: "center" });
            doc.moveDown(2); // Additional space below title

            const table = {
                headers: ["Order Id", "Customer Name", "Email ID", "Project", "Unit Amount", "Trees Count", "Amount", "Status", "Order Date"],
                rows: [...data.map((e) => {
                    return [e.id, e.expand.user.first_name + " " + e.expand.user.last_name, e.expand.user.email, e.expand?.project.name, e.expand?.project.omr_unit + "OMR", e.tree_count, (e.expand.project.omr_unit * e.tree_count) + " OMR", e.status, e.created]
                })]
            };

            doc.table(table as any, {
                padding: [4],
                columnSpacing: 10,
                minRowHeight: 5,
            })
            doc.end();  // Finalize the PDF document
            await mailSender("Tree Orders List Pdf Report", email, ["trees_orders.pdf"])
        }
    } catch (error) {
        console.log("Error loading trees:", error);
        doc.fontSize(14).text("An error occurred while loading tree data.", { align: "center" });
        doc.end();  // Finalize the PDF document
    }

}