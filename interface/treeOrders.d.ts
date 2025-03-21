import { ProjectItem } from "./project";
import { TreeTypesItem } from "./treetypes";
import { Company, UserItem } from "./user";
import type { UnitItem } from "./units";

export interface TreeOrderItem {
  amount: number;
  asigned_to: string;
  collectionId: string;
  collectionName: string;
  created: string;
  expand: Expand;
  id: string;
  maping_status: string;
  order_id: number;
  project: string;
  status: string;
  tree_count: number;
  trees: string[];
  updated: string;
  user: string;
  plant_date: string;
  type: string;
  support: string,
  planted_trees?: Tree[];
  not_planted_trees?: Tree[];
  filter_by_status?: { [key: string]: Tree[] };
  filter_by_tree_type?: { [key: string]: Tree[] };
  filter_by_area_type?: { [key: string]: Tree[] };
  filter_by_date?: {
    lessThan6Months?: Tree[];
    sixToTwelveMonths?: Tree[];
    oneToTwoYears?: Tree[];
    moreThanThreeYears?: Tree[];
  };
}

export interface Expand {
  trees: Tree[];
  user: UserItem;
  asigned_to: UserItem;
  project: ProjectItem;
  support: UserItem;

}

export interface Tree {
  area: AreaInfo;
  collectionId: string;
  collectionName: string;
  created: string;
  id: string;
  location: string;
  order: string;
  orderIdNo: number;
  project: string;
  status: string;
  treeId: number;
  treeName: string;
  treeType: string;
  updated: string;
  user: string;
  plant_date: string;
  update_by: string;
  planted_by?: string;
  maped_by?: string,
  unit?: string
  expand?: ExpandTree;
}

export interface Position {
  lat: number;
  lng: number;
}

export interface ExpandTree {
  order?: TreeOrderItem;
  project?: ProjectItem;
  user?: UserItem;
  type?: TreeTypesItem;
  update_by?: UserItem;
  planted_by?: UserItem;
  maped_by?: UserItem,
  unit?: UnitItem
}

export interface AreaInfo {
  id: string;
  area: number;
  areaName: string;
  areaType: string;
}

