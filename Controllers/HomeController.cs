using Microsoft.AspNetCore.Mvc;
using DrivingSchoolWeb.Models;
using DrivingSchoolWeb.Services;

namespace DrivingSchoolWeb.Controllers
{
    public class HomeController : Controller
    {
        private readonly ApiService _apiService;
        private readonly IConfiguration _configuration;

        public HomeController(ApiService apiService, IConfiguration configuration)
        {
            _apiService = apiService;
            _configuration = configuration;
        }

        public async Task<IActionResult> Index(int coursePage = 1, int newsPage = 1)
        {
            // Gọi tất cả API song song
            var coursesTask = _apiService.GetCoursesAsync(coursePage);
            var teachersTask = _apiService.GetTeachersAsync();
            var newsTask = _apiService.GetNewsAsync(newsPage);
            var achievementsTask = _apiService.GetAchievementsAsync();
            var bannersTask = _apiService.GetBannersAsync();
            var settingsTask = _apiService.GetSettingsAsync();
            var wcuImagesTask = _apiService.GetWcuImagesAsync();
            var allCoursesTask = _apiService.GetCoursesAsync(1, 100); // Lấy tất cả cho form đăng ký

            await Task.WhenAll(coursesTask, teachersTask, newsTask, achievementsTask, bannersTask, settingsTask, wcuImagesTask, allCoursesTask);

            var coursesResult = await coursesTask;
            var newsResult = await newsTask;
            var allCoursesResult = await allCoursesTask;
            var settings = await settingsTask;

            // Set API Base URL và ContactSettings cho layout
            var apiBaseUrl = _configuration["ApiSettings:BaseUrl"] ?? "http://localhost:8080/api";
            ViewBag.ApiBaseUrl = apiBaseUrl.Replace("/api", "");
            ViewBag.ContactSettings = settings ?? new Dictionary<string, string>();

            var model = new LandingPageViewModel
            {
                Courses = coursesResult.Data,
                CoursePagination = coursesResult.Pagination,
                Teachers = await teachersTask,
                News = newsResult.Data,
                NewsPagination = newsResult.Pagination,
                Achievements = await achievementsTask,
                Banners = await bannersTask,
                Settings = settings,
                WcuImages = await wcuImagesTask,
                CoursesForForm = allCoursesResult.Data
            };

            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> SubmitLead(LeadFormViewModel form)
        {
            if (string.IsNullOrWhiteSpace(form.Full_name) || string.IsNullOrWhiteSpace(form.Phone))
            {
                TempData["LeadError"] = "Vui lòng nhập họ tên và số điện thoại!";
                return Redirect(Url.Action("Index") + "#registration-form");
            }

            var result = await _apiService.SubmitLeadAsync(form);

            if (result.Success)
            {
                TempData["LeadSuccess"] = "Đăng ký thành công! Chúng tôi sẽ liên hệ bạn sớm nhất.";
            }
            else
            {
                TempData["LeadError"] = result.Message ?? "Có lỗi xảy ra, vui lòng thử lại!";
            }

            return Redirect(Url.Action("Index") + "#registration-form");
        }

        // Chi tiết tin tức
        public async Task<IActionResult> NewsDetail(int id)
        {
            var news = await _apiService.GetNewsDetailAsync(id);
            
            if (news == null)
            {
                return NotFound();
            }

            var relatedNews = await _apiService.GetRelatedNewsAsync(id, take: 4);
            var settings = await _apiService.GetSettingsAsync();

            // Set API Base URL và ContactSettings cho layout
            var apiBaseUrl = _configuration["ApiSettings:BaseUrl"] ?? "http://localhost:8080/api";
            ViewBag.ApiBaseUrl = apiBaseUrl.Replace("/api", "");
            ViewBag.ContactSettings = settings ?? new Dictionary<string, string>();

            var model = new NewsDetailViewModel
            {
                News = news,
                RelatedNews = relatedNews
            };

            return View(model);
        }

        // Chi tiết khóa học
        public async Task<IActionResult> CourseDetail(int id)
        {
            var course = await _apiService.GetCourseDetailAsync(id);
            
            if (course == null)
            {
                return NotFound();
            }

            var relatedCourses = await _apiService.GetRelatedCoursesAsync(id, take: 3);
            var settings = await _apiService.GetSettingsAsync();

            // Set API Base URL và ContactSettings cho layout
            var apiBaseUrl = _configuration["ApiSettings:BaseUrl"] ?? "http://localhost:8080/api";
            ViewBag.ApiBaseUrl = apiBaseUrl.Replace("/api", "");
            ViewBag.ContactSettings = settings ?? new Dictionary<string, string>();

            var model = new CourseDetailViewModel
            {
                Course = course,
                RelatedCourses = relatedCourses
            };

            return View(model);
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = System.Diagnostics.Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
