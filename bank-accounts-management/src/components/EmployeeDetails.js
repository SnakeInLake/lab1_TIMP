import React from 'react';

function EmployeeDetails({ employee, closeModal }) {
  if (!employee) {
    return <div>No employee selected.</div>;
  }

  return (
    <div>
      <h2>Детали</h2>
      <p><strong>ID:</strong> {employee.id}</p>
      <p><strong>Имя:</strong> {employee.name}</p>
      <p><strong>Должность:</strong> {employee.position}</p>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <p><strong>Детали:</strong> <span style={{ whiteSpace: 'pre-line' }}>{employee.details}</span></p>
      </div>
      <button onClick={closeModal} className='button button-delete'>Закрыть</button>
    </div>
  );
}

export default EmployeeDetails;