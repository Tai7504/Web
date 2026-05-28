using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using DrivingSchoolWeb.Services;

namespace DrivingSchoolWeb.Filters
{
    public class ContactSettingsFilter : IAsyncActionFilter
    {
        private readonly ApiService _apiService;

        public ContactSettingsFilter(ApiService apiService)
        {
            _apiService = apiService;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext = await next();

            if (resultContext.Controller is Controller controller)
            {
                try
                {
                    var settings = await _apiService.GetSettingsAsync();
                    var contactKeys = new[] { "contact_youtube", "zalo_link", "hotline", "facebook_link" };
                    var contactSettings = new Dictionary<string, string>();
                    
                    foreach (var key in contactKeys)
                    {
                        if (settings.ContainsKey(key))
                        {
                            contactSettings[key] = settings[key];
                        }
                    }

                    controller.ViewBag.ContactSettings = contactSettings;
                }
                catch
                {
                    controller.ViewBag.ContactSettings = new Dictionary<string, string>();
                }
            }
        }
    }
}
