import { TextField } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { BeatLoader } from "react-spinners";

import toast, { Toaster } from "react-hot-toast";

const UpdateVideo = () => {
    const navigate = useNavigate();
    const {id} =useParams();
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const [titleAndDescript, setTitleAndDescript] = useState({
      title: null,
      description: null,
    });
    
    const [thumbnail, setThumbnail] = useState(null);
    const [video, setVideo] = useState(null);
    
    useEffect(()=>{
        axios.get(`api/v1/videos/get/${id}`)
        .then((item)=>console.log(item))
        .catch((err)=>console.error(err))

    },[])
console.log(id)
    const handleTitleAndDesc = async () => {
      try {
        setIsLoading(true);
        if (titleAndDescript.title || titleAndDescript.description) {
          const res = await axios.patch(
            `/api/v1/videos/updateDetails/${id}`,
            {
              title: titleAndDescript.title ,
              description: titleAndDescript.description ,
            },
          );
          if (res?.data?.success) {
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
    const handleThumbnail = async () => {
      try {
        if (thumbnail) {
          setIsLoading(true);
          const res = await axios.patch(
            `/api/v1/videos/updateThumbnail/${id}`,
            { thumbnail: thumbnail },
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
               // This option should be included here
            }
          );
          if (res?.data?.success) {
            console.log("res", res.data);
            setIsLoading(false);
            navigate("/profile");
          }
        }
      } catch (err) {
        console.log(err.response);
        setIsLoading(false);
      }
    };
    const handleVideo = async () => {
      try {
        if (video) {
          setIsLoading(true);
          const res = await axios.patch(
            `/api/v1/videos/updateVideo/${id}`,
            { videoFile: video },
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
               
            }
          );
          if (res?.data?.success) {
            console.log("res", res.data);
            setIsLoading(false);
            navigate("/profile");
          }
        }
      } catch (err) {
        console.log(err.response);
        setIsLoading(false);
      }
    };
    
    
    React.useEffect(() => {
      if (error) {
        toast.error(error);
      }
    }, [error]);
  
  console.log(thumbnail)
    return (
      <div className="text-white mb-3 ">
        <div>
          <Toaster />
        </div>
        {page === 1 && (
          <div>
            <h1 className="font-bold text-center p-3">Title and Description</h1>
            <div className="m-3">
              <div className="p-2">
                <TextField
                  required
                  fullWidth
                  id="title"
                  label="Title"
                  name="Title"
                  autoComplete="family-name"
                  className="bg-gray-200"
                  onChange={(e) =>
                    setTitleAndDescript({
                      ...titleAndDescript,
                      title: e.target.value,
                    })
                  }
                />
              </div>
              <div className="p-2">
                <TextField
                  required
                  fullWidth
                  id="description"
                  label="Description"
                  name="description"
                  autoComplete="email"
                  className="bg-gray-200"
                  onChange={(e) =>
                    setTitleAndDescript({
                      ...titleAndDescript,
                      description: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className=" flex justify-center items-center mt-auto">
              <button
                className="bg-white font-semibold p-2 rounded-md text-violet-700"
                onClick={handleTitleAndDesc}
              >
                {isLoading ? <BeatLoader color="rgba(54, 99, 214, 1)" /> : "Save"}
              </button>
            </div>
          </div>
        )}
  
        
        {page === 2 && (
          <div className="mt-10">
            <h1 className="font-bold text-center p-3">Thumbnail</h1>
            <div className="m-3">
              <div className="p-2 flex flex-col gap-5 md:flex-row">
                <label htmlFor="" className="pr-2">
                  Thumbnail
                </label>
                <TextField
                  id="thumbnail"
                  name="thumbnail"
                  className="bg-gray-200 w-56"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setThumbnail(e.target.files[0])
                  }
                />
              </div>
            </div>
            <div className=" flex justify-center items-center mt-auto">
              <button
                className="bg-white font-semibold p-2 rounded-md text-violet-700"
                onClick={handleThumbnail}
              >
                {isLoading ? <BeatLoader color="rgba(54, 99, 214, 1)" /> : "Save"}
              </button>
            </div>
          </div>
        )}
        {page === 3 && (
          <div className="mt-10">
            <h1 className="font-bold text-center p-3">Change Video</h1>
            <div className="m-3">
              <div className="p-2 flex gap-5  md:flex-row">
                <label htmlFor="" className="pr-2">
                  Video File
                </label>
                <TextField
                  id="videoFile"
                  className="bg-gray-200 w-56 rounded-sm"
                  type="file" 
                  accept="video/*"
                  onChange={(e) =>
                    setVideo(e.target.files[0])
                  }
                />
               
              </div>
            
              
            </div>
            <div className=" flex justify-center items-center mt-auto">
              <button
                className="bg-white font-semibold p-2 rounded-md text-violet-700"
                onClick={handleVideo}
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
          {page < 3 && (
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
    )
}

export default UpdateVideo