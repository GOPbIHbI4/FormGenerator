using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.Models
{
    public class EventActionParameter
    {
        public int ID { get; set; }
        public int actionID { get; set; }
        public int actionParameterTypeID { get; set; }
        public int controlID { get; set; }
        public string name { get; set; }
        public int domainValueTypeID { get; set; }
    }
}
