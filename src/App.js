import React, { useEffect, useState } from 'react';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers } from './redux/feature/userSlice';
import { Link, Navigate } from 'react-router-dom';

 
function App() {
  const { users, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [confirmDelete, setConfirmDelete] = useState(null);
  const navigate = useNavigate();

  console.log(users)
  useEffect(() => {
    dispatch(getUsers());
  }, []);


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

  const [isPopupOpen, setPopupOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);

  const handlePopupClose = () => {
    setEditingUserId(null);
    setPopupOpen(false);
  };

  const [editedUser, setEditedUser] = useState({
    name: "",
    email: "",
    gender: "",
    status: "",
  });

  const handleEdit = (userId) => {
    const selectedUser = users.find((user) => user.id === userId);
  
    setEditedUser({
      name: selectedUser.name,
      email: selectedUser.email,
      gender: selectedUser.gender,
      status: selectedUser.status,
    });
  
    setEditingUserId(userId);
    setPopupOpen(true);
  };

  const handleSave = async () => {
    try {
      const authToken = '9150946fd4fe823aa30c831ce5d19bfb9ea54fb4780e9470cc41dab35176b7b6';
      const response = await fetch(
        `https://gorest.co.in/public/v2/users/${editingUserId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify(editedUser),
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }

      handlePopupClose();
      navigate("/")
    } catch (error) {
      console.error("Error updating:", error.message);
    }
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
                {users.map((user) => (
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
        {isPopupOpen && editingUserId !== null && (
          <div className="popup-container h-screen px-4">
            <div className="flex flex-col justify-center h-full gap-7">
              <div className="w-full max-w-3xl lg:px-10 px-5 lg:py-14 py-10 mx-auto bg-white shadow-lg rounded-sm border border-gray-200 h-[600px]">
                <div className="flex justify-end ">
                  <button 
                    className="text-right cursor-pointer"
                    onClick={handlePopupClose}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="w-6 h-6 text-red-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                  </button>
                </div>
                <div className="text-xl font-bold">Edit Data</div>
                <form >
                  <div className="mt-16 lg:pl-32 pl-0 flex flex-col gap-5">
                    <div className="flex lg:gap-10 gap-5 items-center">
                      <label className="w-[50px]">Name</label>
                      <input className="border-2 border-black lg:w-[300px] w-max p-1" 
                        value={editedUser.name}
                        onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                        type="text"
                      />
                    </div>
                    <div className="flex lg:gap-10 gap-5 items-center">
                      <label className="w-[50px]">Email</label>
                      <input className="border-2 border-black lg:w-[300px] w-max p-1" 
                        type="text" 
                        value={editedUser.email}
                        onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}  
                      />
                    </div>
                    <div className="flex lg:gap-10 gap-5 items-center">
                      <label className="w-[50px]">Gender</label>
                      <select
                        className="w-[120px] border border-black p-1"
                        value={editedUser.gender}
                        onChange={(e) => setEditedUser({ ...editedUser, gender: e.target.value })}
                      >
                        <option className="cursor-pointer" value="male">Male</option>
                        <option className="cursor-pointer" value="female">Female</option>
                      </select>
                    </div>

                    <div className="flex lg:gap-10 gap-5 items-center">
                      <label className="w-[50px]">Status</label>
                      <select
                        className="w-[120px] border border-black p-1"
                        value={editedUser.status}
                        onChange={(e) => setEditedUser({ ...editedUser, status: e.target.value })}
                      >
                        <option className="cursor-pointer" value="active">Active</option>
                        <option className="cursor-pointer" value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-28 flex justify-end">
                    <button className="w-[100px] p-2 bg-blue-700 text-center text-white rounded-md cursor-pointer" 
                      type="submit"
                      onClick={handleSave}
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default App;
