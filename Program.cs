using DrivingSchoolWeb.Services;
using DrivingSchoolWeb.Filters;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddScoped<ContactSettingsFilter>();
builder.Services.AddControllersWithViews(options =>
{
    options.Filters.AddService<ContactSettingsFilter>();
});

// Đăng ký HttpClient + ApiService
var apiBaseUrl = builder.Configuration["ApiSettings:BaseUrl"] ?? "http://localhost:8080/api";
builder.Services.AddHttpClient<ApiService>(client =>
{
    client.BaseAddress = new Uri(apiBaseUrl.Replace("/api", ""));
    client.Timeout = TimeSpan.FromSeconds(10);
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseRouting();

app.UseAuthorization();

app.MapStaticAssets();

app.MapControllerRoute(
    name: "news_detail",
    pattern: "tin-tuc/{id}/{slug?}",
    defaults: new { controller = "Home", action = "NewsDetail" });

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}")
    .WithStaticAssets();

app.Run();
