namespace DrivingSchoolWeb.Models
{
    // Response wrapper từ API
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public T? Data { get; set; }
        public string? Message { get; set; }
        public PaginationInfo? Pagination { get; set; }
    }

    public class PaginationInfo
    {
        public int Page { get; set; }
        public int Limit { get; set; }
        public int TotalRecords { get; set; }
        public int TotalPages { get; set; }
    }

    // Khóa học
    public class CourseViewModel
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Image { get; set; }
        public string? Images { get; set; }
        public string? Description { get; set; }
        public string? Content { get; set; }
        public decimal? Price { get; set; }
        public string? Banner { get; set; }
        public int? Discount_percentage { get; set; }
        public int? License_type_id { get; set; }
        public bool Status { get; set; }
        public LicenseTypeViewModel? License_type { get; set; }

        // Tính giá sau giảm
        public decimal? DiscountedPrice =>
            (Price.HasValue && Discount_percentage.HasValue && Discount_percentage > 0)
                ? Price.Value * (100 - Discount_percentage.Value) / 100
                : null;
    }

    // Loại bằng lái
    public class LicenseTypeViewModel
    {
        public int Id { get; set; }
        public string? Code { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
    }

    // Giáo viên
    public class TeacherViewModel
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Image { get; set; }
        public string? Description { get; set; }
    }

    // Tin tức
    public class NewsViewModel
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Thumbnail_image { get; set; }
        public string? Sapo { get; set; }
        public string? Content { get; set; }
        public string? Tags { get; set; }
        public DateTime? Created_time { get; set; }
    }

    // Thành tích
    public class AchievementViewModel
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Image { get; set; }
        public string? Images { get; set; }
        public string? Description { get; set; }
        public int Sort_order { get; set; }
    }

    // Banner
    public class BannerViewModel
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Image_url { get; set; }
        public string? Target_url { get; set; }
        public int Display_order { get; set; }
    }

    // Ảnh Carousel WCU
    public class WcuImageViewModel
    {
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Image_url { get; set; }
        public int Display_order { get; set; }
    }

    // Voucher
    public class VoucherViewModel
    {
        public int Id { get; set; }
        public string Code { get; set; } = string.Empty;
        public int Discount { get; set; }
        public string? Description { get; set; }
        public string? Terms { get; set; }
        public bool Status { get; set; }
        public List<int> Course_ids { get; set; } = new();
    }

    // System Settings
    public class SystemSettingViewModel
    {
        public int Id { get; set; }
        public string? Setting_key { get; set; }
        public string? Setting_value { get; set; }
        public string? Description { get; set; }
    }

    // Form đăng ký (gửi lên API)
    public class LeadFormViewModel
    {
        public string Full_name { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? Address { get; set; }
        public int? Course_interested_id { get; set; }
        public string? Customer_notes { get; set; }
        public string? Applied_voucher_code { get; set; }
    }

    // ViewModel cho trang chi tiết tin tức
    public class NewsDetailViewModel
    {
        public NewsViewModel? News { get; set; }
        public List<NewsViewModel> RelatedNews { get; set; } = new();
    }

    // ViewModel cho trang chi tiết khóa học
    public class CourseDetailViewModel
    {
        public CourseViewModel? Course { get; set; }
        public List<CourseViewModel> RelatedCourses { get; set; } = new();
    }

    // ViewModel tổng cho Landing Page
    public class LandingPageViewModel
    {
        public List<CourseViewModel> Courses { get; set; } = new();
        public PaginationInfo? CoursePagination { get; set; }
        public List<TeacherViewModel> Teachers { get; set; } = new();
        public List<NewsViewModel> News { get; set; } = new();
        public PaginationInfo? NewsPagination { get; set; }
        public List<AchievementViewModel> Achievements { get; set; } = new();
        public List<BannerViewModel> Banners { get; set; } = new();
        public List<WcuImageViewModel> WcuImages { get; set; } = new();
        public List<VoucherViewModel> Vouchers { get; set; } = new();
        public Dictionary<string, string> Settings { get; set; } = new();
        public List<CourseViewModel> CoursesForForm { get; set; } = new();
        public LeadFormViewModel LeadForm { get; set; } = new();
    }
}
