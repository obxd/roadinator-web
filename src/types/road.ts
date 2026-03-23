export interface RoadComponent {
  type: string;
  bgcolor: string;
  size: string;
  tier: string;
}

export interface RoadData {
  type: string;
  tier: string;
  components: RoadComponent[];
}

export interface Road {
  name: string;
  data: RoadData;
}

export interface FilteredRoad extends Road {
  matches: number[];
}
