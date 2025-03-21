export interface SDGITEM {
  collectionId: string;
  collectionName: string;
  created: string;
  id: string;
  sort_desc: string;
  image: string;
  main_color: string;
  name: string;
  parameters: string[];
  sub_color: string;
  updated: string;
}

export interface ProjectSDG {
  collectionId: string;
  collectionName: string;
  created: string;
  data: Daum[];
  description: string;
  id: string;
  sdg: string;
  name: string;
  updated: string;
}

export interface Daum {
  name: string;
  value: string;
}
