using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.Models
{
    public class Control
    {
        public int ID { get; set; }
        public int controlTypeID { get; set; }
        public int? controlIDParent { get; set; }
        public int? formID { get; set; }
        public int orderNumber { get; set; }

        public List<ControlProperty> properties { get; set; }
        public List<Control> children { get; set; }
        public List<ControlQueryMappingModel> controlQueryMappings { get; set; }
        public List<ControlDictionaryMappingModel> controlDictionaryMappings { get; set; }
    }
}
