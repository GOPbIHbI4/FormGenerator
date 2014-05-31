using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.Models
{
    public class QueryViewModel : QueryModel
    {
        //public int ID { get; set; }
        //public int queryTypeID { get; set; }
        public int? _ID { get; set; }
    }

    public class QueryInParam
    {
        public int? ID { get; set; }
        public int? queryInParameterID { get; set; }
        public string queryInParameterName { get; set; }
        public string controlName { get; set; }
        public int? queryID { get; set; }
        public int? query_ID { get; set; }
        public int? controlID { get; set; }
    }
}
