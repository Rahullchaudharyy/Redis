import fs from "fs";
import PDFDocumentWithTables from "pdfkit-table";
import type { OthersOrdersItem } from "../../../interface/othersOrdersItem";
import { loadPaginatedData } from "../../../request/actions";
import { getOthersOrdersList } from "../../../request/fetch/getOtherOrderList";
import { mailSender } from "../../mail/mailSender";

export const getOtherOrdersPdf = async (email: string) => {
    const doc = new PDFDocumentWithTables({ margin: 30 });
    const outputPath = 'public/other_orders.pdf';
    doc.pipe(fs.createWriteStream(outputPath)); // Output PDF to file

    try {
        console.log("Loading tree orders...");
        const data: OthersOrdersItem[] = await loadPaginatedData(getOthersOrdersList);  // Fetch tree order data

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
            doc.fontSize(20).text("Gray To Green - Other Orders", { align: "center" });
            doc.moveDown(2); // Additional space below title

            // Create Table for Orders
            const table = {
                headers: [
                    "Order Id",
                    "Customer Name",
                    "Email ID",
                    "Project",
                    "Unit Amount",
                    "Total Amount",
                    "Status",
                    "Order Date"
                ],
                rows: data.map((e) => {
                    const user = e.expand.user;
                    const project = e.expand.project;

                    return [
                        e.id,
                        `${user?.first_name || "N/A"} ${user?.last_name || ""}`,
                        user?.email || "N/A",
                        project?.name || "N/A",
                        `${project?.omr_unit || 0} OMR`,
                        e.amount,
                        e.status || "N/A",
                        e.created || "N/A"
                    ];
                })
            };

            // Add Table to PDF
            doc.table(table as any, {
                padding: [4],
                columnSpacing: 10,
                minRowHeight: 5,
                width: doc.page.width - doc.page.margins.left - doc.page.margins.right, // Fit table within margins
            });
        }

        doc.end();  // Finalize the PDF document

        console.log("PDF generated successfully.");
        await mailSender("Tree Orders List PDF Report", email, ["other_orders.pdf"]); // Send the PDF as an attachment
    } catch (error) {
        console.error("Error generating tree orders PDF:", error);

        doc.fontSize(14).text("An error occurred while generating the PDF report.", { align: "center" });
        doc.end();  // Finalize the PDF document, even on error
    }
};
