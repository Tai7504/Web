using System.Text.Json;
using System.Text.Json.Serialization;
using DrivingSchoolWeb.Models;

namespace DrivingSchoolWeb.Services
{
    public class ApiService
    {
        private readonly HttpClient _httpClient;
        private readonly JsonSerializerOptions _jsonOptions;

        public ApiService(HttpClient httpClient)
        {
            _httpClient = httpClient;
            _jsonOptions = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                NumberHandling = JsonNumberHandling.AllowReadingFromString
            };
        }

        // Lấy danh sách khóa học
        public async Task<(List<CourseViewModel> Data, PaginationInfo? Pagination)> GetCoursesAsync(int page = 1, int limit = 8)
        {
            try
            {
                var response = await _httpClient.GetAsync($"/api/courses?page={page}&limit={limit}");
                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    var result = JsonSerializer.Deserialize<ApiResponse<List<CourseViewModel>>>(json, _jsonOptions);
                    return (result?.Data ?? new List<CourseViewModel>(), result?.Pagination);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"API Error (courses): {ex.Message}");
            }
            return (new List<CourseViewModel>(), null);
        }
        // Lấy danh sách giáo viên
        public async Task<List<TeacherViewModel>> GetTeachersAsync()
        {
            try
            {
                var response = await _httpClient.GetAsync("/api/teachers");
                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    var result = JsonSerializer.Deserialize<ApiResponse<List<TeacherViewModel>>>(json, _jsonOptions);
                    return result?.Data ?? new List<TeacherViewModel>();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"API Error (teachers): {ex.Message}");
            }
            return new List<TeacherViewModel>();
        }

        // Lấy danh sách tin tức
        public async Task<(List<NewsViewModel> Data, PaginationInfo? Pagination)> GetNewsAsync(int page = 1, int limit = 6)
        {
            try
            {
                var response = await _httpClient.GetAsync($"/api/news?page={page}&limit={limit}");
                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    var result = JsonSerializer.Deserialize<ApiResponse<List<NewsViewModel>>>(json, _jsonOptions);
                    return (result?.Data ?? new List<NewsViewModel>(), result?.Pagination);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"API Error (news): {ex.Message}");
            }
            return (new List<NewsViewModel>(), null);
        }

        // Lấy thành tích
        public async Task<List<AchievementViewModel>> GetAchievementsAsync()
        {
            try
            {
                var response = await _httpClient.GetAsync("/api/achievements");
                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    var result = JsonSerializer.Deserialize<ApiResponse<List<AchievementViewModel>>>(json, _jsonOptions);
                    return result?.Data ?? new List<AchievementViewModel>();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"API Error (achievements): {ex.Message}");
            }
            return new List<AchievementViewModel>();
        }

        // Lấy banners
        public async Task<List<BannerViewModel>> GetBannersAsync()
        {
            try
            {
                var response = await _httpClient.GetAsync("/api/banners");
                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    var result = JsonSerializer.Deserialize<ApiResponse<List<BannerViewModel>>>(json, _jsonOptions);
                    return result?.Data ?? new List<BannerViewModel>();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"API Error (banners): {ex.Message}");
            }
            return new List<BannerViewModel>();
        }

        // Lấy ảnh WCU carousel
        public async Task<List<WcuImageViewModel>> GetWcuImagesAsync()
        {
            try
            {
                var response = await _httpClient.GetAsync("/api/wcu-images");
                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    var result = JsonSerializer.Deserialize<ApiResponse<List<WcuImageViewModel>>>(json, _jsonOptions);
                    return result?.Data ?? new List<WcuImageViewModel>();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"API Error (wcu-images): {ex.Message}");
            }
            return new List<WcuImageViewModel>();
        }

        // Lấy danh sách voucher active
        public async Task<List<VoucherViewModel>> GetVouchersAsync()
        {
            try
            {
                var response = await _httpClient.GetAsync("/api/vouchers");
                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    var result = JsonSerializer.Deserialize<ApiResponse<List<VoucherViewModel>>>(json, _jsonOptions);
                    return result?.Data ?? new List<VoucherViewModel>();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"API Error (vouchers): {ex.Message}");
            }
            return new List<VoucherViewModel>();
        }

        // Lấy system settings (API trả về object { key: value } chứ không phải list)
        public async Task<Dictionary<string, string>> GetSettingsAsync()
        {
            try
            {
                var response = await _httpClient.GetAsync("/api/system-settings");
                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    var result = JsonSerializer.Deserialize<ApiResponse<Dictionary<string, JsonElement>>>(json, _jsonOptions);
                    if (result?.Data != null)
                    {
                        return result.Data.ToDictionary(
                            kv => kv.Key,
                            kv => kv.Value.ToString()
                        );
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"API Error (settings): {ex.Message}");
            }
            return new Dictionary<string, string>();
        }

        // Lấy chi tiết một bài tin tức
        public async Task<NewsViewModel?> GetNewsDetailAsync(int id)
        {
            try
            {
                var response = await _httpClient.GetAsync($"/api/news/{id}");
                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    var result = JsonSerializer.Deserialize<ApiResponse<NewsViewModel>>(json, _jsonOptions);
                    return result?.Data;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"API Error (news detail): {ex.Message}");
            }
            return null;
        }

        // Lấy tin tức liên quan (loại trừ bài hiện tại)
        public async Task<List<NewsViewModel>> GetRelatedNewsAsync(int currentId, int take = 4)
        {
            try
            {
                var response = await _httpClient.GetAsync("/api/news");
                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    var result = JsonSerializer.Deserialize<ApiResponse<List<NewsViewModel>>>(json, _jsonOptions);
                    var newsList = result?.Data ?? new List<NewsViewModel>();
                    
                    return newsList
                        .Where(n => n.Id != currentId)
                        .OrderByDescending(n => n.Created_time)
                        .Take(take)
                        .ToList();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"API Error (related news): {ex.Message}");
            }
            return new List<NewsViewModel>();
        }

        // Lấy chi tiết một khóa học
        public async Task<CourseViewModel?> GetCourseDetailAsync(int id)
        {
            try
            {
                var response = await _httpClient.GetAsync($"/api/courses/{id}");
                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    var result = JsonSerializer.Deserialize<ApiResponse<CourseViewModel>>(json, _jsonOptions);
                    return result?.Data;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"API Error (course detail): {ex.Message}");
            }
            return null;
        }

        // Lấy khóa học liên quan (loại trừ khóa hiện tại)
        public async Task<List<CourseViewModel>> GetRelatedCoursesAsync(int currentId, int take = 3)
        {
            try
            {
                var coursesResult = await GetCoursesAsync(1, 100);
                return coursesResult.Data
                    .Where(c => c.Id != currentId)
                    .Take(take)
                    .ToList();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"API Error (related courses): {ex.Message}");
            }
            return new List<CourseViewModel>();
        }

        // Gửi form đăng ký (Lead)
        public async Task<ApiResponse<object>> SubmitLeadAsync(LeadFormViewModel form)
        {
            try
            {
                var response = await _httpClient.PostAsJsonAsync("/api/leads", form);
                var json = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<ApiResponse<object>>(json, _jsonOptions)
                    ?? new ApiResponse<object> { Success = false, Message = "Lỗi kết nối!" };
            }
            catch (Exception ex)
            {
                return new ApiResponse<object> { Success = false, Message = ex.Message };
            }
        }
    }
}
