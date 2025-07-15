import React, { useEffect, useState } from 'react';
import { getEmployees, addEmployee, deleteEmployee, updateEmployee, generateNextId } from '../services/employeeService';
import SuccessPopup from '../components/SuccessPopup';
import EmployeeTable from '../components/EmployeeTable';
import Header from '../components/Header';

export default function Dashboard() {
  const [showForm, setShowForm] = useState(false);
  const [employeeData, setEmployeeData] = useState({ name: '', email: '', phone: '', role: '' });
  const [employeeId, setEmployeeId] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchEmployees();
    generateId();
  }, []);

  const generateId = async () => {
    const id = await generateNextId();
    setEmployeeId(id);
  };

  const fetchEmployees = async () => {
    const { data, error } = await getEmployees();
    if (!error) setEmployees(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!nameRegex.test(employeeData.name)) {
      alert('❌ Enter a valid name (letters and spaces only).');
      return;
    }

    if (!emailRegex.test(employeeData.email)) {
      alert('❌ Enter a valid email address.');
      return;
    }

    if (!phoneRegex.test(employeeData.phone)) {
      alert('❌ Enter a valid 10-digit phone number.');
      return;
    }

    if (!employeeData.role) {
      alert('❌ Please select a role.');
      return;
    }

    const dataToSend = { ...employeeData, employee_id: employeeId };
    const { error } = isEditing
      ? await updateEmployee(employeeId, employeeData)
      : await addEmployee(dataToSend);

    if (error) {
      alert('❌ Operation failed: ' + error.message);
      return;
    }

    await fetchEmployees();
    if (!isEditing) generateId();

    setEmployeeData({ name: '', email: '', phone: '', role: '' });
    setShowForm(false);
    setIsEditing(false);
    setShowSuccessPopup(true);
  };

  const handleEdit = (emp) => {
    setEmployeeData({
      name: emp.name,
      email: emp.email,
      phone: emp.phone,
      role: emp.role,
    });
    setEmployeeId(emp.employee_id);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('⚠️ Are you sure you want to delete this employee?');
    if (!confirmDelete) return;
    const { error } = await deleteEmployee(id);
    if (!error) fetchEmployees();
  };

  const handleReset = () => {
    setEmployeeData({ name: '', email: '', phone: '', role: '' });
  };

  const closePopup = () => setShowSuccessPopup(false);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-4 font-poppins relative overflow-hidden">
      <Header />

      {/* Glowing Icon Box */}
      <div className="flex justify-center mt-10">
        <div className="w-full max-w-2xl bg-white rounded-full p-10 shadow-xl shadow-purple-400 flex justify-center relative">
          <div className="absolute inset-0 rounded-full bg-purple-500 blur-2xl opacity-30"></div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-blue-600 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m0-4a4 4 0 118 0 4 4 0 01-8 0z" />
          </svg>
        </div>
      </div>

      {/* Management Title */}
      <div className="text-center mt-6">
        <h2 className="text-2xl font-bold text-gray-900">Employee Management</h2>
        <p className="text-md text-gray-600 mt-2">Add new employees to your organization. Manage them with ease and security.</p>
      </div>

      {/* Employee Count Box */}
      <div className="flex justify-center mt-10">
        <div className="bg-blue-100/60 text-blue-700 p-8 rounded-2xl shadow-md w-72 text-center backdrop-blur-sm">
          <div className="text-5xl font-bold">{employees.length}</div>
          <div className="text-xl font-semibold mt-2">Employees</div>
          <div className="text-sm text-blue-500">Total active staff</div>
        </div>
      </div>

      {/* Add Employee Button */}
      <div className="flex justify-center mt-10">
        <button
          onClick={() => setShowForm(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl shadow-lg font-semibold text-lg hover:scale-105 transform transition-all"
        >
          + Add New Employee
        </button>
      </div>

      {/* Tags */}
      <div className="flex justify-center gap-4 mt-8">
        <span className="bg-white px-5 py-2 rounded-full shadow text-sm flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-green-500"></span>
          Ready to add employee
        </span>
        <span className="bg-white px-5 py-2 rounded-full shadow text-sm flex items-center gap-2">
          ⚡ Fast & Secure
        </span>
      </div>

      {/* Employee Form Popup */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-[28px] p-10 shadow-2xl w-[90%] max-w-2xl relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:scale-105"
            >✕</button>

            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-purple-800">Employee Registration</h3>
              <p className="text-sm text-gray-600">Complete all fields to add an employee</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <input name="name" type="text" placeholder="Full Name" value={employeeData.name} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white shadow-inner border border-purple-300 focus:ring-2 focus:ring-purple-500 focus:outline-none hover:shadow-lg transition" />
              <input name="email" type="email" placeholder="Email ID" value={employeeData.email} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white shadow-inner border border-purple-300 focus:ring-2 focus:ring-purple-500 focus:outline-none hover:shadow-lg transition" />
              <input name="phone" type="tel" placeholder="Phone Number" value={employeeData.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white shadow-inner border border-purple-300 focus:ring-2 focus:ring-purple-500 focus:outline-none hover:shadow-lg transition" />
              <select name="role" value={employeeData.role} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-white shadow-inner border border-purple-300 focus:ring-2 focus:ring-purple-500 focus:outline-none hover:shadow-lg transition">
                <option value="">Select Role</option>
                <option value="Developer">Developer</option>
                <option value="Manager">Manager</option>
                <option value="Intern">Intern</option>
              </select>
              <div className="bg-white px-4 py-3 rounded-xl shadow-inner border border-purple-300 text-right">
                <span className="text-sm text-gray-500 mr-2">Generated ID</span>
                <span className="text-lg font-bold text-purple-700">{employeeId}</span>
              </div>
              <div className="flex justify-between pt-4">
                <button type="button" onClick={handleReset} className="bg-white border border-purple-500 text-purple-600 px-6 py-2 rounded-xl hover:bg-purple-100 transition">Reset Form</button>
                <button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-xl hover:scale-105 transition">
                  {isEditing ? 'Update Employee' : 'Add Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSuccessPopup && <SuccessPopup email={employeeData.email} onClose={closePopup} />}
      <EmployeeTable employees={employees} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
}
