// src/hooks/useBlogs.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { swalToast, swalError } from '@/utils/swal';

export const useBlogs = (id = null) => {
  const queryClient = useQueryClient();

  // Fetch all blogs (public or admin)
  const { data: blogs, isLoading: blogsLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => (await api.get('/blogs')).data,
  });

  // Fetch single blog by slug (public)
  const { data: blog, isLoading: blogLoading } = useQuery({
    queryKey: ['blog', id],
    queryFn: async () => (await api.get(`/blogs/${id}`)).data,
    enabled: !!id,
  });

  // Create blog (admin only)
  const createBlog = useMutation({
    mutationFn: async (formData) => {
      const { data } = await api.post('/blogs', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      swalToast('Blog published successfully!', 'success');
    },
    onError: (err) => {
      swalError('Creation failed', err.response?.data?.message);
    },
  });

  // Update blog (admin only)
  const updateBlog = useMutation({
    mutationFn: async ({ id, formData }) => {
      const { data } = await api.put(`/blogs/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      queryClient.invalidateQueries({ queryKey: ['blog', id] });
      swalToast('Blog updated successfully!', 'success');
    },
    onError: (err) => {
      swalError('Update failed', err.response?.data?.message);
    },
  });

  // Delete blog (admin only)
  const deleteBlog = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/blogs/${id}`);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      swalToast('Blog deleted permanently.', 'success');
    },
    onError: (err) => {
      swalError('Deletion failed', err.response?.data?.message);
    },
  });

  return {
    blogs,
    blog,
    blogsLoading,
    blogLoading,
    createBlog,
    updateBlog,
    deleteBlog,
  };
};