export enum TabSide {
  LEFT = "left",
  RIGHT = "right",
}

export interface TabOption {
  label: string;
  value: boolean;
  side: TabSide;
}

export enum TabGroup {
  PROFILE = "profile",
  USER = "user",
  HOME = "home",
}
