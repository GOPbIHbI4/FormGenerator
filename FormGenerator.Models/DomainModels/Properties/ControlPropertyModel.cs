using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.Models
{
    public class ControlPropertyModel
    {
        public int ID { get; set; }
        public int controlID { get; set; }
        public int controlPropertyTypeID { get; set; }
        public string value { get; set; }
    }
}
