﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using FormGenerator.Utilities;

namespace FormGenerator.ServerDataAccess
{
    /// <summary> Типа мини-орм для простых sql выборок
    /// </summary>
    public static class DBOrmUtils
    {
        public class TypeProperty
        {
            public Type objectType { get; set; }
            public Type tableType { get; set; }
            public MethodInfo fieldValueMethod { get; set; }
            public object defaultValue { get; set; }
            public PropertyInfo objectProperty { get; set; }
            public bool needToTrim { get; set; }
        }

        /// <summary> Получает значение ячейки строки объекта DataRow по имени столбца
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="dr"></param>
        /// <param name="colName"></param>
        /// <param name="defaultValue"></param>
        /// <returns></returns>
        public static T FieldValue<T>(DataRow dr, string colName, T defaultValue)
        {
            return (dr[colName] != DBNull.Value ? dr.Field<T>(colName.ToUpper()) : defaultValue);
        }

        /// <summary> Метод читает запрос sql и возвращает из запроса объект C# с теми же полями, что и поля запроса, 
        /// т.е будет заполнен объект с такими же открытыми свойствами, что и результирующие поля запроса. 
        /// Возвращает список
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="sql"></param>
        /// <param name="connectionID"></param>
        /// <param name="transactionID"></param>
        /// <returns></returns>
        public static List<T> OpenSqlList<T>(string sql, Dictionary<string, string> mapping, IDbConnection connectionID, IDbTransaction transactionID = null)
            where T : class, new()
        {
            List<T> list = new List<T>();
            List<string> errors = new List<string>();
            ResponseTablePackage res = DBUtils.OpenSQL(sql, connectionID, transactionID);
            res.ThrowExceptionIfError();
            if (res.resultData.Rows.Count == 0)
            {
                return list;
            }

            KeyValuePair<Dictionary<string, TypeProperty>, List<string>> preresult = PrepareTypes<T>(res.resultData, mapping);
            errors = preresult.Value;

            foreach (DataRow row in res.resultData.Rows)
            {
                KeyValuePair<T, List<string>> kvp = DBOrmUtils.ConvertToObject<T>(row, preresult.Key, connectionID, transactionID);
                list.Add(kvp.Key);
                errors.AddRange(kvp.Value);
            }
            if (errors.Count > 0)
            {
                string error = "";
                errors.ForEach(e => error += e + "<br>" + Environment.NewLine);
                throw new Exception(error);
            }
            return list;
        }

        public static string GetSqlWhereFromString(string value, string fieldName)
        {
            return value == null ? "" : (" and {0} = '{1}'".FormatString(fieldName, value) + Environment.NewLine);
        }
        public static string GetSqlWhereFromNumber(decimal? value, string fieldName)
        {
            return value == null ? "" : (" and {0} = {1}".FormatString(fieldName, value) + Environment.NewLine);
        }
        public static string GetSqlWhereFromDate(DateTime? value, string fieldName)
        {
            return value == null ? "" : (" and {0} = '{1}'".FormatString(fieldName, value.ToDMY()) + Environment.NewLine);
        }

        ///// <summary> Метод читает запрос sql и возвращает из запроса объект C# с теми же полями, что и поля запроса, 
        ///// т.е будет заполнен объект с такими же открытыми свойствами, что и результирующие поля запроса. 
        ///// Возвращает первую строку выборки или Exception, если таких строк нет
        ///// </summary>
        ///// <typeparam name="T"></typeparam>
        ///// <param name="sql"></param>
        ///// <param name="connectionID"></param>
        ///// <param name="transactionID"></param>
        ///// <returns></returns>
        //public static T OpenSqlFirst<T>(string sql, IDbConnection connectionID, IDbTransaction transactionID = null)
        //    where T : class, new()
        //{
        //    List<T> list = new List<T>();

        //    ResponseTablePackage res = DBUtils.OpenSQL(sql, connectionID, transactionID);
        //    res.ThrowExceptionIfError();

        //    if (res.resultData.Rows.Count == 0)
        //    {
        //        throw new Exception("В последовательности не онаружено элементов!");
        //    }
        //    else
        //    {
        //        KeyValuePair<T, List<string>> kvp = DBOrmUtils.ConvertToObject<T>(res.resultData.Rows[0], connectionID, transactionID);
        //        if (kvp.Value.Count > 0)
        //        {
        //            string error = "";
        //            kvp.Value.ForEach(e => error += e);
        //            throw new Exception(error);
        //        }
        //        return kvp.Key;
        //    }
        //}

