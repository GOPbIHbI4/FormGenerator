using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.Models
{
    public class ActionModel
    {
        public int ID { get; set; }
        public int eventID { get; set; }
        public int orderNumber { get; set; }
        public int actionTypeID { get; set; }
    }
}
