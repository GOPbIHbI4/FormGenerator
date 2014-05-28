using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.Models
{
    public class Query : QueryModel
    {
        public Query(QueryModel query, QueryTypeModel queryType, List<QueryInParameter> inParameters_, List<QueryOutParameter> outParameters_)
        {
            this.ID = query.ID;
            this.queryTypeID = query.queryTypeID;
            this.sqlText = queryType.sqlText;
            this.inParameters = inParameters_;
            this.outParameters = outParameters_;
        }
        public string sqlText { get; set; }
        public List<QueryInParameter> inParameters { get; set; }
        public List<QueryOutParameter> outParameters { get; set; }
    }
}
