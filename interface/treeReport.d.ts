import { Tree } from "./treeOrders";
import { UserItem } from "./user";

export interface TreeReportItem {
  collectionId: string;
  collectionName: string;
  created: string;
  expand: Expand;
  height: number;
  id: string;
  ob_cm: number;
  status: string;
  street_image: string;
  tree: string;
  other_comments: string;
  tree_image: string;
  updateBy: string;
  updated: string;
}

export interface Expand {
  tree: Tree;
  updateBy: UserItem;
}
