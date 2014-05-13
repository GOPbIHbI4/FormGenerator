using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.Utilities
{
    /// <summary> расширения для класса String
    /// </summary>
    public static class StringExtensions
    {
        /// <summary> Форматирует строку аргументами так же, что и String.Format
        /// </summary>
        /// <param name="t"></param>
        /// <param name="arguments"></param>
        /// <returns></returns>
        public static string FormatString(this string t, params object[] arguments)
        {
            return string.Format(t, arguments);
        }

        /// <summary> Трим иф нот нулл
        /// </summary>
        /// <param name="t"></param>
        /// <param name="arguments"></param>
        /// <returns></returns>
        public static string TrimIfNotNull(this string t)
        {
            return t == null ? null : t.Trim();
        }

        /// <summary> Возвращает пустую строку если Null иначе строку с Trim();
        /// </summary>
        /// <param name="t"></param>
        /// <param name="arguments"></param>
        /// <returns></returns>
        public static string EmptyIfNull(this string t)
        {
            return t == null ? "" : t.Trim();
        }

        /// <summary>Возвращает строу типа Aaaaaa
        /// </summary>
        /// <param name="str"></param>
        /// <returns></returns>
        public static string UppercaseFirst(this string str)
        {
            if (string.IsNullOrEmpty(str))
            {
                return string.Empty;
            }
            return char.ToUpper(str[0]) + str.Substring(1).ToLower();
        }
    }
}
