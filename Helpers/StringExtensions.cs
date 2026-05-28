using System;
using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;

namespace DrivingSchoolWeb.Helpers
{
    public static class StringExtensions
    {
        public static string ToSlug(this string? text)
        {
            if (string.IsNullOrWhiteSpace(text))
                return string.Empty;

            var normalizedString = text.Normalize(NormalizationForm.FormD);
            var stringBuilder = new StringBuilder(capacity: normalizedString.Length);

            foreach (var c in normalizedString)
            {
                var unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);
                if (unicodeCategory != UnicodeCategory.NonSpacingMark)
                {
                    stringBuilder.Append(c);
                }
            }

            var cleanString = stringBuilder
                .ToString()
                .Normalize(NormalizationForm.FormC)
                .ToLowerInvariant();

            // Thay thế 'đ' và 'Đ'
            cleanString = cleanString.Replace("đ", "d").Replace("Đ", "d");

            // Loại bỏ các ký tự không hợp lệ
            cleanString = Regex.Replace(cleanString, @"[^a-z0-9\s-]", "");
            
            // Thay thế khoảng trắng bằng dấu gạch ngang
            cleanString = Regex.Replace(cleanString, @"\s+", "-").Trim('-');

            return cleanString;
        }
    }
}
