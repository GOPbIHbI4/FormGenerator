﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.Models
{
    public class EventType : EventTypeModel
    {
        //public int ID { get; set; }
        //public string name { get; set; }
        public int controlTypeID { get; set; }
        public int eventTypeID { get; set; }
    }
}
