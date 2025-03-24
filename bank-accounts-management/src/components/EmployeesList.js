import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import EmployeeAdd from './EmployeeAdd';
import EmployeeEdit from './EmployeeEdit';
import EmployeeDetails from './EmployeeDetails'; 


// Стили для модального окна 
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '500px', 
  },
};

Modal.setAppElement('#root'); 

function EmployeesList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false); 
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [sortBy, setSortBy] = useState(null); 
  const [sortOrder, setSortOrder] = useState('asc'); 


  useEffect(() => {
    let url = 'http://localhost:5000/api/employees';

   if (sortBy) {
     url += `?sort=${sortBy}&order=${sortOrder}`;
   }

    console.log("Sorting by:", sortBy, "Order:", sortOrder);
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setEmployees(data);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, [sortBy, sortOrder]); 

    const openAddModal = () => {
        setIsAddModalOpen(true);
    };

    const closeAddModal = () => {
        setIsAddModalOpen(false);
    };

    const openEditModal = (employee) => {
        setSelectedEmployee(employee);
        setIsEditModalOpen(true);
    }

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedEmployee(null); 
    }

    const openDetailsModal = (employee) => {
        setSelectedEmployee(employee);
        setIsDetailsModalOpen(true);
    }

    const closeDetailsModal = () => {
        setIsDetailsModalOpen(false);
        setSelectedEmployee(null);
    }

      const handleEmployeeAdded = (newEmployee) => {
        setEmployees([...employees, newEmployee]);
        closeAddModal();
    };

     const handleEmployeeUpdated = (updatedEmployee) => {
        setEmployees(employees.map(emp => (emp.id === updatedEmployee.id ? updatedEmployee : emp)));
        closeEditModal();
     }
     const handleSort = (columnName) => {
        if (sortBy === columnName) {
          // Если уже сортируем по этому столбцу, меняем направление
          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
          // Если сортируем по другому столбцу, устанавливаем новый столбец и направление по умолчанию (asc)
          setSortBy(columnName);
          setSortOrder('asc');
        }
      };
      const handleDelete = (employeeId) => {
        // Спрашиваем подтверждение перед удалением
        if (window.confirm("Вы уверены, что хотите удалить данного сотрудника?")) {
          // Если пользователь нажал "OK", отправляем запрос на удаление
          fetch(`http://localhost:5000/api/employees/${employeeId}`, {
            method: 'DELETE',
          })
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json(); // DELETE запрос обычно не возвращает тело, но для единообразия пусть будет
          })
          .then(() => {
              // Обновляем список сотрудников после успешного удаления
              setEmployees(employees.filter(emp => emp.id !== employeeId));
          })
          .catch(error => {
            console.error("Error deleting employee:", error);
            alert('Failed to delete employee. ' + error) 
          });
        }
      };
  if (loading) {
    return <div>Loading employees...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Список сотрудников "Крутой Банк"</h2>
      <button className='button button-add' onClick={openAddModal}>Добавить сотрудника</button>
      <table>
      <thead>
  <tr>
    <th onClick={() => handleSort('id')}>
      ID {sortBy === 'id' && (sortOrder === 'asc' ? '▲' : '▼')}
    </th>
    <th onClick={() => handleSort('name')}>
      Имя {sortBy === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}
    </th>
    <th onClick={() => handleSort('position')}>
      Должность {sortBy === 'position' && (sortOrder === 'asc' ? '▲' : '▼')}
    </th>
    <th>Действие</th>
  </tr>
</thead>
        <tbody>
          {employees.map(employee => (
            <tr key={employee.id}>
              <td>{employee.id}</td>
              <td>{employee.name}</td>
              <td>{employee.position}</td>
              <td>
                <button className="button button-details" onClick={() => openDetailsModal(employee)}>
                Детали
                </button>
                <button className="button button-edit" onClick={() => openEditModal(employee)}>
                Изменить
                </button>
                <button className="button button-delete" onClick={() => handleDelete(employee.id)}> {/* Добавили кнопку Delete */}
                    Удалить
                </button>
            </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Модальное окно для добавления */}
      <Modal
        isOpen={isAddModalOpen}
        onRequestClose={closeAddModal}
        style={customStyles}
        contentLabel="Добавить сотрудника"
      >
        <EmployeeAdd onEmployeeAdded={handleEmployeeAdded} closeModal={closeAddModal} />
      </Modal>

        {/* Модальное окно для редактирования */}
      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={closeEditModal}
        style={customStyles}
        contentLabel="Изменить"
      >
        <EmployeeEdit employee={selectedEmployee} onEmployeeUpdated={handleEmployeeUpdated} closeModal={closeEditModal}/>
      </Modal>

       {/* Модальное окно для просмотра деталей */}
      <Modal
        isOpen={isDetailsModalOpen}
        onRequestClose={closeDetailsModal}
        style={customStyles}
        contentLabel="Детали"
      >
        <EmployeeDetails employee={selectedEmployee} closeModal={closeDetailsModal} />
      </Modal>
    </div>
  );
}

export default EmployeesList;