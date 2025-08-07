"use client";

import { SearchBar } from "@/components/SearchBar";
import { UserCardArea } from "@/components/UserCardArea";
import { useState } from "react";
import { useDebounce } from "use-debounce";

export default function Users() {
  const [query, setQuery] = useState<string>("");
  const [debouncedQuery] = useDebounce(query, 500);

  return (
    <div className="mt-16 flex flex-col justify-center items-center gap-y-10">
      <SearchBar query={query} setQuery={setQuery} />

      <UserCardArea debouncedQuery={debouncedQuery} />
    </div>
  );
}
