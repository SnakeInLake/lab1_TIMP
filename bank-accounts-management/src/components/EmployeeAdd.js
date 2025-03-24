import React, { useState } from 'react';

function EmployeeAdd({ onEmployeeAdded, closeModal }) {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [details, setDetails] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = {};
    if (!name.trim()) {
      validationErrors.name = 'Имя обязательно для добавления';
    }
    if (!position.trim()) {
      validationErrors.position = 'Должность обязательна для добавления';
    }
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({})

    try {
      const response = await fetch('http://localhost:5000/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, position, details }), 
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add employee');
      }
      const newEmployee = await response.json();
      onEmployeeAdded(newEmployee);

    } catch (error) {
      console.error('Error adding employee:', error);
      setErrors({ submit: error.message });
    }
  };

  return (
    <div>
      <h2>Добавить сотрудника</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Имя:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <div className="error">{errors.name}</div>}
        </div>
        <div>
          <label htmlFor="position">Должность:</label>
          <input
            type="text"
            id="position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
           {errors.position && <div className="error">{errors.position}</div>}
        </div>
        <div>
          <label htmlFor="details">Детали:</label>
          <textarea
            id="details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows="5" 
            style={{ width: '100%', resize: 'vertical' }}
          />
        </div>
        {errors.submit && <div className="error">{errors.submit}</div>}
        <button type="submit" className='button button-add'>Добавить</button>
        <button type='button' className='button button-delete' onClick={closeModal}>Отмена</button>
      </form>
    </div>
  );
}

export default EmployeeAdd;