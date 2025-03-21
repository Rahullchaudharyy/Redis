import type { Collection } from "../../interface/collection";
import type { Tree, TreeOrderItem } from "../../interface/treeOrders";
import { client } from "../actions";

export const getTrees = async (page: number = 1, filter?: string) => {

  const req = await client
    .get("/api/collections/trees/records/", {
      expand: "project,user,order,type,update_by,unit,planted_by,maped_by",
      perPage: 20,
      page: page,
      sort: "-created",
      filter: filter || "(status!='pending')",
    })
    .send<Collection<Tree>>();
  return req;
};

export const loadAllTrees = async (
  page: number = 1,
  tmData: Tree[] = [],
  onProgress?: (progress: number) => void
): Promise<Tree[]> => {
  const data = await getTrees(page, "(status!='pending')");
  const updatedTmData = tmData.concat(data.items);

  // Update progress after each page is loaded
  if (onProgress && data.totalPages > 1) {
    const progressPercentage = Math.floor((page / data.totalPages) * 100);
    onProgress(progressPercentage);
  }

  if (page < data.totalPages) {
    return await loadAllTrees(page + 1, updatedTmData, onProgress);
  }

  return updatedTmData;
};