        ///// <summary> Метод читает запрос sql и возвращает из запроса объект C# с теми же полями, что и поля запроса, 
        ///// т.е будет заполнен объект с такими же открытыми свойствами, что и результирующие поля запроса. 
        ///// Возвращает первую строку выборки или default(T) - обычно null, если таких строк нет
        ///// </summary>
        ///// <typeparam name="T"></typeparam>
        ///// <param name="sql"></param>
        ///// <param name="connectionID"></param>
        ///// <param name="transactionID"></param>
        ///// <returns></returns>
        //public static T OpenSqlFirstOrDefault<T>(string sql, IDbConnection connectionID, IDbTransaction transactionID = null)
        //    where T : class, new()
        //{
        //    List<T> list = new List<T>();

        //    ResponseTablePackage res = DBUtils.OpenSQL(sql, connectionID, transactionID);
        //    res.ThrowExceptionIfError();

        //    if (res.resultData.Rows.Count == 0)
        //    {
        //        return (T)typeof(T).GetDefaultValue();
        //    }
        //    else
        //    {
        //        KeyValuePair<T, List<string>> kvp = DBOrmUtils.ConvertToObject<T>(res.resultData.Rows[0], connectionID, transactionID);
        //        if (kvp.Value.Count > 0)
        //        {
        //            string error = "";
        //            kvp.Value.ForEach(e => error += e);
        //            throw new Exception(error);
        //        }
        //        return kvp.Key;
        //    }
        //}

        ///// <summary> Метод возвращает из запроса объект C# с теми же полями, что и поля запроса в строке row, 
        ///// т.е будет заполнен объект с такими же открытыми свойствами, что и результирующие поля запроса. 
        ///// </summary>
        ///// <typeparam name="T"></typeparam>
        ///// <param name="row"></param>
        ///// <param name="connectionID"></param>
        ///// <param name="transactionID"></param>
        ///// <returns></returns>
        //public static KeyValuePair<T, List<string>> ConvertToObject<T>(DataRow row, IDbConnection connectionID, IDbTransaction transactionID = null)
        //    where T : class, new()
        //{
        //    T obj = new T();
        //    List<string> errors = new List<string>();
        //    Type type = typeof(T);

        //    foreach (DataColumn column in row.Table.Columns)
        //    {
        //        string name = column.ColumnName;
        //        PropertyInfo pi = type.GetProperty(name);
        //        try
        //        {
        //            if (pi == null)
        //            {
        //                errors.Add(string.Format(
        //                    "Не найдено открытое свойство '{0}' в классе '{1}'!",
        //                    name,
        //                    type.Name
        //                ));
        //            }
        //            else if (!pi.CanWrite)
        //            {
        //                errors.Add(string.Format(
        //                   "Свойство '{0}' в классе '{1}' неизменяемо!",
        //                   name,
        //                   type.Name
        //               ));
        //            }
        //            else
        //            {
        //                MethodInfo method = typeof(DBOrmUtils).GetMethod("FieldValue", BindingFlags.Public | BindingFlags.Static);
        //                MethodInfo generic = method.MakeGenericMethod(pi.PropertyType);

        //                var value = generic.Invoke(null, new object[] { row, name, pi.PropertyType.GetDefaultValue() });
        //                pi.SetValue(obj, value, null);
        //            }
        //        }
        //        catch (Exception ex)
        //        {
        //            if (pi.PropertyType != column.DataType)
        //            {
        //                errors.Add(string.Format(
        //                    "При чтении свойства '{0}' в классе '{1}' вылетело исключение: тип свойства в классе '{2}', а тип данных из БД '{3}'",
        //                    name,
        //                    type.Name,
        //                    pi.PropertyType.Name,
        //                    column.DataType.Name
        //                ));
        //            }
        //            else
        //            {
        //                errors.Add(string.Format(
        //                    "При чтении свойства '{0}' в классе '{1}' вылетело исключение: '{2}'",
        //                    name,
        //                    type.Name,
        //                    ex.Message
        //                ));
        //            }
        //        }
        //    }
        //    ReflectionUtilities.TrimStringFields<T>(obj);
        //    return new KeyValuePair<T, List<string>>(obj, errors);
        //}

