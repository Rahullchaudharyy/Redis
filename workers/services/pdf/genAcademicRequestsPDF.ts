import fs from "fs";
import PDFDocumentWithTables from "pdfkit-table";
import { mailSender } from "../../mail/mailSender";
import { loadPaginatedData } from "../../../request/actions";
import type { AcademicRequestsItem } from "../../../interface/academics";
import { getAcademicRequests } from "../../../request/fetch/getAcademicsRequests";

export const genAcademicRequestsPDF = async (email: string) => {
    const doc = new PDFDocumentWithTables({ margin: 30 });
    const filePath = "public/academic_requests.pdf";
    doc.pipe(fs.createWriteStream(filePath)); // Output PDF to file

    try {
        console.log("Loading Academic Requests...");
        const requests: AcademicRequestsItem[] = await loadPaginatedData(getAcademicRequests);

        if (!requests || requests.length === 0) {
            console.log("No academic requests available.");
            doc.fontSize(14).text("No academic requests available.", { align: "center" });
            doc.end(); // Finalize the document
            throw new Error("No academic requests available.");
        }

        // Add Title and Header
        doc.fontSize(20).text("Academic Requests Report", { align: "center" });
        doc.moveDown(2); // Add spacing

        // Prepare Table Data
        const table = {
            headers: [
                "Request ID",
                "Academic Title",
                "Location",
                "Start Date",
                "End Date",
                "Language",
                "Amount",
                "Applicant Name",
                "Applicant Email",
                "Status",
                "Updated By",
                "Created At",
            ],
            rows: requests.map((item) => {
                const application = item.applicationData;
                const academic = item.academic;

                return [
                    item.id,
                    academic.title || "N/A",
                    academic.location || "N/A",
                    academic.startDate || "N/A",
                    academic.endDate || "N/A",
                    academic.languge || "N/A",
                    academic.amount || 0,
                    application.parent.firstName || "N/A",
                    application.parent.email || "N/A",
                    item.status || "N/A",
                    item?.expand?.updateBy
                        ? `${item?.expand?.updateBy?.first_name || ""} ${item?.expand?.updateBy?.last_name || ""}`.trim() || "N/A"
                        : "N/A",
                    item.created || "N/A",
                ];
            }),
        };

        // Add Table to PDF
        doc.table(table as any, {
            padding: [4, 4, 4, 4],
            columnSpacing: 5,
            minRowHeight: 10,
            width: doc.page.width - 60, // Adjust for margins
        });

        doc.end(); // Finalize the document
        console.log("PDF file for Academic Requests generated successfully.");

        // Send the PDF file via email
        await mailSender("Academic Requests List PDF Report", email, ["academic_requests.pdf"]);
    } catch (error) {
        console.error("Error generating Academic Requests PDF:", error);
        doc.fontSize(14).text("An error occurred while generating the PDF.", { align: "center" });
        doc.end(); // Finalize the document
    }
};
