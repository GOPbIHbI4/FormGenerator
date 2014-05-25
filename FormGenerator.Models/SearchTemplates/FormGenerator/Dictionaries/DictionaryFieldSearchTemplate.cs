using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.Models
{
    public class DictionaryFieldSearchTemplate
    {
        public int? ID { get; set; }
        public string name { get; set; }
        public string columnName { get; set; }
        public int? dictionaryID { get; set; }
        public int? domainValueTypeID { get; set; }
    }
}
