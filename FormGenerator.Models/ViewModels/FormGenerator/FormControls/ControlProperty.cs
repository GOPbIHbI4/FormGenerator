using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.Models
{
    public class ControlProperty
    {
        public int ID { get; set; }
        public int controlID { get; set; }
        public int controlPropertyTypeID { get; set; }
        public int domainValueTypeID { get; set; }
        public int domainValueTypeIDData { get; set; }
        public string name { get; set; }
        public AValueType value { get; set; }
    }
}
