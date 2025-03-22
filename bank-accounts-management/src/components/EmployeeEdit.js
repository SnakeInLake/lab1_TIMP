import React, { useState, useEffect } from 'react';

function EmployeeEdit({ employee, onEmployeeUpdated, closeModal }) {
    const [name, setName] = useState('');
    const [position, setPosition] = useState('');
    const [details, setDetails] = useState(''); 
    const [errors, setErrors] = useState({});


    useEffect(() => {
        if (employee) {
            setName(employee.name);
            setPosition(employee.position);
            setDetails(employee.details);
        }
    }, [employee]);


    const handleSubmit = async (event) => {
        event.preventDefault();

        const validationErrors = {};
        if (!name.trim()) {
            validationErrors.name = 'Name is required';
        }
        if (!position.trim()) {
            validationErrors.position = 'Position is required';
        }

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
         setErrors({})

        try {
            const response = await fetch(`http://localhost:5000/api/employees/${employee.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, position, details }), 
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update employee');
            }

            const updatedEmployee = await response.json();
            onEmployeeUpdated(updatedEmployee);
        } catch (error) {
            console.error('Error updating employee:', error);
            setErrors({ submit: error.message });
        }
    };

    return (
        <div>
            <h2>Edit Employee</h2>
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

                <button type="submit" className='button button-edit'>Изменить</button>
                <button type='button' onClick={closeModal} className='button button-delete'>Отмена</button>
            </form>
        </div>
    );
}

export default EmployeeEdit;