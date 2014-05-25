using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.Utilities
{
    public static class DataTableExtensions
    {
        public static List<Dictionary<string, object>> ToListOfDictionaries(this DataTable t)
        {
            List<Dictionary<string, object>> list = new List<Dictionary<string, object>>();
            foreach (DataRow row in t.Rows)
            {
                Dictionary<string,object> currentDict = new Dictionary<string,object>();
                foreach (DataColumn column in t.Columns)
                {
                    currentDict.Add(column.ColumnName, row[column]);
                }
                list.Add(currentDict);
            }
            return list;
        }
    }
}
