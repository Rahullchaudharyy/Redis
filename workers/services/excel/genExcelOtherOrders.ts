import xlsx from "xlsx";
import type { OthersOrdersItem } from "../../../interface/othersOrdersItem";
import { loadPaginatedData } from "../../../request/actions";
import { getOthersOrdersList } from "../../../request/fetch/getOtherOrderList";
import { mailSender } from "../../mail/mailSender";

export const genExcelOtherOrders = async (email: string) => {
    try {
        console.log("Loading other orders data...");
        const data: OthersOrdersItem[] = await loadPaginatedData(getOthersOrdersList);

        if (!data || data.length === 0) {
            console.log("No orders data available.");
            throw new Error("No orders data available.");
        }

        // Prepare data for Excel
        const formattedData = data.map((e) => {
            const user = e.expand.user;
            const project = e.expand.project;

            return {
                Order_ID: e.id,
                Customer_Name: `${user.first_name || "N/A"} ${user.last_name || ""}`,
                Email: user.email || "N/A",
                Mobile: user.mobile_no || "N/A",
                City: user.city || "N/A",
                Country: user.country || "N/A",
                Project_Name: project?.name || "N/A",
                Project_Location: project?.location || "N/A",
                Project_Unit_Amount: `${project?.omr_unit || 0} OMR`,
                Total_Amount: `${e.amount} OMR`,
                Status: e.status || "N/A",
                Assigned_To: e.expand.asigned_to
                    ? `${e.expand.asigned_to.first_name || "N/A"} ${e.expand.asigned_to.last_name || ""}`
                    : "N/A",
                Support_Person: e.expand.support
                    ? `${e.expand.support.first_name || "N/A"} ${e.expand.support.last_name || ""}`
                    : "N/A",
                Mapping_Status: e.maping_status || "N/A",
                Order_Date: e.created || "N/A",
                Last_Updated: e.updated || "N/A",
                Updated_By: e.expand.updatedBy
                    ? `${e.expand.updatedBy.first_name || "N/A"} ${e.expand.updatedBy.last_name || ""}`
                    : "N/A",
            };
        });

        // Create worksheet and workbook
        const worksheet = xlsx.utils.json_to_sheet(formattedData);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, "Other Orders");

        // Write workbook to file
        const filePath = "public/other_orders.xlsx";
        xlsx.writeFile(workbook, filePath);
        console.log("Excel file generated successfully.");

        // Send the file via email
        await mailSender("Other Orders List Excel Report", email, ["other_orders.xlsx"]);
    } catch (error) {
        console.error("Error generating Excel file:", error);
    }
};
