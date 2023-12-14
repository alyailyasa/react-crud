import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addNewUser } from '../redux/feature/userSlice';
import { useNavigate } from 'react-router-dom';


const AddNewUser = () => {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('male');
  const [status, setStatus] = useState('active');

  const [errorMessages, setErrorMessages] = useState([]);

  const navigate = useNavigate(); 

  const handleAddUser = async (e) => {

    e.preventDefault();
      console.log('Name:', name);
      console.log('Email:', email);
      console.log('Gender:', gender);
      console.log('Status:', status);
  
    try {
      if (!name || !email || !gender || !status) {
        throw new Error('All fields are required');
      }
  
      console.log('Name:', name);
      console.log('Email:', email);
      console.log('Gender:', gender);
      console.log('Status:', status);

      await dispatch(addNewUser({ name, email, gender, status }));
  
      navigate('/');
    } catch (error) {
      console.error('Error adding user:', error.message);

      if (error.message.startsWith('Error adding user: ')) {
        const errorData = JSON.parse(error.message.substring('Error adding user: '.length));
        setErrorMessages(errorData);
      } else {
        setErrorMessages([{ message: error.message }]);
      }
    }
  };

  return (
    <div>
      <section className="antialiased bg-gray-100 text-black h-screen px-4">
        <div className="flex flex-col justify-center h-full gap-7">
          <div className="w-full max-w-3xl lg:px-14 px-5 py-20 mx-auto bg-white shadow-lg rounded-sm border border-gray-200 h-[600px]">
            <div className=" ">
              <div className="text-xl font-bold">Add New Data</div>
              <form onSubmit={handleAddUser}>
                <div className="mt-16 lg:pl-32 pl-0 flex flex-col gap-5">
                  <div className="flex gap-10 items-center">
                    <label className="w-[50px]">Name</label>
                    <input className="border-2 border-black w-[300px] p-1" 
                      type="text" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                    />
                  </div>
                  <div className="flex gap-10 items-center">
                    <label className="w-[50px]">Email</label>
                    <input className="border-2 border-black w-[300px] p-1" 
                      type="text" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                    />
                  </div>
                  <div className="flex gap-10 items-center">
                    <label className="w-[50px]">Gender</label>
                    <select className="w-[120px] border border-black p-1" 
                      value={gender} 
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option className="cursor-pointer" value="male">Male</option>
                      <option className="cursor-pointer" value="female">Female</option>
                    </select>
                  </div>
                  <div className="flex gap-10 items-center">
                    <label className="w-[50px]">Status</label>
                    <select className="w-[120px] border border-black p-1" 
                      value={status} 
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option className="cursor-pointer" value="active">Active</option>
                      <option className="cursor-pointer" value="inactive">Inactive</option>
                    </select>
                  </div>
                  {errorMessages.length > 0 && (
                    <div className="text-red-500">
                      {errorMessages.map((error, index) => (
                        <div key={index}>{`${error.message}`}</div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="mt-28 flex justify-end">
                  <button className="w-[100px] p-2 bg-blue-700 text-center text-white rounded-md cursor-pointer" 
                    type="submit"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AddNewUser;
