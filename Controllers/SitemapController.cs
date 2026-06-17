using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Xml;
using DrivingSchoolWeb.Services;
using DrivingSchoolWeb.Models;
using DrivingSchoolWeb.Helpers;

namespace DrivingSchoolWeb.Controllers
{
    public class SitemapController : Controller
    {
        private readonly ApiService _apiService;

        public SitemapController(ApiService apiService)
        {
            _apiService = apiService;
        }

        [Route("sitemap.xml")]
        public async Task<IActionResult> Index()
        {
            var domain = $"{Request.Scheme}://{Request.Host}";
            var xmlSettings = new XmlWriterSettings
            {
                Encoding = Encoding.UTF8,
                Indent = true
            };

            using var memoryStream = new MemoryStream();
            using (var writer = XmlWriter.Create(memoryStream, xmlSettings))
            {
                writer.WriteStartDocument();
                writer.WriteStartElement("urlset", "http://www.sitemaps.org/schemas/sitemap/0.9");

                // Thêm trang chủ
                AddUrl(writer, domain + "/", DateTime.UtcNow, "daily", "1.0");

                // Thêm các bài tin tức
                try
                {
                    var newsResult = await _apiService.GetNewsAsync(1, 1000);
                    if (newsResult.Data != null)
                    {
                        foreach (var news in newsResult.Data)
                        {
                            var slug = news.Title?.ToSlug() ?? string.Empty;
                            var url = $"{domain}/tin-tuc/{news.Id}/{slug}";
                            var lastMod = news.Created_time ?? DateTime.UtcNow;
                            AddUrl(writer, url, lastMod, "weekly", "0.8");
                        }
                    }
                }
                catch
                {
                }

                // Thêm các khóa học
                try
                {
                    var coursesResult = await _apiService.GetCoursesAsync(1, 1000);
                    if (coursesResult.Data != null)
                    {
                        foreach (var course in coursesResult.Data)
                        {
                            var slug = course.Name?.ToSlug() ?? string.Empty;
                            var url = $"{domain}/khoa-hoc/{course.Id}/{slug}";
                            // Đặt lastMod mặc định là thời gian hiện tại vì Course DB có thể không lưu cập nhật chi tiết
                            var lastMod = DateTime.UtcNow;
                            AddUrl(writer, url, lastMod, "weekly", "0.9");
                        }
                    }
                }
                catch
                {
                }

                writer.WriteEndElement(); // urlset
                writer.WriteEndDocument();
            }

            return Content(Encoding.UTF8.GetString(memoryStream.ToArray()), "application/xml", Encoding.UTF8);
        }

        private void AddUrl(XmlWriter writer, string loc, DateTime lastMod, string changeFreq, string priority)
        {
            writer.WriteStartElement("url");
            writer.WriteElementString("loc", loc);
            writer.WriteElementString("lastmod", lastMod.ToString("yyyy-MM-dd"));
            writer.WriteElementString("changefreq", changeFreq);
            writer.WriteElementString("priority", priority);
            writer.WriteEndElement();
        }
    }
}
