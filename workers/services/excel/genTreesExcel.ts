import { loadPaginatedData } from "../../../request/actions";
import { getTrees } from "../../../request/fetch/trees";
import xlsx from "xlsx";
import { mailSender } from "../../mail/mailSender";
export const genTreesExcel = async (email: string) => {
    try {
        console.log("Loading Data...");
        let data = await loadPaginatedData(getTrees);
        data.forEach((e) => {
            e.area = e.area.areaName as any,
                e.project = e.expand?.project?.name as any;
            e.maped_by = e.expand?.maped_by ? e.expand.maped_by.first_name + " " + e.expand.maped_by.last_name : "N/A";
            e.planted_by = e.expand?.planted_by ? e.expand.planted_by.first_name + " " + e.expand.planted_by.last_name : "N/A";
            e.unit = e.expand?.unit?.name || "N/A";
            e.update_by = e.expand?.update_by?.first_name + " " + e.expand?.update_by?.last_name;
            e.user = e.expand?.user?.first_name + " " + e.expand?.user?.last_name;
            delete e.expand;
            // @ts-ignore
            delete e.collectionId;
            // @ts-ignore
            delete e.collectionName;
        });

        const worksheet = xlsx.utils.json_to_sheet(data);

        // 2. Create a new workbook and append the worksheet to it
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        // 3. Write workbook to Excel file
        xlsx.writeFile(workbook, "public/trees.xlsx");
        console.log("Complete Excel Generate");
        await mailSender("Trees List Excel Report", email, ["trees.xlsx"])

    } catch (error) {
        console.log(error);

    }
}