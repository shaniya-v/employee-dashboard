// src/App.jsx
import { supabase } from './supabaseClient'; // adjust path if needed
import React, { useState } from 'react';

export default function App() {
  const [showForm, setShowForm] = useState(false);
  const [employeeData, setEmployeeData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
  });
  const [employeeId, setEmployeeId] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [employees, setEmployees] = useState([]);

  React.useEffect(() => {
    fetchEmployees();
    generateNextId();
  }, []);

  const generateNextId = async () => {
    const { data, error } = await supabase
      .from('employees')
      .select('employee_id')
      .order('employee_id', { ascending: false })
      .limit(1);

    if (!error && data.length > 0) {
      const lastId = data[0].employee_id;
      const currentNum = parseInt(lastId.replace('EMP', '')) || 0;
      const nextId = `EMP${(currentNum + 1).toString().padStart(3, '0')}`;
      setEmployeeId(nextId);
    } else {
      setEmployeeId('EMP001');
    }
  };




  const fetchEmployees = async () => {
    const { data, error } = await supabase.from('employees').select('*').order('employee_id');
    if (error) {
      console.error('Error fetching employees:', error);
    } else {
      setEmployees(data);
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic form validation
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


    

    let data, error;
    if (isEditing) {
      ({ data, error } = await supabase
        .from('employees')
        .update(employeeData)
        .eq('employee_id', employeeId));
    } else {
      const newEmployee = {
        ...employeeData,
        employee_id: employeeId,
      };
      ({ data, error } = await supabase.from('employees').insert([newEmployee]));
    }


    if (error) {
      alert('❌ Failed to add employee: ' + error.message);
      return;
    }

    console.log('✅ Employee added to Supabase:', data);
    await fetchEmployees(); // Add this after insertion

    // Update employee ID
    // Generate next ID only if adding new
    if (!isEditing) {
      const currentId = parseInt(employeeId.replace('EMP', ''));
      const newId = `EMP${(currentId + 1).toString().padStart(3, '0')}`;
      setEmployeeId(newId);
    }


    // Reset form
    setEmployeeData({ name: '', email: '', phone: '', role: '' });
    setShowForm(false);
    setIsEditing(false);
    setShowSuccessPopup(true);
  };

  // Handle Editing an Employee
  const handleEdit = (employee) => {
    setEmployeeData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      role: employee.role,
    });
    setEmployeeId(employee.employee_id); // Keep the existing ID
    setIsEditing(true);
    setShowForm(true); // Open the form for editing
  };

  // Handle Deleting an Employee
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('⚠️ Are you sure you want to delete this employee?');
    if (!confirmDelete) return;

    const { error } = await supabase
      .from('employees')
      .delete()
      .eq('employee_id', id);

    if (error) {
      alert('❌ Failed to delete employee: ' + error.message);
    } else {
      alert('✅ Employee deleted successfully!');
      fetchEmployees(); // Refresh the list
    }
  };



  const handleReset = () => {
    setEmployeeData({ name: '', email: '', phone: '', role: '' });
  };

  const closeSuccessPopup = () => setShowSuccessPopup(false);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-4 font-poppins relative overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center pb-4 border-b shadow-sm">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Employee Dashboard</h1>
          <p className="text-sm text-gray-500">Company HR Portal</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
          HR
        </div>
      </header>

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

            {/* Steps */}
            <div className="flex justify-around mb-8">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex flex-col items-center">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg font-bold shadow-md">{step}</div>
                </div>
              ))}
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

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl text-center space-y-4">
            <h2 className="text-2xl font-bold text-green-600">Employee Added Successfully!</h2>
            <p className="text-gray-700">You can now send a welcome email.</p>
            <button
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-xl hover:scale-105 transition"
              onClick={async () => {
                try {
                  const response = await fetch('https://shaniya.app.n8n.cloud/webhook/employee-added', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      name: employeeData.name,
                      email: employeeData.email,
                    }),
                  });

                  if (!response.ok) {
                    throw new Error('Email API failed');
                  }

                  alert(`✅ Email sent to ${employeeData.email}`);
                } catch (err) {
                  console.error(err);
                  alert('❌ Failed to send email. Please check the webhook or server.');
                } finally {
                  closeSuccessPopup();
                }
              }}

            >
              Send Mail
            </button>
            <button
              onClick={closeSuccessPopup}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">📋 Employee List</h2>

        {employees.length === 0 ? (
          <p className="text-center text-gray-500">No employees found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-xl overflow-hidden border border-gray-200">
             <thead className="bg-gradient-to-r from-blue-100 to-purple-100">
                <tr>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">Edit</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-700">ID</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-700">Name</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-700">Email</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-700">Phone</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-700">Role</th>
                  <th className="px-4 py-3 text-sm font-semibold text-gray-700">Delete</th>
                </tr>
              </thead>

              <tbody>
              {employees.map((emp) => (
                <tr key={emp.employee_id} className="hover:bg-gray-50">
                  {/* Edit Icon on left */}
                  <td className="px-4 py-4 text-sm text-blue-500 cursor-pointer" onClick={() => handleEdit(emp)}>
                    ✏️
                  </td>
                  
                  <td className="px-6 py-4 text-sm text-gray-800">{emp.employee_id}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{emp.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{emp.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{emp.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-800">{emp.role}</td>
                  
                  {/* Delete Icon on right */}
                  <td className="px-4 py-4 text-sm text-red-500 cursor-pointer" onClick={() => handleDelete(emp.employee_id)}>
                    🗑️
                  </td>
                </tr>
              ))}
            </tbody>

            </table>
          </div>
        )}
      </div>
    </div>
  );
}
