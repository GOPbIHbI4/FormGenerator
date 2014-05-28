using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.Models
{
    public class QueryType
    {
        public int queryID { get; set; }
        public List<QueryQueryInParameterModel> inParametersMapping { get; set; }
    }
}
