﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.Models
{
    public class ActionTypeProperty
    {
        public int ID { get; set; }
        public int actionTypeID { get; set; }
        public int value { get; set; }
        public int actionKindPropertyID { get; set; }
        public string name { get; set; }
    }
}