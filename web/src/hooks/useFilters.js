// src/hooks/useFilters.js
import { useReducer, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

const initialState = (searchParams, initialSort) => ({
  search: searchParams.get("search") || "",
  sort: searchParams.get("sort") || initialSort || "",
  category: searchParams.get("category") || "all",
  page: Number(searchParams.get("page")) || 1,
});

function reducer(state, action) {
  switch (action.type) {
    case "SET_SEARCH":
      return { ...state, search: action.payload, page: 1 };
    case "SET_SORT":
      return { ...state, sort: action.payload, page: 1 };
    case "SET_CATEGORY":
      return { ...state, category: action.payload, page: 1 };
    case "SET_PAGE":
      return { ...state, page: action.payload };
    case "CLEAR_FILTERS":
      return { ...state, search: "", sort: "", category: "all", page: 1 };
    case "SYNC_FROM_URL": {
      const { search, sort, category, page } = action.payload;
      if (
        state.search === search &&
        state.sort === sort &&
        state.category === category &&
        state.page === page
      ) {
        return state;
      }
      return { ...state, ...action.payload };
    }
    default:
      return state;
  }
}

export function useFilters({ initialLimit = 12, initialSort = "" } = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isInternalUpdate = useRef(false);

  const [state, dispatch] = useReducer(
    reducer,
    { searchParams, initialSort },
    (initial) => initialState(initial.searchParams, initial.initialSort),
  );

  // Update URL when filter state changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (state.search) params.set("search", state.search);
    if (state.sort && state.sort !== "all") params.set("sort", state.sort);
    if (state.category && state.category !== "all") params.set("category", state.category);
    if (state.page > 1) params.set("page", state.page.toString());

    const newQueryString = params.toString();
    const currentQueryString = searchParams.toString();

    if (newQueryString !== currentQueryString) {
      isInternalUpdate.current = true;
      router.replace(`${pathname}?${newQueryString}`, { scroll: false });
    }
  }, [state, pathname, router, searchParams]);

  // Sync state when URL changes (e.g., browser back/forward)
  useEffect(() => {
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }

    const newState = {
      search: searchParams.get("search") || "",
      sort: searchParams.get("sort") || initialSort || "",
      category: searchParams.get("category") || "all",
      page: Number(searchParams.get("page")) || 1,
    };
    dispatch({ type: "SYNC_FROM_URL", payload: newState });
  }, [searchParams, initialSort]);

  // Stable action creators
  const setSearch = useCallback(
    (val) => dispatch({ type: "SET_SEARCH", payload: val }),
    [],
  );
  const setSort = useCallback(
    (val) => dispatch({ type: "SET_SORT", payload: val }),
    [],
  );
  const setCategory = useCallback(
    (val) => dispatch({ type: "SET_CATEGORY", payload: val }),
    [],
  );
  const setPage = useCallback(
    (val) => dispatch({ type: "SET_PAGE", payload: val }),
    [],
  );
  const clearFilters = useCallback(
    () => dispatch({ type: "CLEAR_FILTERS" }),
    [],
  );

  const queryParams = useMemo(() => {
    const p = {
      page: state.page,
      limit: initialLimit,
      search: state.search,
    };
    if (state.sort && state.sort !== "all") p.sort = state.sort;
    if (state.category && state.category !== "all") p.category = state.category;
    return p;
  }, [state.page, state.search, state.sort, state.category, initialLimit]);

  return {
    search: state.search,
    setSearch,
    sort: state.sort,
    setSort,
    category: state.category,
    setCategory,
    page: state.page,
    setPage,
    clearFilters,
    queryParams,
  };
}
