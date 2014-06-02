using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.Models
{
    public class OpenControlModel
    {
        public ControlListEntity control { get; set; }
        public string name { get; set; }
        public List<ControlPropertyViewModel> properties { get; set; }
        public List<OpenControlModel> items { get; set; }
        public List<OpenEvent> events { get; set; }
        public QueryData data { get; set; }

        public OpenControlModel()
        {
            this.items = new List<OpenControlModel>();
            this.properties = new List<ControlPropertyViewModel>();
        }
    }

    public class OpenFormModel
    {
        public FormListEntity form { get; set; }
        public OpenControlModel root { get; set; }
        public List<OpenQuery> queries { get; set; }
    }
}
