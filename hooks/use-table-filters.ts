import { periodOptions } from "@/lib/corearrays";
import { DEFAULT_TABLE_LIMIT, DEFAULT_TABLE_OFFSET } from "@/lib/coreconstants";
import { SortType } from "@/lib/types";
import { dateFormatter } from "@/lib/utils";
import { useState } from "react";
import { useDebounce } from "./use-debounce";

export const useTableFilters = () => {
  const [from, setFrom] = useState(periodOptions[0].value);
  const [to, setTo] = useState(dateFormatter(new Date(), "yyyy-MM-dd"));
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortType>("desc");
  const [limit, setLimit] = useState(DEFAULT_TABLE_LIMIT);
  const [offset, setOffset] = useState(DEFAULT_TABLE_OFFSET);

  const handleFromChange = (value: string) => {
    setFrom(value);
    setOffset(0);
  };

  const handleToChange = (value: string) => {
    setTo(value);
    setOffset(0);
  };

  const onSortChange = (value: SortType) => {
    setSort(value);
    setOffset(0);
  };

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setOffset(0);
  };

  const debouncedQuery = useDebounce(query);

  return {
    from,
    setFrom,
    handleFromChange,
    to,
    setTo,
    handleToChange,
    query,
    setQuery,
    debouncedQuery,
    sort,
    setSort,
    limit,
    setLimit,
    offset,
    setOffset,
    onSortChange,
    handleQueryChange,
  };
};
