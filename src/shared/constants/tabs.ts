import { TabGroup, TabSide, type TabOption } from "../types/tabOption.type";

export const TABS: Record<TabGroup, TabOption[]> = {
  [TabGroup.PROFILE]: [
    { label: "Your's posts", value: false, side: TabSide.LEFT },
    { label: "Liked posts", value: true, side: TabSide.RIGHT },
  ],
  [TabGroup.USER]: [
    { label: "User posts", value: false, side: TabSide.LEFT },
    { label: "Liked posts", value: true, side: TabSide.RIGHT },
  ],
  [TabGroup.HOME]: [
    { label: "Newest", value: false, side: TabSide.LEFT },
    { label: "Top liked", value: true, side: TabSide.RIGHT },
  ],
};

