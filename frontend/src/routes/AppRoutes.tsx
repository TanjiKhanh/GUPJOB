import api from '../api/axios'; // Import your custom axios instance

export const adminService = {
  // Departments
  getDepartments: async () => {
    const res = await api.get('/admin/departments');
    return res.data;
  },
  createDepartment: async (data: any) => {
    const res = await api.post('/admin/departments', data);
    return res.data;
  },
  deleteDepartment: async (id: number) => {
    const res = await api.delete(`/admin/departments/${id}`);
    return res.data;
  },

  // Courses
  getCourses: async () => {
    const res = await api.get('/admin/courses');
    return res.data;
  },
  
  // Master Roadmaps
  getRoadmaps: async () => {
    const res = await api.get('/admin/roadmaps');
    return res.data;
  }
};