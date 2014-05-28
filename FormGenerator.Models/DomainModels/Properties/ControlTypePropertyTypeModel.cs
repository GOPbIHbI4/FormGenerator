using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.Models
{
    public class ControlTypePropertyTypeModel
    {
        public int ID { get; set; }
        public int controlTypeID { get; set; }
        public int controlPropertyTypeID { get; set; }
        public string defaultValue { get; set; }
    }
}
