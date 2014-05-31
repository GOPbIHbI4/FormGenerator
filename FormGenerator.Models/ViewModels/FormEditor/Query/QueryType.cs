using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.Models
{
    public class FullQueryType
    {
        public QueryTypeModel queryType { get; set; }
        public List<QueryInParameterModel> inParams { get; set; }
        public List<QueryOutParameterModel> outParams { get; set; }
    }
}
