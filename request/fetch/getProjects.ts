import type { Collection } from "../../interface/collection";
import type { ProjectItem } from "../../interface/project";
import { client } from "../actions";

export const getProjects = async (
    page: number = 1,
    filter?: string,
    fields?: string,
    hideFields?: string,
    expand?: string,
    signal?: AbortSignal
) => {

    const req = await client
        .get("/api/collections/projects/records", {
            sort: "-created",
            perPage: 20,
            page: page,
            expand: expand || "operated_by,reports,sdgs,unit_types,type,assigned_by,operated_by,unit_types,accredation_standars",
            filter: filter || "",
            fields: fields || "*",
            hideFields: hideFields || "",
        })
        .send<Collection<ProjectItem>>();
    return req;
};