using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.Models
{
    public class SaveEvent
    {
        public int? ID { get; set; }
        public int? controlID { get; set; }
        public string controlName { get; set; } // имя контрола - хозяина
        public int eventTypeID { get; set; }
        public List<SaveAction> actions { get; set; }

        public SaveEvent()
        {
            this.actions = new List<SaveAction>();
        }
    }

    public class SaveAction
    {
        public int? ID { get; set; }
        public int orderNumber { get; set; }
        public int? eventID { get; set; }
        public int actionTypeID { get; set; }
        public List<SaveActionParam> parameters { get; set; }

        public SaveAction()
        {
            this.parameters = new List<SaveActionParam>();
        }
    }

    public class SaveActionParam
    {
        public int? ID { get; set; }
        public int actionID { get; set; }
        public int actionInParamTypeID { get; set; }
        public int? controlID { get; set; }
        public string controlName { get; set; } // имя контрола - ссылки
    }
}
