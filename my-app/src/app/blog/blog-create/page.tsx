"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Type } from "@/models/Type";
import { Location } from "@/models/Location";

const CreateBlogForm = () => {
  const [name, setName] = useState("");
  const [idType, setIdType] = useState(0);
  const [state, setState] = useState(false);
  const [arr, setArr] = useState<number[]>([]);
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [detail, setDetail] = useState("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [types, setTypes] = useState<Type[]>([]);

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      //lấy danh sách location
      try {
        const response = await axios.get(
          "https://localhost:7089/api/Blog/getListLocation"
        );
        setLocations(response.data.data);
      } catch (error) {
        console.error("There was an error fetching the locations!", error);
        toast.error("Error fetching locations");
      }
    };

    const fetchTypes = async () => {
      // lấy danh sách type
      try {
        const response = await axios.get(
          "https://localhost:7089/api/Blog/getListType"
        );
        setTypes(response.data.data);
      } catch (error) {
        console.error("There was an error fetching the types!", error);
        toast.error("Error fetching types");
      }
    };

    fetchLocations();
    fetchTypes();
  }, []);

  const handleCheckboxChange = (id: number) => {
    setArr((prev) => {
      if (prev.includes(id)) {
        return prev.filter((locationId) => locationId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("idType", idType.toString());
    formData.append("state", state.toString());
    formData.append("date", date);
    formData.append("note", note);
    formData.append("detail", detail);
    arr.forEach((locationId, index) => {
      formData.append(`arr[${index}]`, locationId.toString());
    });

    try {
      await axios.post("https://localhost:7089/api/Blog/Create", formData, {
        //thêm mới blog

        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Blog created successfully");
    } catch (error) {
      console.error("There was an error creating the blog!", error);
      toast.error("Error creating blog");
    }
  };

  const handleClear = () => {
    //clear dữ liệu đã nhập
    if (formRef.current) {
      formRef.current.reset();
      setName("");
      setIdType(0);
      setState(false);
      setArr([]);
      setDate("");
      setNote("");
      setDetail("");
    }
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
        <h1>New Blog</h1>
        <form onSubmit={handleSubmit} ref={formRef}>
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
              className="form-control"
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              required
            ></textarea>
          </div>
          <div>
            <label>Chi tiết</label>
            <textarea
              className="form-control"
              rows={8}
              value={detail}
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
            <br />
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

          <div className="row">
            <div className="col-md-6">
              <div>
                <label>Loại</label>
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
                <label>Date</label>
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
              Create Blog
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="btn btn-primary mx-2"
            >
              Clear
            </button>
          </div>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default CreateBlogForm;
