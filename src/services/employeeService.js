import { supabase } from './supabaseClient';

export const getEmployees = async () => await supabase.from('employees').select('*').order('employee_id');

export const addEmployee = async (employee) => await supabase.from('employees').insert([employee]);

export const updateEmployee = async (id, employee) => await supabase.from('employees').update(employee).eq('employee_id', id);

export const deleteEmployee = async (id) => await supabase.from('employees').delete().eq('employee_id', id);

export const generateNextId = async () => {
  const { data, error } = await supabase
    .from('employees')
    .select('employee_id')
    .order('employee_id', { ascending: false })
    .limit(1);

  if (!error && data.length > 0) {
    const current = parseInt(data[0].employee_id.replace('EMP', '')) || 0;
    return `EMP${(current + 1).toString().padStart(3, '0')}`;
  }
  return 'EMP001';
};