        #region Вспомогательные методы, созданные для общего ускорения и оптимизации действия маппера
        private static KeyValuePair<Dictionary<string, TypeProperty>, List<string>> PrepareTypes<T>(DataTable table, Dictionary<string, string> mapping = null)
        {
            Dictionary<string, TypeProperty> properties = new Dictionary<string, TypeProperty>();

            Dictionary<string, Type> objectDictionary = GetDataObjectTypesDictionary<T>();
            Dictionary<string, Type> tableDictionary = GetDataTableTypesDictionary(table);

            if (mapping == null)
            {
                mapping = new Dictionary<string, string>();
                foreach (string name in objectDictionary.Keys)
                {
                    mapping.Add(name, name);
                }
            }

            MethodInfo fieldValueMethod = typeof(DBOrmUtils).GetMethod("FieldValue", BindingFlags.Public | BindingFlags.Static);
            Dictionary<string, MethodInfo> fieldValueMethods = new Dictionary<string, MethodInfo>();
            foreach (string str in objectDictionary.Keys)
            {
                fieldValueMethods.Add(str, fieldValueMethod.MakeGenericMethod(objectDictionary[str]));
            }

            List<string> errors = new List<string>();
            foreach (string objectFieldName in mapping.Keys)
            {
                string tableFieldName = mapping[objectFieldName].ToUpper();
                if (!tableDictionary.ContainsKey(tableFieldName))
                {
                    errors.Add(string.Format(
                            "Не найдено поле с именем '{0}' в запросе!",
                            tableFieldName
                        ));
                }
                else if (!objectDictionary.ContainsKey(objectFieldName))
                {
                    errors.Add(string.Format(
                           "Не найдено открытое свойство '{0}' в классе '{1}'!",
                           objectFieldName,
                           typeof(T).Name
                       ));
                }
                else if (!objectDictionary[objectFieldName].IsAssignableFrom(tableDictionary[tableFieldName]))
                {
                    errors.Add(string.Format(
                            "При чтении свойства '{0}' в классе '{1}' возникла проблема приведения типов: тип свойства в классе '{2}', а тип данных из БД '{3}'",
                            objectFieldName,
                            typeof(T).Name,
                            objectDictionary[objectFieldName].Name,
                            tableDictionary[tableFieldName].Name
                        ));
                }

                properties.Add(tableFieldName, new TypeProperty()
                {
                    objectType = objectDictionary[objectFieldName],
                    tableType = tableDictionary[tableFieldName],
                    fieldValueMethod = fieldValueMethods[objectFieldName],
                    defaultValue = objectDictionary[objectFieldName].GetDefaultValue(),
                    objectProperty = typeof(T).GetProperty(objectFieldName),
                    needToTrim = objectDictionary[objectFieldName] == typeof(string)
                });
            }
            return new KeyValuePair<Dictionary<string, TypeProperty>, List<string>>(properties, errors);
        }

        private static KeyValuePair<T, List<string>> ConvertToObject<T>(DataRow row, Dictionary<string, TypeProperty> typeProperties, IDbConnection connectionID, IDbTransaction transactionID = null)
            where T : class, new()
        {
            T obj = new T();
            List<string> errors = new List<string>();

            foreach (DataColumn column in row.Table.Columns)
            {
                try
                {
                    string tableFieldName = column.ColumnName.ToUpper();
                    TypeProperty property = typeProperties[tableFieldName];
                    var value = property.fieldValueMethod.Invoke(null, new object[] { row, tableFieldName, property.defaultValue });
                    if (property.needToTrim) value = ((string)value).TrimIfNotNull();
                    property.objectProperty.SetValue(obj, value, null);
                }
                catch (Exception ex)
                {
                    errors.Add(ex.Message);
                }
            }
            return new KeyValuePair<T, List<string>>(obj, errors);
        }

        private static Dictionary<string, Type> GetDataObjectTypesDictionary<T>()
        {
            Dictionary<string, Type> dictionary = new Dictionary<string, Type>();
            foreach (PropertyInfo pi in typeof(T).GetProperties())
            {
                dictionary.Add(pi.Name, pi.PropertyType);
            }
            return dictionary;
        }

        private static Dictionary<string, Type> GetDataTableTypesDictionary(DataTable table)
        {
            Dictionary<string, Type> dictionary = new Dictionary<string, Type>();
            foreach (DataColumn column in table.Columns)
            {
                dictionary.Add(column.ColumnName.ToUpper(), column.DataType);
            }
            return dictionary;
        }
        #endregion Вспомогательные методы, созданные для общего ускорения и оптимизации действия маппера
    }
}
