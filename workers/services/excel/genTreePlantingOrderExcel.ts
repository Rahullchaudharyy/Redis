import xlsx from "xlsx";
import { loadPaginatedData } from "../../../request/actions";
import { getTreeOrders } from "../../../request/fetch/getTreeOrders";
import { mailSender } from "../../mail/mailSender";

export const genTreeOrdersExcel = async (email: string) => {
    try {
        console.log("Loading Data...");
        let data = await loadPaginatedData(getTreeOrders);

        data.forEach((e) => {
            // Order-related fields
            e.order_id = e.order_id;
            e.amount = e.amount;
            e.tree_count = e.tree_count;
            e.maping_status = e.maping_status;
            e.status = e.status;
            e.created = e.created;
            e.updated = e.updated;

            // User-related fields
            // @ts-ignore
            e.user = e.user ? `${e.expand.user.first_name} ${e.expand.user.last_name}` : "N/A";
            // @ts-ignore
            e.email = e.expand.user.email;
            // @ts-ignore
            e.mobile = e.expand.user.mobile_no;
            // @ts-ignore
            e.user_city = e.expand.user.city;
            // @ts-ignore
            e.user_country = e.expand.user.country;

            // Assigned to / Support fields
            e.asigned_to = e.expand.asigned_to
                ? `${e.expand.asigned_to.first_name} ${e.expand.asigned_to.last_name}`
                : "N/A";
            e.support = e.support
                ? `${e.expand.support.first_name} ${e.expand.support.last_name}`
                : "N/A";

            // Project-related fields
            e.project = e.expand.project.name;
            // @ts-ignore
            e.project_location = e.expand.project.location;
            // @ts-ignore
            e.project_start_date = e.expand.project.start_date;
            // @ts-ignore
            e.project_end_date = e.expand.project.end_date;

            // Update/map-related fields
            e.maping_status = e.maping_status || "Pending";

            // Cleanup unnecessary fields
            // @ts-ignore
            delete e.expand;
            // @ts-ignore
            delete e.collectionId;
            // @ts-ignore
            delete e.collectionName;
            // @ts-ignore
            delete e.trees;
            // @ts-ignore
            delete e.plant_date
        });

        // Create worksheet and workbook
        const worksheet = xlsx.utils.json_to_sheet(data);
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, 'TreeOrders');

        // Write Excel file
        const filePath = "public/tree_orders.xlsx";
        xlsx.writeFile(workbook, filePath);
        console.log("Excel file generated successfully.");

        // Send the file via email
        await mailSender("Tree Orders List Excel Report", email, ["tree_orders.xlsx"]);
    } catch (error) {
        console.error("Error generating Excel file:", error);
    }
};
