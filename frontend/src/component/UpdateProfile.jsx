import { TextField } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { login } from "../store/authSlice";
import toast, { Toaster } from "react-hot-toast";

function UpdateProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [emailAndFullname, setEmailAndFullname] = useState({
    email: null,
    fullname: null,
  });
  const [password, setPassword] = useState({
    oldPassword: null,
    newPassword: null,
  });
  const [file, setFile] = useState({ avatar: null, coverImage: null });
  // console.log(file);
  const handleEmailChange = async () => {
    try {
      setIsLoading(true);
      if (emailAndFullname.email || emailAndFullname.fullname) {
        const res = await axios.patch(
          "/api/v1/users/updateDetails",
          {
            email: emailAndFullname.email || userData.email,
            fullname: emailAndFullname.fullname || userData.fullname,
          },
        );
        if (res?.data?.success) {
          dispatch(login(res?.data?.data));
          setIsLoading(false);
          navigate("/profile");
        }
      }
    } catch (err) {
      const startIndex =
        err.response?.data.indexOf("Error: ") + "Error: ".length;
      const endIndex = err.response?.data.indexOf("<br>");
      const errorMessage = err.response?.data.substring(startIndex, endIndex);
      setIsLoading(false);
      console.log(errorMessage);
      setError(errorMessage);
    }
  };
  const handleAvatar = async () => {
    try {
      if (file.avatar) {
        setIsLoading(true);
        const res = await axios.patch(
          "/api/v1/users/updateAvatar",
          { avatar: file.avatar },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true, // This option should be included here
          }
        );
        if (res?.data?.success) {
          console.log("res", res.data);
          dispatch(login(res?.data?.data));
          setIsLoading(false);
          navigate("/profile");
        }
      }
    } catch (err) {
      console.log(err.response);
      setIsLoading(false);
    }
  };
  const handleCoverImage = async () => {
    try {
      if (file.coverImage) {
        setIsLoading(true);
        const res = await axios.patch(
          "/api/v1/users/updateCover",
          { coverImage: file.coverImage },
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true, // This option should be included here
          }
        );
        if (res?.data?.success) {
          console.log("Successfull");
          dispatch(login(res?.data?.data));
          setIsLoading(false);
          navigate("/profile");
        }
      }
    } catch (err) {
      console.log(err.response);
      setIsLoading(false);
    }
  };
  const handlePasswordChange = async () => {
    try {
      if (password.newPassword && password.oldPassword) {
        const res = await axios.patch(
          "api/v1/users/changePassword",
          {
            oldPassword: password.oldPassword,
            newPassword: password.newPassword,
          },
          {
            withCredentials: true,
          }
        );
        if (res?.data?.success) {
          dispatch(login(res?.data?.data));
          setIsLoading(false);
          navigate("/profile");
        }
      } else {
        setError("both fields are required");
      }
    } catch (err) {
      const startIndex =
        err.response?.data.indexOf("Error: ") + "Error: ".length;
      const endIndex = err.response?.data.indexOf("<br>");
      const errorMessage = err.response?.data.substring(startIndex, endIndex);
      setIsLoading(false);
      console.log(errorMessage);
      setError(errorMessage);
    }
  };
  React.useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  console.log(userData)
  return (
    <div className="text-white mb-3 ">
      <div>
        <Toaster />
      </div>
      {page === 1 && (
        <div>
          <h1 className="font-bold text-center p-3">FullName and Email</h1>
          <div className="m-3">
            <div className="p-2">
              <TextField
                required
                fullWidth
                id="fullname"
                label="Full Name"
                name="Full Name"
                autoComplete="family-name"
                className="bg-gray-200"
                onChange={(e) =>
                  setEmailAndFullname({
                    ...emailAndFullname,
                    fullname: e.target.value,
                  })
                }
              />
            </div>
            <div className="p-2">
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                className="bg-gray-200"
                onChange={(e) =>
                  setEmailAndFullname({
                    ...emailAndFullname,
                    email: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <div className=" flex justify-center items-center mt-auto">
            <button
              className="bg-white font-semibold p-2 rounded-md text-violet-700"
              onClick={handleEmailChange}
            >
              {isLoading ? <BeatLoader color="rgba(54, 99, 214, 1)" /> : "Save"}
            </button>
          </div>
        </div>
      )}

      {page === 2 && (
        <div>
          <h1 className="font-bold text-center p-3">Password</h1>
          <div className="m-3">
            <div className="p-2">
              <TextField
                required
                fullWidth
                id="password"
                label="old password"
                name="old password"
                className="bg-gray-200"
                type="password"
                onChange={(e) =>
                  setPassword({ ...password, oldPassword: e.target.value })
                }
              />
            </div>
            <div className="p-2">
              <TextField
                required
                fullWidth
                id="password"
                label="new password"
                name="new password"
                className="bg-gray-200"
                type="password"
                onChange={(e) =>
                  setPassword({ ...password, newPassword: e.target.value })
                }
              />
            </div>
          </div>
          <div className=" flex justify-center items-center mt-auto">
            <button
              className="bg-white font-semibold p-2 rounded-md text-violet-700"
              onClick={handlePasswordChange}
            >
              Save
            </button>
          </div>
        </div>
      )}
      {page === 3 && (
        <div className="mt-10">
          <h1 className="font-bold text-center p-3">Avatar</h1>
          <div className="m-3">
            <div className="p-2 flex flex-col md:flex-row">
              <label htmlFor="" className="pr-2">
                Avatar
              </label>
              <TextField
                id="avatar"
                name="Avatar"
                className="bg-gray-200 w-56"
                type="file"
                onChange={(e) =>
                  setFile({ ...file, avatar: e.target.files[0] })
                }
              />
            </div>
          </div>
          <div className=" flex justify-center items-center mt-auto">
            <button
              className="bg-white font-semibold p-2 rounded-md text-violet-700"
              onClick={handleAvatar}
            >
              {isLoading ? <BeatLoader color="rgba(54, 99, 214, 1)" /> : "Save"}
            </button>
          </div>
        </div>
      )}
      {page === 4 && (
        <div className="mt-10">
          <h1 className="font-bold text-center p-3">Cover Image</h1>
          <div className="m-3">
            <div className="p-2 flex flex-col md:flex-row">
              <label htmlFor="" className="pr-2">
                Cover Image
              </label>
              <TextField
                id="coverImage"
                className="bg-gray-200 w-56"
                type="file"
                onChange={(e) =>
                  setFile({ ...file, coverImage: e.target.files[0] })
                }
              />
            </div>
          </div>
          <div className=" flex justify-center items-center mt-auto">
            <button
              className="bg-white font-semibold p-2 rounded-md text-violet-700"
              onClick={handleCoverImage}
            >
              {isLoading ? <BeatLoader color="rgba(54, 99, 214, 1)" /> : "Save"}
            </button>
          </div>
        </div>
      )}
      <div
        className={`flex ${
          page === 1 ? "justify-end" : "justify-between"
        } mt-auto`}
      >
        {page > 1 && (
          <div
            className="p-3 cursor-pointer border mx-2 border-violet-700"
            onClick={() => setPage((prev) => prev - 1)}
          >
            Prev
          </div>
        )}
        {page < 4 && (
          <div
            className="p-3 cursor-pointer border mx-2 border-violet-700"
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </div>
        )}
      </div>
      <div className="flex justify-center items-center">
        <button
          className="text-white font-semibold p-2 rounded-md bg-violet-700"
          onClick={() => navigate("/profile")}
        >
          Back to Profile
        </button>
      </div>
    </div>
  );
}

export default UpdateProfile;