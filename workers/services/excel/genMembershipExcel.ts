import xlsx from "xlsx";
import { mailSender } from "../../mail/mailSender";
import { loadPaginatedData } from "../../../request/actions";
import { getMembershipRequests } from "../../../request/fetch/getMembershipRequests";
import type { MemberShipPayment } from "../../../interface/membership";


export const genMembershipExcel = async (email: string) => {
    try {
        console.log("Loading Data...");
        const requests: MemberShipPayment[] = await loadPaginatedData(getMembershipRequests);

        if (!requests || requests.length === 0) {
            console.log("No membership requests available.");
            throw new Error("No membership requests available.");
        }

        // Prepare data with maximum fields
        const formattedData = requests.map((e) => {
            const user = e.expand?.user;
            const membership = e.expand?.membership;

            return {
                Payment_ID: e.id,
                Customer_name: `${user?.first_name || "N/A"} ${user?.last_name || ""}`,
                User_Email: user?.email || "N/A",
                User_Mobile: user?.mobile_no || "N/A",
                Membership_Name: membership?.name || "N/A",
                Membership_Amount: membership?.amount || "N/A",
                Buy_Plan_Amount: e.amount || 0,
                Plan_Quantity: e.qun || 0,
                Total_Amount: e.amount * e.qun || 0,
                Request_Status: e.status || "N/A",
                Complete_Order: e.completeOrder ? "Yes" : "No",
                Created_At: e.created || "N/A",
                Updated_At: e.updated || "N/A",
            };
        });

        // Create worksheet and workbook
        const worksheet = xlsx.utils.json_to_sheet(formattedData);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, "Membership Requests");

        // Write workbook to file
        const filePath = "public/membership_requests.xlsx";
        xlsx.writeFile(workbook, filePath);
        console.log("Excel file generated successfully.");

        // Send the file via email
        await mailSender("Membership Requests List Excel Report", email, ["membership_requests.xlsx"]);
    } catch (error) {
        console.error("Error generating Membership Requests Excel:", error);
    }
};
