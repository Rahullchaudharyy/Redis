import fs from "fs";
import PDFDocumentWithTables from "pdfkit-table";
import { loadPaginatedData } from "../../../request/actions";
import { getFslpRequests } from "../../../request/fetch/getFslpRequests";
import type { FSLPItem } from "../../../interface/fslp";
import { mailSender } from "../../mail/mailSender";

export const genFSLPPdf = async (email: string) => {
    const doc = new PDFDocumentWithTables({ margin: 30 });
    const outputPath = 'public/fslp_requests.pdf';
    doc.pipe(fs.createWriteStream(outputPath)); // Output PDF to file

    try {
        console.log("Loading FSLP Requests...");
        const requests: FSLPItem[] = await loadPaginatedData(getFslpRequests);

        if (!requests || requests.length === 0) {
            console.log("No FSLP requests available.");
            doc.fontSize(14).text("No FSLP requests available.", { align: "center" });
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

            // Move Down for the Title
            doc.moveDown(6);
            doc.fontSize(20).text("FSLP Requests Report", { align: "center" });
            doc.moveDown(2); // Space below the title

            // Prepare table data
            const table = {
                headers: [
                    "Request ID", "First Name", "Last Name", "Email", "Mobile",
                    "DOB", "Gender", "University", "Status", "Updated By",
                    "Created At", "Updated At"
                ],
                rows: requests.map(item => {
                    const application = item.application;
                    return [
                        item.id,
                        application.firstName || "N/A",
                        application.lastName || "N/A",
                        application.emailID || "N/A",
                        application.mobileNo || "N/A",
                        application.dob || "N/A",
                        application.gender || "N/A",
                        application.universityName || "N/A",
                        item.status || "N/A",
                        item.expand?.updateBy
                            ? `${item.expand.updateBy.first_name} ${item.expand.updateBy.last_name}`
                            : "N/A",
                        item.created || "N/A",
                        item.updated || "N/A"
                    ];
                })
            };

            // Add table to PDF
            doc.table(table as any, {
                padding: [4],
                columnSpacing: 10,
                minRowHeight: 5,
            });

            doc.end();  // Finalize the PDF document
            console.log("PDF file for FSLP Requests generated successfully.");

            // Send the PDF file via email
            await mailSender("FSLP Requests List PDF Report", email, ["fslp_requests.pdf"]);
        }
    } catch (error) {
        console.error("Error generating FSLP Requests PDF:", error);
        doc.fontSize(14).text("An error occurred while loading FSLP requests.", { align: "center" });
        doc.end(); // Finalize PDF even in case of error
    }
};
