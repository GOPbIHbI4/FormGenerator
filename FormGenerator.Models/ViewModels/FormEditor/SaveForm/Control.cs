using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.Models
{
    public class SaveControlModel
    {
        public ControlModel control { get; set; }
        public string name { get; set; }
        public List<ControlPropertyViewModel> properties { get; set; }
        public List<SaveControlModel> items { get; set; }
        public QueryData data { get; set; }
        public List<QueryViewModel> queries { get; set; }
        public List<QueryInParam> queryInParams { get; set; }
    }
}
