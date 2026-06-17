using Microsoft.AspNetCore.Mvc;
using System.Text;

namespace DrivingSchoolWeb.Controllers
{
    public class RobotsController : Controller
    {
        [Route("robots.txt")]
        public IActionResult Index()
        {
            var domain = $"{Request.Scheme}://{Request.Host}";
            var sb = new StringBuilder();
            sb.AppendLine("User-agent: *");
            sb.AppendLine("Disallow: /admin/");
            sb.AppendLine("Disallow: /api/");
            sb.AppendLine("Allow: /");
            sb.AppendLine($"Sitemap: {domain}/sitemap.xml");

            return Content(sb.ToString(), "text/plain", Encoding.UTF8);
        }
    }
}
