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
        public List<SaveEvent> events { get; set; }
    }

    public class SaveFormModel
    {
        public List<FormParams> inParams { get; set; }
        public List<FormParams> outParams { get; set; }
        public FormModel form { get; set; }
        public SaveControlModel control { get; set; }
    }

    public class FormParams
    {
        public int? ID { get; set; }
        public string name { get; set; }
        public string controlName { get; set; }
        public int? controlID { get; set; }
    }

}
