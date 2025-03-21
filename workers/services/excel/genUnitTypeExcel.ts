import { loadPaginatedData } from "../../../request/actions";
import { getUnitTypes } from "../../../request/fetch/getUnitTypeList";
import xlsx from "xlsx";
import { mailSender } from "../../mail/mailSender";
export const genUnitTypeExcel = async (email: string) => {
    try {
        console.log("Loading Data...");
        let data = await loadPaginatedData(getUnitTypes);
        data.forEach((e) => {
            e.project_type = e.expand?.project_type?.map((e) => e.name).join(",") as any;
            e.parameters = e.parameters.map((e) => `(${e.name}--${e.value})`).join(" , ") as any;
            e.sdg = e.expand?.sdg?.map((e) => e.name).join(",") as any;

            // delete non required Fields
            // @ts-ignore
            delete e.collectionId;
            // @ts-ignore
            delete e.collectionName;
            delete e.expand;
        });

        const worksheet = xlsx.utils.json_to_sheet(data);

        // 2. Create a new workbook and append the worksheet to it
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        // 3. Write workbook to Excel file
        xlsx.writeFile(workbook, "public/unit_types.xlsx");
        console.log("Complete Excel Generate");
        await mailSender("Unit Type Excel Report", email, ["unit_types.xlsx"])

    } catch (error) {
        console.log(error);
    }
}