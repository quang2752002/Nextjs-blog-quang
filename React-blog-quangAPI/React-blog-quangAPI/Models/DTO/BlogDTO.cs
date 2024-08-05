using Microsoft.AspNetCore.Mvc;

namespace React_blog_quangAPI.Models.DTO
{
    public class BlogDTO
    {
        public string name { get; set; }
        public int Idtype { get; set; }
        public bool state { get; set; }
        public int[] arr { get; set; }
        public DateTime date { get; set; }
        public string note { get; set; }
        public string detail { get; set; }
    } 
   
    
}


