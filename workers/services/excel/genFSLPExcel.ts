import xlsx from "xlsx";
import { mailSender } from "../../mail/mailSender";
import { genPbFiles, loadPaginatedData } from "../../../request/actions";
import { getFslpRequests } from "../../../request/fetch/getFslpRequests";
import type { FSLPItem } from "../../../interface/fslp";

export const genFSLPExcel = async (email: string) => {
    try {
        console.log("Loading FSLP Requests...");
        const requests: FSLPItem[] = await loadPaginatedData(getFslpRequests);

        if (!requests || requests.length === 0) {
            console.log("No FSLP requests available.");
            throw new Error("No FSLP requests available.");
        }

        // Prepare data for Excel file
        const formattedData = requests.map((item) => {
            const application = item.application;

            return {
                Request_ID: item.id,
                First_Name: application.firstName || "N/A",
                Last_Name: application.lastName || "N/A",
                Email: application.emailID || "N/A",
                Mobile: application.mobileNo || "N/A",
                Date_of_Birth: application.dob || "N/A",
                Gender: application.gender || "N/A",
                Address: application.address || "N/A",
                City: application.city || "N/A",
                Country: application.country || "N/A",
                Nationality: application.nationality || "N/A",
                University_Name: application.universityName || "N/A",
                Education_State: application.eduState || "N/A",
                Post_Code: application.postCode || "N/A",
                Brief: application.sortBreif || "N/A",
                CV_Link: genPbFiles(item, item.cv) || "N/A",
                Profile_Picture: genPbFiles(item, item.pic) || "N/A",
                Review_Note: item.review_note || "N/A",
                Status: item.status || "N/A",
                Updated_By: item.expand?.updateBy
                    ? `${item.expand.updateBy.first_name} ${item.expand.updateBy.last_name}`
                    : "N/A",
                Created_At: item.created || "N/A",
                Updated_At: item.updated || "N/A",
            };
        });

        // Create worksheet and workbook
        const worksheet = xlsx.utils.json_to_sheet(formattedData);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, "FSLP Requests");

        // Write workbook to file
        const filePath = "public/fslp_requests.xlsx";
        xlsx.writeFile(workbook, filePath);
        console.log("Excel file for FSLP Requests generated successfully.");

        // Send the Excel file via email
        await mailSender("FSLP Requests List Excel Report", email, ["fslp_requests.xlsx"]);
    } catch (error) {
        console.error("Error generating FSLP Requests Excel:", error);
    }
};
