﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.Models
{
    public class DictionaryGroupSearchTemplate
    {
        public int? ID { get; set; }
        public string name { get; set; }
        public int? dictionaryGroupID_Parent { get; set; }
        public int? dictionaryGroupID_Root { get; set; }
    }
}
