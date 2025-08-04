import { TabSide, type TabOption } from "@/shared/types/tabOption.type";
import type React from "react";

interface Props {
  mode: boolean;
  tabOptions: TabOption[];
  onChangeMode: (value: boolean) => void;
}

export const TabsSection: React.FC<Props> = ({
  mode,
  tabOptions,
  onChangeMode,
}) => {
  return (
    <div className="flex bg-gray-100 rounded-md p-1 w-full text-sm font-medium">
      {tabOptions.map((tabOption) => (
        <div
          key={tabOption.label}
          onClick={() => onChangeMode(tabOption.value)}
          className={`w-1/2 py-2 px-4 cursor-pointer transition-all duration-200 ${
            mode === tabOption.value
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
