import type { Collection } from "../../interface/collection";
import type { ProjectType } from "../../interface/projectType";
import { client } from "../actions";

export const getProjectType = async (page: number = 1, filter?: string) => {

    const req = await client
        .get("/api/collections/project_type/records", {
            sort: "-created",
            perPage: 20,
            page: page,
            filter: filter || "",
        })
        .send<Collection<ProjectType>>();
    return req;
};

