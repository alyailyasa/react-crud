import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


export const getUsers = createAsyncThunk("users/getUsers", async () => {
  return fetch("https://gorest.co.in/public/v2/users").then((res) =>
    res.json()
  );
});

export const addNewUser = createAsyncThunk(
  "users/addNewUser",
  async (userData, { rejectWithValue }) => {
    const authToken = '9150946fd4fe823aa30c831ce5d19bfb9ea54fb4780e9470cc41dab35176b7b6';

    try {
      const response = await fetch("https://gorest.co.in/public/v2/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(userData),
      });

      console.log('Response from the server:', response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }

      return response.json();
    } catch (error) {
      console.error('Error adding new user:', error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const updateUser = createAsyncThunk(
    "users/updateUser",
    async ({ userId, updatedUserData }, { rejectWithValue }) => {
    const authToken = '9150946fd4fe823aa30c831ce5d19bfb9ea54fb4780e9470cc41dab35176b7b6';

    try {
        const response = await fetch(`https://gorest.co.in/public/v2/users/${userId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(updatedUserData),
        });

        if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
        }

        return response.json();
    } catch (error) {
        console.error('Error updating user:', error.message);
        return rejectWithValue(error.message);
    }
    }
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(getUsers.rejected, (state) => {
        state.loading = false;
        state.error = "Error fetching users";
      })
      .addCase(addNewUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload);
        state.users.sort((a, b) => b.id - a.id);
      })
      .addCase(addNewUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error adding new user";
      });
  },
});

    

export default userSlice.reducer;

