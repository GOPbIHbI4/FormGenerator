using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.Models
{
    public class ControlTypeModel
    {
        public int ID { get; set; }
        // name -> component
        public string component { get; set; }
        public int controlTypeGroupID { get; set; }
        public string path { get; set; }
        public string description { get; set; }
    }
}
