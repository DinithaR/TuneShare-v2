
import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { axios, token } = useAppContext();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);


  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/user/all');
      if (data.success) {
        setUsers(data.users);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  // Change user role
  const handleChangeRole = async (userId, newRole) => {
    try {
      const { data } = await axios.post('/api/user/change-role', { userId, role: newRole });
      if (data.success) {
        toast.success('Role updated');
        fetchUsers();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to change role');
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const { data } = await axios.delete(`/api/user/delete/${userId}`);
      if (data.success) {
        toast.success('User deleted');
        fetchUsers();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  // Edit user details
  const [editUserId, setEditUserId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', image: '' });

  const openEdit = (user) => {
    setEditUserId(user._id);
    setEditForm({ name: user.name, email: user.email, image: user.image || '' });
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put('/api/user/edit', { userId: editUserId, ...editForm });
      if (data.success) {
        toast.success('User updated');
        setEditUserId(null);
        fetchUsers();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  const handleEditCancel = () => {
    setEditUserId(null);
    setEditForm({ name: '', email: '', image: '' });
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="px-6 md:px-16 lg:px-32 2xl:px-48 mt-16 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <h2 className="text-lg font-semibold mb-4">All Users</h2>
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Email</th>
                <th className="py-2 px-4 border-b">Role</th>
                <th className="py-2 px-4 border-b">Created</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">
                    {editUserId === user._id ? (
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 w-28"
                      />
                    ) : (
                      user.name
                    )}
                  </td>
                  <td className="py-2 px-4">
                    {editUserId === user._id ? (
                      <input
                        type="email"
                        name="email"
                        value={editForm.email}
                        onChange={handleEditChange}
                        className="border rounded px-2 py-1 w-40"
                      />
                    ) : (
                      user.email
                    )}
                  </td>
                  <td className="py-2 px-4 capitalize">
                    {editUserId === user._id ? (
                      <select
                        name="role"
                        value={editForm.role || user.role}
                        onChange={e => handleChangeRole(user._id, e.target.value)}
                        className="border rounded px-2 py-1"
                      >
                        <option value="user">User</option>
                        <option value="owner">Owner</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <>
                        {user.role}
                        <select
                          className="ml-2 border rounded px-1 py-0.5 text-xs"
                          value={user.role}
                          onChange={e => handleChangeRole(user._id, e.target.value)}
                        >
                          <option value="user">User</option>
                          <option value="owner">Owner</option>
                          <option value="admin">Admin</option>
                        </select>
                      </>
                    )}
                  </td>
                  <td className="py-2 px-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="py-2 px-4 flex gap-2">
                    {editUserId === user._id ? (
                      <>
                        <button
                          onClick={handleEditSubmit}
                          className="px-2 py-1 bg-green-500 text-white rounded text-xs"
                        >Save</button>
                        <button
                          onClick={handleEditCancel}
                          className="px-2 py-1 bg-gray-400 text-white rounded text-xs"
                        >Cancel</button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => openEdit(user)}
                          className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
                        >Edit</button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                        >Delete</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
