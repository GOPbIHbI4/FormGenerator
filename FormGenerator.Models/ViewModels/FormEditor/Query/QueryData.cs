using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.Models
{
    public class QueryData
    {
        public int? queryID { get; set; }
        public int? queryOutKeyID { get; set; }
        public int? queryOutValueID { get; set; }
        public int? saveField { get; set; }
    }
}
