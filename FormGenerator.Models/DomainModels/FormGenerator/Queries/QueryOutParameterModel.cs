using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.Models
{
    public class QueryOutParameterModel
    {
        public int ID { get; set; }
        public string name { get; set; }
        public int queryTypeID { get; set; }
        public int domainValueTypeID { get; set; }
    }
}
