using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.Models
{
    public class QueryInParameter:QueryInParameterModel
    {
        public QueryInParameter(QueryInParameterModel model_, AValueType value_)
        {
            this.domainValueTypeID = model_.domainValueTypeID;
            this.ID = model_.ID;
            this.name = model_.name;
            this.queryTypeID = model_.queryTypeID;
            this.value = value_;
        }
        public AValueType value { get; set; }
    }
}
