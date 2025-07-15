import React from 'react';

export default function EmployeeTable({ employees, onEdit, onDelete }) {
  if (!employees.length) return <p className="mt-4 text-center">No employees found.</p>;

  return (
    <table className="w-full mt-6 border rounded-xl overflow-hidden shadow-sm">
      <thead className="bg-blue-100">
        <tr>
          <th>Edit</th>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Role</th>
          <th>Delete</th>
        </tr>
      </thead>
      <tbody>
        {employees.map((emp) => (
          <tr key={emp.employee_id}>
            <td className="text-blue-500 cursor-pointer" onClick={() => onEdit(emp)}>✏️</td>
            <td>{emp.employee_id}</td>
            <td>{emp.name}</td>
            <td>{emp.email}</td>
            <td>{emp.phone}</td>
            <td>{emp.role}</td>
            <td className="text-red-500 cursor-pointer" onClick={() => onDelete(emp.employee_id)}>🗑️</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
