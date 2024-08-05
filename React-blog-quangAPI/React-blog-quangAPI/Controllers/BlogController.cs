using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using React_blog_quangAPI.Data.Models;
using React_blog_quangAPI.Models.DAO;
using React_blog_quangAPI.Models.DTO;

namespace React_blog_quangAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BlogController : ControllerBase
    {

        [HttpGet]
        [Route("getList")]
        public async Task<IActionResult> Showlist([FromQuery] string name = "")// lấy danh sách blog và tìm kiếm
        {
            BlogDAO blogDAO = new BlogDAO();

            var query = blogDAO.Search(name);

            return Ok(new { data = query });
        }


        [HttpGet("getBlog/{id}")]
        public async Task<IActionResult> getBlog(int id)// lấy thông tin blog 
        {
            BlogDAO blogDAO = new BlogDAO();
            BLogLocationDAO blogLocationDAO = new BLogLocationDAO();
            var query = blogDAO.getItemView(id);
            var listBlogLocations = blogLocationDAO.getByIdBlog(id);

            var arr = listBlogLocations.Select(loc => loc.IdLocation).ToList();//lây list id của location

            return Ok(new { data = query, arr = arr });
        }
        [HttpPost]
        [Route("Create")]
        public async Task<IActionResult> Create([FromForm] BlogDTO formData)// thêm mới blog
        {
            if (string.IsNullOrWhiteSpace(formData.name) || formData.Idtype <= 0 || formData.arr == null || //kiểm tra dữ liệu đầu vào
                formData.arr.Length == 0 || formData.date == default || string.IsNullOrWhiteSpace(formData.note) ||
                string.IsNullOrWhiteSpace(formData.detail))
            {
                return BadRequest(new { message = "Dữ liệu đầu vào không hợp lệ." });
            }

            try
            {
                BlogDAO blogDAO = new BlogDAO();       
                BLogLocationDAO blogLocationDAO = new BLogLocationDAO();
                Blog blog = new Blog
                {
                    Name = formData.name,
                    IdType = formData.Idtype,
                    State = formData.state,
                    Date = formData.date,
                    Note = formData.note,
                    Detail = formData.detail
                };

                blogDAO.InsertOrUpdate(blog); //thêm mới blog

                if (blog.Id <= 0)
                {
                    return StatusCode(500, new { message = "Lỗi khi thêm blog." });
                }

                foreach (var locationId in formData.arr)   // thêm mới blogLocatiob
                {
                    BlogLocation blogLocation = new BlogLocation
                    {
                        IdBlog = blog.Id,
                        IdLocation = locationId
                    };
                    blogLocationDAO.InsertOrUpdate(blogLocation);
                }

                return Ok(new { message = "Thêm mới thành công." });
            }
            catch (Exception ex)
            {
                // Log the exception details
                return StatusCode(500, new { message = "Đã xảy ra lỗi khi thêm blog.", error = ex.Message });
            }
        }

        [HttpPatch]
        [Route("Update")]
        public async Task<IActionResult> Update([FromForm] int id, [FromForm] BlogDTO formData)//chỉnh sửa blog
        {

            BlogDAO blogDAO = new BlogDAO();
            BLogLocationDAO blogLocationDAO = new BLogLocationDAO();

            Blog blog = blogDAO.getItem(id);

            blog.Name = formData.name;
            blog.IdType = formData.Idtype;
            blog.State = formData.state;
            blog.Date = formData.date;
            blog.Note = formData.note;
            blog.Detail = formData.detail;
            blogDAO.InsertOrUpdate(blog);   //chỉnh sửa lại thông tin blog

           

            var query = blogLocationDAO.getByIdBlog(id);//lấy list blogLocation theo idBlog
            List<int> listIdBlogLocation = query.Select(loc => loc.Id).ToList();// lấy id 

            //xóa dữ liệu location cũ của blog
            foreach (var item in listIdBlogLocation)
            {
                blogLocationDAO.Delete(item);
            }

            // cập nhật lại location của blog dữ liệu mới
            foreach (var locationId in formData.arr)
            {
                BlogLocation blogLocation = new BlogLocation
                {
                    IdBlog = blog.Id,
                    IdLocation = locationId
                };
                blogLocationDAO.InsertOrUpdate(blogLocation);
            }
            return Ok(new { mess = "Chỉnh sửa thành công" });
        }



        [HttpDelete("Delete/{id}")]
        public async Task<IActionResult> Delete(int id)//hàm xóa blog
        {
            BlogDAO blogDAO = new BlogDAO();
            blogDAO.Delete(id);
            return Ok(new { mess = "xóa thành công " });

        }
        [HttpGet]
        [Route("getListLocation")]
        public async Task<IActionResult> listLocation() //lấy danh sách location
        {
            LocationDAO locationDAO = new LocationDAO();
            var query = locationDAO.Search();
            return Ok(new { data = query });

        }

        [HttpGet]
        [Route("getListType")]
        public async Task<IActionResult> getListType() // lấy danh sách loại
        {
            TypeDAO typeDAO = new TypeDAO();

            var listType = typeDAO.getList();          
                                                       
            return Ok(new { data = listType });
        }



        [HttpPost]
        [Route("Upload")]
        public async Task<IActionResult> Upload([FromForm] IFormFile Image)  //thêm ảnh
        {
            try
            {
                if (Image == null || Image.Length == 0)
                {
                    return BadRequest(new { message = "No file uploaded." });
                }

                // Generate unique file name to avoid conflicts
                var fileName = Path.GetFileNameWithoutExtension(Image.FileName);
                var extension = Path.GetExtension(Image.FileName);
                var uniqueFileName = $"{fileName}_{Guid.NewGuid()}{extension}";
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images", uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await Image.CopyToAsync(stream);
                }

                var imageUrl = $"/images/{uniqueFileName}";
                return Ok(new { message = "Upload successful.", imageUrl });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Upload failed.", error = ex.Message });
            }
        }


    }
}