using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.Models
{
    public class Event
    {
        public int ID { get; set; }
        public int controlID { get; set; }
        public int eventTypeID { get; set; }
        public List<EventAction> actions { get; set; }
    }
}
