import { loadPaginatedData } from "../../../request/actions";
import { getSdgsList } from "../../../request/fetch/getSdgList";
import xlsx from "xlsx";
import { mailSender } from "../../mail/mailSender";
export const genSdgListExcel = async (email: string) => {
    try {
        console.log("Loading Data...");
        let data = await loadPaginatedData(getSdgsList);
        data.forEach((e) => {
            e.parameters = e.parameters.join(',') as any
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
        xlsx.writeFile(workbook, "public/sdg_list.xlsx");
        console.log("Complete Excel Generate");
        await mailSender("Sdg List Excel Report", email, ["sdg_list.xlsx"])

    } catch (error) {
        console.log(error);
    }
}