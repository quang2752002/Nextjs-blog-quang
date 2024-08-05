"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Location } from "@/models/Location";
import { Type } from "@/models/Type";
import { Props } from "@/models/Props";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateBlogForm: React.FC<Props> = ({ params }) => {
  const id = params.slug;

  const [name, setName] = useState("");
  const [idType, setIdType] = useState(0);
  const [state, setState] = useState(false);
  const [arr, setArr] = useState<number[]>([]);
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [detail, setDetail] = useState("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [types, setTypes] = useState<Type[]>([]);

  // Store initial state
  const [initialState, setInitialState] = useState({
    name: "",
    idType: 0,
    state: false,
    arr: [] as number[],
    date: "",
    note: "",
    detail: "",
  });

  useEffect(() => {
    if (id) {
      const fetchBlog = async () => {
        try {
          const response = await axios.get(
            `https://localhost:7089/api/Blog/getBlog/${id}`
          );
          const blog = response.data.data;
          const arr = response.data.arr;

          // Convert date
          const formattedDate = new Date(blog.Date).toISOString().split("T")[0];

          const initialBlogState = {
            name: blog.Name,
            idType: blog.IdType,
            state: blog.State,
            arr: arr || [],
            date: formattedDate,
            note: blog.Note,
            detail: blog.Detail,
          };

          setInitialState(initialBlogState);

          setName(blog.Name);
          setIdType(blog.IdType);
          setState(blog.State);
          setArr(arr || []); // Ensure arr is always an array
          setDate(formattedDate); // Set date in YYYY-MM-DD format
          setNote(blog.Note);
          setDetail(blog.Detail);

          console.log("Fetched blog date:", formattedDate);
        } catch (error) {
          console.error("There was an error fetching the blog!", error);
        }
      };

      fetchBlog();
    }

    const fetchLocations = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7089/api/Blog/getListLocation"
        );
        setLocations(response.data.data);
      } catch (error) {
        console.error("There was an error fetching the locations!", error);
      }
    };

    const fetchTypes = async () => {
      try {
        const response = await axios.get(
          "https://localhost:7089/api/Blog/getListType"
        );
        setTypes(response.data.data);
      } catch (error) {
        console.error("There was an error fetching the types!", error);
      }
    };

    fetchLocations();
    fetchTypes();
  }, [id]);

  const handleCheckboxChange = (locationId: number) => {
    setArr((prev) => {
      if (prev.includes(locationId)) {
        return prev.filter((id) => id !== locationId);
      } else {
        return [...prev, locationId];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create FormData
    const formData = new FormData();
    formData.append("id", id); // Replace 'id' with the actual id value if needed
    formData.append("name", name);
    formData.append("idType", idType.toString());
    formData.append("state", state.toString());
    formData.append("date", date);
    formData.append("note", note);
    formData.append("detail", detail);

    // Add arr to FormData
    arr.forEach((locationId) => {
      formData.append("arr", locationId.toString());
    });

    try {
      const response = await axios.patch(
        `https://localhost:7089/api/Blog/Update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Response:", response.data); // Log the API response for checking
      toast.success("Blog updated successfully");
    } catch (error) {
      console.error("There was an error updating the blog!", error);
      toast.error("Error updating blog");
    }
  };

  const handleClear = () => {
    setName(initialState.name);
    setIdType(initialState.idType);
    setState(initialState.state);
    setArr(initialState.arr);
    setDate(initialState.date);
    setNote(initialState.note);
    setDetail(initialState.detail);
  };

  return (
    <div>
      <header>
        <h1 className="text-center">Blog Management</h1>
      </header>
      <div className="sidebar">
        <ul>
          <li>
            <a href="/blog/blog-list">List</a>
          </li>
          <li>
            <a href="/blog/blog-create">Create</a>
          </li>
          <li>
            <a href="#about">Search</a>
          </li>
        </ul>
      </div>

      <div className="content" id="root">
        <h1>Update Blog</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Tiêu đề</label>
            <input
              className="form-control"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Mô tả ngắn</label>
            <textarea
              rows={4}
              className="form-control"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              required
            ></textarea>
          </div>
          <div>
            <label>Chi tiết</label>
            <textarea
              value={detail}
              rows={8}
              className="form-control"
              onChange={(e) => setDetail(e.target.value)}
              required
            ></textarea>
          </div>

          <div>
            <label>Vị trí</label>
            <div className="locations-container">
              {locations.map((location) => (
                <div key={location.Id}>
                  <label>
                    <input
                      type="checkbox"
                      value={location.Id}
                      checked={arr.includes(location.Id)}
                      onChange={() => handleCheckboxChange(location.Id)}
                    />
                    {location.Name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label>Public</label>
            <div>
              <label>
                <input
                  type="radio"
                  name="state"
                  value="true"
                  checked={state === true}
                  onChange={() => setState(true)}
                />
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="state"
                  value="false"
                  checked={state === false}
                  onChange={() => setState(false)}
                />
                No
              </label>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div>
                <label>Type:</label>
                <select
                  className="form-control"
                  value={idType}
                  onChange={(e) => setIdType(parseInt(e.target.value))}
                  required
                >
                  <option value={0} disabled>
                    Select Type
                  </option>
                  {types.map((type) => (
                    <option key={type.Id} value={type.Id}>
                      {type.Name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-md-6">
              <div>
                <label>Date:</label>
                <input
                  className="form-control"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div className="text-center my-4">
            <button type="submit" className="btn btn-success mx-2">
              Update Blog
            </button>
            <button
              type="button"
              className="btn btn-primary mx-2"
              onClick={handleClear}
            >
              Clear
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UpdateBlogForm;
