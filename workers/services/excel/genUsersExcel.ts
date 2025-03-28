import { loadPaginatedData } from "../../../request/actions";
import { getUnitTypes } from "../../../request/fetch/getUnitTypeList";
import xlsx from "xlsx";
import { mailSender } from "../../mail/mailSender";
import { getUsers } from "../../../request/fetch/getUsers";
export const genUsersTypeExcel = async (email: string) => {
    try {
        console.log("Loading Data...");
        let data = await loadPaginatedData(getUsers);
        data.forEach((e) => {

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
        xlsx.writeFile(workbook, "public/users.xlsx");
        console.log("Complete Excel Generate");
        await mailSender("Users Excel Report", email, ["users.xlsx"])

    } catch (error) {
        console.log(error);
    }
}