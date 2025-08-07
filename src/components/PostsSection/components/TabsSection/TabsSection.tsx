import { TabSide, type TabOption } from "@/shared/types/tabOption.type";
import type React from "react";

interface Props {
  tabOptions: TabOption[];
  showOnlyLiked: boolean;
  setShowOnlyLiked: (value: boolean) => void;
}

export const TabsSection: React.FC<Props> = ({
  tabOptions,
  showOnlyLiked,
  setShowOnlyLiked,
}) => {
  return (
    <div className="flex bg-gray-100 rounded-md p-1 w-full text-sm font-medium">
      {tabOptions.map((tabOption) => (
        <div
          key={tabOption.label}
          onClick={() => setShowOnlyLiked(tabOption.value)}
          className={`w-1/2 py-2 px-4 cursor-pointer transition-all duration-200 ${
            showOnlyLiked === tabOption.value
              ? "bg-white text-black shadow"
              : "text-gray-500"
          } ${
            tabOption.side === TabSide.LEFT ? "rounded-l-md" : "rounded-r-md"
          }`}
        >
          {tabOption.label}
        </div>
      ))}
    </div>
  );
};
