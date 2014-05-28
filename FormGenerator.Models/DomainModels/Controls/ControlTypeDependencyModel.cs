using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.Models
{
    public class ControlTypeDependencyModel
    {
        public int ID { get; set; }
        public int controlTypeIDParent { get; set; }
        public int controlTypeIDChild { get; set; }
    }
}
