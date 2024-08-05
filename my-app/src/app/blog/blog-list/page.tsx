"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Blog } from '@/models/Blog';

const BlogList = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchBlogs = async (query: string = "") => {
    try {
      const response = await axios.get(`https://localhost:7089/api/Blog/getList?name=${query}`);
      setBlogs(response.data.data); // Adjusted to access the data property
    } catch (error) {
      console.error("There was an error fetching the Blog list!", error);
    }
  };

  useEffect(() => {
    fetchBlogs(); // Fetch initial list without search term
  }, []);

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
    if (confirmDelete) {
      try {
        await axios.delete(`https://localhost:7089/api/Blog/delete/${id}`);
        fetchBlogs(); // Refresh the list after deletion
      } catch (error) {
        console.error("There was an error deleting the blog!", error);
      }
    }
  };

  return (
    <div>
      <header>
        <h1 className="text-center">Blog Management</h1>
      </header>
      <div className="sidebar">
        <ul>
          <li><a href="/blog/blog-list">List</a></li>
          <li><a href="/blog/blog-create">Create</a></li>
          <li><a href="#">Search</a></li>
        </ul>
      </div>
      <div className="content" id="root">
        <h1>Blog List</h1>
        <input
          className='form-control'
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            fetchBlogs(e.target.value); // Fetch blogs as the user types
          }}
          placeholder="Search blogs..."
        />
        <br />
        <table className='table border'>
          <thead className='border'>
            <tr className='border'>
              <th className='border'>Id</th>
              <th className='border'>Tên</th>
              <th className='border'>Loại</th>
              <th className='border'>Trạng thái</th>
              <th className='border'>Vị trí </th>
              <th className='border'>Ngày public</th>
              <th className='border'>Edit</th>
              <th className='border'>Delete</th>
            </tr>
          </thead>
          <tbody className='border'>
            {blogs.map(blog => (
              <tr className='border' key={blog.Id}>
                <td className='border'>{blog.Id}</td>
                <td className='border'>{blog.Name}</td>
                <td className='border'>{blog.Type}</td>
                <td className='border'>{blog.State ? 'Yes' : 'No'}</td>
                <td className='border'>{blog.Location}</td>
                <td className='border'>{new Date(blog.Date).toLocaleDateString()}</td>
                <td className='border'>
                  <a className='btn btn-primary' href={`/blog/blog-update/${blog.Id}`}>Edit</a>
                </td>
                <td className='border'>
                  <button 
                    className='btn btn-danger' 
                    onClick={() => handleDelete(blog.Id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BlogList;
