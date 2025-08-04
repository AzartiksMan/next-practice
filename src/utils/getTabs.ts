import { TABS } from "@/shared/constants/tabs";
import type { TabGroup, TabOption } from "@/shared/types/tabOption.type";

export const getTabs = (group: TabGroup): TabOption[] => {
  return TABS[group];
};
