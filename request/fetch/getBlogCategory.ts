import type { BlogCategoryItem } from "../../interface/category";
import type { Collection } from "../../interface/collection";
import { client } from "../actions";

export const getBlogCategory = async () => {
    const req = await client
        .get("/api/collections/blog_category/records/", { perPage: 500 })
        .send<Collection<BlogCategoryItem>>();
    return req;
};
