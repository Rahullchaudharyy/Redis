import xlsx from "xlsx";
import { mailSender } from "../../mail/mailSender";
import { loadPaginatedData } from "../../../request/actions";
import type { AcademicRequestsItem } from "../../../interface/academics";
import { getAcademicRequests } from "../../../request/fetch/getAcademicsRequests";

export const genAcademicRequestsExcel = async (email: string) => {
    try {
        console.log("Loading Academic Requests...");
        const requests: AcademicRequestsItem[] = await loadPaginatedData(getAcademicRequests);

        if (!requests || requests.length === 0) {
            console.log("No academic requests available.");
            throw new Error("No academic requests available.");
        }

        // Prepare data for the Excel file
        const formattedData = requests.map((item) => {
            const application = item.applicationData;
            const academic = item.academic;

            return {
                Request_ID: item.id,
                Academic_Title: academic.title || "N/A",
                Academic_Name: academic.name || "N/A",
                Academic_Location: academic.location || "N/A",
                Academic_Start_Date: academic.startDate || "N/A",
                Academic_End_Date: academic.endDate || "N/A",
                Academic_Language: academic.languge || "N/A",
                Academic_Amount: academic.amount || 0,
                Academic_Pricing: academic.pricing || "N/A",
                Max_Participants: academic.maxParticipents || 0,
                Registration_End_Date: academic.registerationEndDate || "N/A",
                Application_Name: application.parent.firstName + " " + application.parent.lastName || "N/A",
                Application_Email: application.parent.email || "N/A",
                Application_Phone: application.parent.phone || "N/A",
                Application_Address: application.parent.address || "N/A",
                Participants: application.participants.length || "N/A",
                Status: item.status || "N/A",
                Updated_By: item?.expand?.updateBy ? item?.expand?.updateBy?.first_name + " " + item?.expand?.updateBy?.last_name : "N/A",
                Created_At: item.created || "N/A",
                Updated_At: item.updated || "N/A",
            };
        });

        // Create worksheet and workbook
        const worksheet = xlsx.utils.json_to_sheet(formattedData);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, "Academic Requests");

        // Write workbook to file
        const filePath = "public/academic_requests.xlsx";
        xlsx.writeFile(workbook, filePath);
        console.log("Excel file for Academic Requests generated successfully.");

        // Send the Excel file via email
        await mailSender("Academic Requests List Excel Report", email, ["academic_requests.xlsx"]);
    } catch (error) {
        console.error("Error generating Academic Requests Excel:", error);
    }
};
