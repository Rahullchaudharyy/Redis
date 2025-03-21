import { loadPaginatedData } from "../../../request/actions";
import { getProjects } from "../../../request/fetch/getProjects";
import xlsx from "xlsx";
import { mailSender } from "../../mail/mailSender";
export const genProjectExcel = async (email: string) => {
    try {
        console.log("Loading Data...");
        let data = await loadPaginatedData(getProjects);
        data.forEach((e) => {
            // e.parameters = e.parameters.join(',') as any
            e.assigned_by = e.expand?.assigned_by?.map((e) => e.first_name + " " + e.last_name).join(",") as any;
            e.operated_by = e.expand?.operated_by?.map((e) => e.first_name + " " + e.last_name).join(",") as any;
            e.project_images = e.project_images.join(",") as any;
            e.project_videos = e.project_videos.join(",") as any;
            e.unit_types = e.expand?.unit_types?.map((e) => e.name).join(",") as any;
            e.workareas = JSON.stringify((e.workareas)) as any;
            e.accredation_standars = e.expand?.accredation_standars?.title as any;
            e.challenges_and_impact_details_images = e.challenges_and_impact_details_images.join(",") as any;
            e.challenges_and_impact_details_videos = e.challenges_and_impact_details_videos.join(",") as any;
            e.main_interventions = e.main_interventions.join(",") as any;
            e.marker = JSON.stringify(e.marker) as any;

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
        xlsx.writeFile(workbook, "public/projects.xlsx");
        console.log("Complete Excel Generate");
        await mailSender("Project Excel Report", email, ["projects.xlsx"])

    } catch (error) {
        console.log(error);

    }
}