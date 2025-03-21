import type { BlogCategoryItem } from "../../interface/category";
import type { Collection } from "../../interface/collection";
import { client } from "../actions";

export const getAccredationStandars = async (page: number = 1) => {

    const req = await client
        .get("/api/collections/accredation_standars/records", {
            sort: "-created",
            perPage: 500,
            page: page,
        })
        .send<Collection<BlogCategoryItem>>();
    return req;
};
