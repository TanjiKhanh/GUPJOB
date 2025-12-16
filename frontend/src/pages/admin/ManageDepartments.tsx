import React, { useState, useEffect } from 'react';
import { adminService, Department } from '../../services/admin.service';
import Header from '../../components/layouts/Header';
import { Form, Input, TextArea, SubmitButton } from '../../components/ui/Forms';
import { useForm } from '../../hooks/useForm';

export default function ManageDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // 🆕 Track Edit Mode
  const [editingId, setEditingId] = useState<number | null>(null);

  // 1. Initialize Form Hook (Get 'setValues' to populate form manually)
  const { values, handleChange, resetForm, setValues } = useForm({
    name: '',
    slug: '',
    description: ''
  });

  // 2. Fetch Data
  const loadDepartments = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllDepartments();
      setDepartments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load departments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  // 🆕 Handle "Edit" Click
  const handleEditClick = (dept: Department) => {
    setEditingId(dept.id!);
    setValues({
      name: dept.name,
      slug: dept.slug,
      description: dept.description || ''
    });
    // Scroll up to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 🆕 Handle "Cancel" Click
  const handleCancelEdit = () => {
    setEditingId(null);
    resetForm();
  };

  // 3. Handle Submit (Create OR Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        // UPDATE
        await adminService.updateDepartment(editingId, values);
        alert('✅ Department updated successfully!');
      } else {
        // CREATE
        await adminService.createDepartment(values);
        alert('✅ Department created successfully!');
      }
      
      handleCancelEdit(); // Reset form and mode
      loadDepartments(); // Refresh list
    } catch (err: any) {
      alert(`❌ Error: ${err.response?.data?.message || err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  // 4. Handle Delete
  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure? This might break courses linked to this department.")) return;
    try {
      await adminService.deleteDepartment(id);
      loadDepartments();
      // If deleting the item currently being edited, cancel edit mode
      if (editingId === id) handleCancelEdit();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Header 
        title="Manage Departments 📂" 
        subtitle="Create and configure your learning domains"
      />

      <div className="admin-content-area">
        <div className="admin-grid">
          
          {/* --- FORM SECTION --- */}
          <div className="card">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px'}}>
              <h3>{editingId ? 'Edit Department' : 'Add New Department'}</h3>
              
              {/* 🆕 Cancel Button */}
              {editingId && (
                <button 
                  type="button" 
                  onClick={handleCancelEdit}
                  style={{background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.9rem'}}
                >
                  Cancel ✕
                </button>
              )}
            </div>

            <Form onSubmit={handleSubmit}>
              <Input 
                label="Department Name"
                name="name"
                value={values.name}
                onChange={handleChange}
                placeholder="e.g. Computer Science"
                required
              />

              <Input 
                label="Slug"
                name="slug"
                value={values.slug}
                onChange={handleChange}
                placeholder="e.g. computer-science"
                required
              />

              <TextArea 
                label="Description"
                name="description"
                value={values.description}
                onChange={handleChange}
                placeholder="Short description..."
              />

              <SubmitButton isLoading={submitting}>
                {editingId ? 'Update Department' : '+ Create Department'}
              </SubmitButton>
            </Form>
          </div>

          {/* --- LIST TABLE --- */}
          <div className="card">
            <h3>Existing Departments</h3>
            {loading ? <p>Loading...</p> : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Slug</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map(dept => (
                    <tr key={dept.id} style={{background: editingId === dept.id ? '#f0f9ff' : 'transparent'}}>
                      <td>#{dept.id}</td>
                      <td><strong>{dept.name}</strong></td>
                      <td><code>{dept.slug}</code></td>
                      <td>
                        <div style={{display: 'flex', gap: '8px'}}>
                          {/* 🆕 Edit Button */}
                          <button 
                            className="btn-icon"
                            onClick={() => handleEditClick(dept)}
                            title="Edit"
                            style={{
                              background: '#e0e7ff', color: '#4338ca', border: 'none', 
                              borderRadius: '6px', width: '32px', height: '32px', cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}
                          >
                            ✏️
                          </button>

                          <button 
                            className="btn-danger-sm" 
                            onClick={() => handleDelete(dept.id!)}
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {departments.length === 0 && (
                    <tr><td colSpan={4}>No departments found.</td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

        </div>
      </div>
    </>
  );
}