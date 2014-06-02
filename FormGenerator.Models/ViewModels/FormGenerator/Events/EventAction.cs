using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.Models
{
    public class EventAction
    {
        public int ID { get; set; }
        public int eventID { get; set; }
        public int orderNumber { get; set; }
        public int actionTypeID { get; set; }

        public int? actionKindID { get; set; }
        public List<ActionTypeProperty> properties { get; set; }
        public List<EventActionParameter> parameters { get; set; }
    }
}
