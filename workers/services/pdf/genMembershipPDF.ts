import PDFDocumentWithTables from "pdfkit-table";
import fs from "fs";
import { mailSender } from "../../mail/mailSender";
import { loadPaginatedData } from "../../../request/actions";
import { getMembershipRequests } from "../../../request/fetch/getMembershipRequests";
import type { MemberShipPayment } from "../../../interface/membership";

export const genMembershipPDF = async (email: string) => {
    const doc = new PDFDocumentWithTables({ margin: 30 });
    const outputPath = "public/membership_requests.pdf";
    doc.pipe(fs.createWriteStream(outputPath)); // Output PDF to file

    try {
        console.log("Loading Data...");
        const requests: MemberShipPayment[] = await loadPaginatedData(getMembershipRequests);

        if (!requests || requests.length === 0) {
            console.log("No membership requests available.");
            doc.fontSize(14).text("No membership requests available.", { align: "center" });
            doc.end();
            throw new Error("No membership requests available.");
        }

        // Add a title and logo
        const imagePath = "public/main-logo.png";
        const imageWidth = 100;
        const imageHeight = 35;
        const xPos = (doc.page.width - imageWidth) / 2;

        doc.image(imagePath, xPos, 30, { width: imageWidth, height: imageHeight });
        doc.moveDown(5);
        doc.fontSize(20).text("Membership Requests Report", { align: "center" });
        doc.moveDown(2);

        // Prepare table data
        const table = {
            headers: [
                "Payment ID",
                "Customer Name",
                "Email",
                "Mobile",
                "Membership Name",
                "Membership Amount",
                "Plan Quantity",
                "Total Amount",
                "Status",
                "Order Completed",
                "Created At",
                "Updated At",
            ],
            rows: requests.map((e) => {
                const user = e.expand?.user;
                const membership = e.expand?.membership;

                return [
                    e.id,
                    `${user?.first_name || "N/A"} ${user?.last_name || ""}`,
                    user?.email || "N/A",
                    user?.mobile_no || "N/A",
                    membership?.name || "N/A",
                    membership?.amount || "N/A",
                    e.qun || 0,
                    e.amount * e.qun || 0,
                    e.status || "N/A",
                    e.completeOrder ? "Yes" : "No",
                    e.created || "N/A",
                    e.updated || "N/A",
                ];
            }),
        };

        // Add table to PDF
        doc.table(table as any, {
            padding: [4],
            columnSpacing: 10,
            minRowHeight: 10,
            width: doc.page.width - 60, // Adjust for margins
        });

        doc.end(); // Finalize the PDF
        console.log("PDF generated successfully.");

        // Send the PDF via email
        await mailSender("Membership Requests List PDF Report", email, ["membership_requests.pdf"]);
    } catch (error) {
        console.error("Error generating Membership Requests PDF:", error);
        doc.fontSize(14).text("An error occurred while generating the PDF.", { align: "center" });
        doc.end();
    }
};
