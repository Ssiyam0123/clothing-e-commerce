'use client';

import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export default function PrefetchLink({ href, children, queryKey, queryFn, ...props }) {
  const queryClient = useQueryClient();

  const prefetch = async () => {
    if (queryKey) {
      await queryClient.prefetchQuery({
        queryKey,
        queryFn: queryFn || (() => api.get(href).then(res => res.data)),
        staleTime: 1000 * 60 * 5,
      });
    }
  };

  return (
    <Link href={href} onMouseEnter={prefetch} onFocus={prefetch} {...props}>
      {children}
    </Link>
  );
}
