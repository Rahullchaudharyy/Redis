import { loadPaginatedData } from "../../../request/actions";
import xlsx from "xlsx";
import { mailSender } from "../../mail/mailSender";
import { getTreeTypes } from "../../../request/fetch/getTreeTypes";
export const genTreeTypesExcel = async (email: string) => {
    try {
        console.log("Loading Data...");
        let data = await loadPaginatedData(getTreeTypes);
        data.forEach((e) => {

            // delete non required Fields
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
        xlsx.writeFile(workbook, "public/tree_types.xlsx");
        console.log("Complete Excel Generate");
        await mailSender("Tree Type Excel Report", email, ["tree_types.xlsx"])

    } catch (error) {
        console.log(error);
    }
}