﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.Models
{
    public class DictionarySearchTemplate
    {
        public int? ID { get; set; }
        public string name { get; set; }
        public string tableName { get; set; }
        public int? dictionaryGroupID { get; set; }
    }
}
