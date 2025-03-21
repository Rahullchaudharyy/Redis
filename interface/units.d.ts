import { projectDataType } from "@/redux/slices/projectManageSlice";
import { SDGITEM } from "./sdg";
import { ProjectType } from "./projectType";

export interface UnitItem {
  collectionId: string;
  collectionName: string;
  created: string;
  expand?: Expand;
  id: string;
  name: string;
  prefix: string;
  orm_unit: string;
  project_type: string[];
  sdg: string[];
  unit: string;
  updated: string;
  parameters: { name: string; value: string }[];
}

export interface Expand {
  project_type?: ProjectType[];
  sdg?: SDGITEM[];
}
