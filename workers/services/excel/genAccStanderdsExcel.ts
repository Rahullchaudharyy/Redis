import xlsx from "xlsx";
import { getAccredationStandars } from "../../../request/fetch/getAccStanders";
import { mailSender } from "../../mail/mailSender";
export const genAccStanderdsExcel = async (email: string) => {
    try {
        console.log("Loading Data...");
        let { items } = await getAccredationStandars();
        items.forEach((e) => {
            // delete non required Fields
            // @ts-ignore
            delete e.collectionId;
            // @ts-ignore
            delete e.collectionName;
        });

        const worksheet = xlsx.utils.json_to_sheet(items);
        // 2. Create a new workbook and append the worksheet to it
        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        // 3. Write workbook to Excel file
        xlsx.writeFile(workbook, "public/acc-standards.xlsx");
        console.log("Complete Excel Generate");
        await mailSender("Accredation Standars Excel Report", email, ["acc-standards.xlsx"])

    } catch (error) {
        console.log(error);
    }
}