import api from './api';

// --- Types ---
export interface Department {
  id?: number;
  name: string;
  slug: string;
  description?: string;
}

export interface Course {
  id?: number;
  title: string;
  slug: string;
  description?: string;
  type: 'BASIC' | 'JOB';
  departmentId: number;
}


export interface RoadmapNodeInput {
  nodeKey: string;
  title: string;
  coords: { x: number; y: number };
  isRequired?: boolean; // Optional, based on your previous DB schema
}

export interface RoadmapEdgeInput {
  sourceKey: string;
  targetKey: string;
}

export interface Roadmap {
  id?: number;
  slug: string;
  title: string;
  description?: string;
  courseId: number;
  nodes: RoadmapNodeInput[];
  edges: RoadmapEdgeInput[];
}



export const adminService = {
  // ==========================================
  // 📂 DEPARTMENTS
  // ==========================================
  getAllDepartments: async () => {
    // 💡 FIX: Cast the result so TypeScript knows it's an Array, not an AxiosResponse
    const data = await api.get<Department[]>('/admin/departments');
    return data as unknown as Department[];
  },

  getDepartmentBySlug: async (slug: string) => {
    const data = await api.get<Department>(`/admin/departments/${slug}`);
    return data as unknown as Department;
  },

  createDepartment: async (payload: Department) => {
    const data = await api.post<Department>('/admin/departments', payload);
    return data as unknown as Department;
  },

  updateDepartment: async (id: number, payload: Partial<Department>) => {
    const data = await api.patch<Department>(`/admin/departments/${id}`, payload);
    return data as unknown as Department;
  },

  deleteDepartment: async (id: number) => {
    const data = await api.delete(`/admin/departments/${id}`);
    return data as unknown as any;
  },

  // ==========================================
  // 📚 COURSES
  // ==========================================
  getAllCourses: async () => {
    const data = await api.get<Course[]>('/admin/courses');
    return data as unknown as Course[];
  },

  getCourseBySlug: async (slug: string) => {
    const data = await api.get<Course>(`/admin/courses/${slug}`);
    return data as unknown as Course;
  },

  createCourse: async (payload: Course) => {
    const data = await api.post<Course>('/admin/courses', payload);
    return data as unknown as Course;
  },

  updateCourse: async (id: number, payload: Partial<Course>) => {
    const data = await api.patch<Course>(`/admin/courses/${id}`, payload);
    return data as unknown as Course;
  },

  deleteCourse: async (id: number) => {
    const data = await api.delete(`/admin/courses/${id}`);
    return data as unknown as any;
  },

  // ==========================================
  // 🗺️ ROADMAPS
  // ==========================================
  getAllRoadmaps: async () => {
    const data = await api.get<Roadmap[]>('/admin/roadmaps');
    return data as unknown as Roadmap[];
  },

  getRoadmapBySlug: async (slug: string) => {
    const data = await api.get<Roadmap>(`/admin/roadmaps/${slug}`);
    return data as unknown as Roadmap;
  },

  // ✅ CREATE: Matches your requested body structure
  createRoadmap: async (payload: Roadmap) => {
    const data = await api.post<Roadmap>('/admin/roadmaps', payload);
    return data as unknown as Roadmap;
  },

  // ✅ UPDATE: Matches your requested body structure
  updateRoadmap: async (id: number, payload: Partial<Roadmap>) => {
    const data = await api.patch<Roadmap>(`/admin/roadmaps/${id}`, payload);
    return data as unknown as Roadmap;
  },

  deleteRoadmap: async (id: number) => {
    const data = await api.delete(`/admin/roadmaps/${id}`);
    return data as unknown as any;
  },

};