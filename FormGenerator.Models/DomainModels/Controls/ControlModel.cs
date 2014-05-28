using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.Models
{
    public class ControlModel
    {
        public int ID { get; set; }
        public int controlTypeID { get; set; }
        public int? controlIDParent { get; set; }
        public int? formID { get; set; }
        public int orderNumber { get; set; }
    }
}
