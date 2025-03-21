import { MapBoxPickAreaProps } from "@/components/mapbox/mapBoxPickArea";
import { ProjectType } from "./projectType";
import { ReportingItem } from "./reporting";
import { ProjectSDG, SDGITEM } from "./sdg";
import { Tree, TreeOrderItem } from "./treeOrders";
import { UnitItem } from "./units";
import { UserItem } from "./user";

export interface ProjectItem {
  about_project: string;
  address: string;
  allow: boolean;
  project_prefix: "tree" | "plastic";
  challenges_and_impact_details: string;
  challenges_and_impact_details_images: string[];
  challenges_and_impact_details_videos: string[];
  city: string;
  accredation_standars: string;
  collectionId: string;
  collectionName: string;
  country: string;
  created: string;
  email: string;
  expand?: Expand;
  id: string;
  status: string;
  location: string;
  main_interventions: string[];
  marker: Marker;
  name: string;
  number_of_target_unit: number;
  omr_unit: number;
  operated_by: string[];
  assigned_by: string[];
  phone: string;
  preview_image: string;
  project_images: string[];
  project_videos: any[];
  reports: string[];
  sdgs: string[];
  sort_title: string;
  start_date: string;
  end_date: string;
  top_project: boolean;
  type: string;
  unit_measurement: string;
  unit_types: string[];
  updated: string;
  website: string;
  workareas: WorkAreas;

  orders?: TreeOrderItem[];
  byArea?: { [key: string]: Tree[] };
  instagram: string;
  linkedin: string;
  telegram: string;
  profilePdf: string;
  x: string;
  facebook: string;
  total_trees?: number;
}

export interface Expand {
  assigned_by: UserItem[];
  operated_by?: UserItem[];
  sdgs?: ProjectSDG[];
  type?: ProjectType;
  unit_types?: UnitItem[];
  reports?: ReportingItem[];
  accredation_standars?: {
    title: string
  }
}

export interface Parameter {
  name: string;
  value: string;
}

export interface MainIntervention {
  text: string;
  value: string;
}

export interface Marker {
  position: Position;
  colorIndex: number;
  markerTypeIndex: number;
  values: Values;
}

export interface Position {
  lng: number;
  lat: number;
}

export interface Values {
  color: string;
  image: string;
}

export interface WorkAreas {
  areaInfo: AreaInfo[];
  workAreaData: WorkAreaData;
}

export interface AreaInfo {
  id: string;
  area: number;
  areaName: string;
  areaType: string;
}

export interface WorkAreaData {
  type: string;
  features: Feature[];
}

export interface Feature {
  id: string;
  type: string;
  properties: Properties;
  geometry: Geometry;
}

export interface Properties { }

export interface Geometry {
  coordinates: number[][][];
  type: string;
}
