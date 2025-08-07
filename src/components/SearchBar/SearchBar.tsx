import { Search, X } from "lucide-react";
import type React from "react";
import { Input } from "../ui/input";

interface Props {
  query: string;
  setQuery: (value: string) => void;
}

export const SearchBar: React.FC<Props> = ({ query, setQuery }) => {
  return (
    <div className="flex flex-col w-160 bg-white rounded-xl p-6 shadow-md">
      <div>
        <p>Search users</p>
        <div className="relative w-full">
          <Input
            placeholder="Search users..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="pr-7"
          />
          {!query && (
            <Search className="w-4 h-4 absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
          )}
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
