import React, { useEffect, useState } from 'react';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers } from './redux/feature/userSlice';
import { Link } from 'react-router-dom';


function App() {
  const { users, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [confirmDelete, setConfirmDelete] = useState(null);

  console.log(users)
  useEffect(() => {
    dispatch(getUsers());
  }, []);

  const [editUserId, setEditUserId] = useState(null);


  const handleDelete = (userId) => {
    setConfirmDelete(userId);
  };

  const handleConfirmDelete = () => {
    const authToken = '9150946fd4fe823aa30c831ce5d19bfb9ea54fb4780e9470cc41dab35176b7b6';
  
    fetch(`https://gorest.co.in/public/v2/users/${confirmDelete}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error deleting user: ${response.status} - ${response.statusText}`);
        }
        return response;
      })
      .then(() => {
        console.log('User deleted successfully');
        dispatch(getUsers());
      })
      .catch((error) => console.error(error));

    setConfirmDelete(null);
  };
  

  const handleCancelDelete = () => {
    setConfirmDelete(null);
  };

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEdit = (userId) => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUserId(null);
  };

  return (
      <section className="antialiased bg-gray-100 text-gray-600 h-screen px-4">
        <div className="flex flex-col justify-center h-full gap-7">
          <div className="w-full max-w-6xl mx-auto flex justify-end">
            <Link to="/add-new" className="w-[100px] p-2 bg-blue-700 text-center text-white rounded-md cursor-pointer">
              Add New
            </Link>
          </div>
          <div className="w-full max-w-6xl mx-auto bg-white shadow-lg rounded-sm border border-gray-200">
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <thead className="text-md text-left uppercase text-black bg-gray-50">
                  <tr>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-bold">Name</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-bold">Email</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-bold">Gender</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-bold">Status</div>
                    </th>
                    <th className="p-2 whitespace-nowrap">
                      <div className="font-bold">Actions</div>
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-100">
                  {users.slice().reverse().map((user) => (
                    <tr key={user.id} className="hover:bg-gray-100">
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-md font-medium">{user.name}</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-md font-medium">{user.email}</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-md font-medium">{user.gender}</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <div className="text-md font-medium">{user.status}</div>
                      </td>
                      <td className="p-2 whitespace-nowrap flex gap-2">
                        <div className="text-md font-medium cursor-pointer"
                          onClick={() => handleEdit(user.id)}
                        >
                          Edit
                        </div>
                        <div className="text-md font-medium">|</div>
                        <div
                          className="text-md font-medium cursor-pointer"
                          onClick={() => handleDelete(user.id)}
                        >
                          Delete
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {confirmDelete && (
            <div className="popup">
              <div className="text-black text-md font-bold">Delete Confirmation</div>
              <div className="mt-3 text-black text-md">Are You Sure To Delete This Data?</div>
              <div className="mt-6 flex gap-3 justify-end">
                <button className="text-blue-600 cursor-pointer"
                  onClick={handleCancelDelete}
                >
                  No
                </button>
                <button className="text-blue-600 cursor-pointer"
                  onClick={handleConfirmDelete}
                >
                  Yes
                </button>
              </div>
            </div>
          )}

        </div>
      </section>
  );
}

export default App;
