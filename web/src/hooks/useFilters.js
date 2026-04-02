// src/hooks/useFilters.js
import { useReducer, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

const initialState = (searchParams, initialSort) => ({
  search: searchParams.get('search') || '',
  sort: searchParams.get('sort') || initialSort,
  category: searchParams.get('category') || 'all',
  page: Number(searchParams.get('page')) || 1,
});

function reducer(state, action) {
  switch (action.type) {
    case 'SET_SEARCH':
      return { ...state, search: action.payload, page: 1 };
    case 'SET_SORT':
      return { ...state, sort: action.payload, page: 1 };
    case 'SET_CATEGORY':
      return { ...state, category: action.payload, page: 1 };
    case 'SET_PAGE':
      return { ...state, page: action.payload };
    case 'CLEAR_FILTERS':
      return { ...state, search: '', sort: '', category: 'all', page: 1 };
    case 'SYNC_FROM_URL':
      return {
        ...state,
        search: action.payload.search,
        sort: action.payload.sort,
        category: action.payload.category,
        page: action.payload.page,
      };
    default:
      return state;
  }
}

export function useFilters({ initialLimit = 12, initialSort = '' } = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [state, dispatch] = useReducer(
    reducer,
    { searchParams, initialSort },
    (initial) => initialState(initial.searchParams, initial.initialSort)
  );

  // Update URL when filter state changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (state.search) params.set('search', state.search);
    if (state.sort) params.set('sort', state.sort);
    if (state.category !== 'all') params.set('category', state.category);
    if (state.page > 1) params.set('page', state.page);

    const newQueryString = params.toString();
    router.replace(`${pathname}?${newQueryString}`, { scroll: false });
  }, [state.search, state.sort, state.category, state.page, pathname, router]);

  // Sync state when URL changes (e.g., browser back/forward)
  useEffect(() => {
    const newState = {
      search: searchParams.get('search') || '',
      sort: searchParams.get('sort') || initialSort,
      category: searchParams.get('category') || 'all',
      page: Number(searchParams.get('page')) || 1,
    };
    dispatch({ type: 'SYNC_FROM_URL', payload: newState });
  }, [searchParams, initialSort]);

  // Stable action creators
  const setSearch = useCallback((val) => dispatch({ type: 'SET_SEARCH', payload: val }), []);
  const setSort = useCallback((val) => dispatch({ type: 'SET_SORT', payload: val }), []);
  const setCategory = useCallback((val) => dispatch({ type: 'SET_CATEGORY', payload: val }), []);
  const setPage = useCallback((val) => dispatch({ type: 'SET_PAGE', payload: val }), []);
  const clearFilters = useCallback(() => dispatch({ type: 'CLEAR_FILTERS' }), []);

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
    queryParams: {
      page: state.page,
      limit: initialLimit,
      search: state.search,
      sort: state.sort,
      ...(state.category !== 'all' && { category: state.category }),
    },
  };
}