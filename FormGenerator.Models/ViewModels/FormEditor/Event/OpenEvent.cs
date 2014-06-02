using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.Models
{
    public class OpenEvent
    {
        public int? ID { get; set; }
        public string name { get; set; }
        public int? controlID { get; set; }
        public string controlName { get; set; } // имя контрола - хозяина
        public int eventTypeID { get; set; }
        public int? controlTypeID { get; set; }
        public List<OpenAction> actions { get; set; }

        public OpenEvent()
        {
            this.actions = new List<OpenAction>();
        }
    }

    public class OpenAction
    {
        public int? ID { get; set; }
        public string name { get; set; }
        public int orderNumber { get; set; }
        public int? eventID { get; set; }
        public int actionTypeID { get; set; }
        public List<OpenActionParam> parameters { get; set; }

        public OpenAction()
        {
            this.parameters = new List<OpenActionParam>();
        }
    }

    public class OpenActionParam
    {
        public int? ID { get; set; }
        public string name { get; set; }
        public string value { get; set; }
        public int actionID { get; set; }
        public int actionInParamTypeID { get; set; }
        public int? controlID { get; set; }
        public string controlName { get; set; } // имя контрола - ссылки
    }
}
