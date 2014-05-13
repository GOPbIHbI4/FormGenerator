using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.Utilities
{
    public class ReflectionUtilities
    {
        /// <summary> Для string полей объекта делает trim
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static T TrimStringFields<T>(T obj) where T : class
        {
            if (obj == null) return null;

            foreach (System.Reflection.PropertyInfo field in obj.GetType().GetProperties())
            {
                if (field.PropertyType == typeof(string))
                {
                    var field_val = field.GetValue(obj, null);
                    if (field_val != null)
                    {
                        string s = field_val.ToString().TrimIfNotNull();
                        field.SetValue(obj, s, null);
                    }
                }
            }
            return obj;
        }
    }
}
