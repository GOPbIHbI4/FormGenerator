using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.Models
{
    public class DictionaryForeignKeyModel
    {
        public int ID { get; set; }
        public int dictionaryFieldIDSource { get; set; }
        public int dictionaryFieldIDDestination { get; set; }
    }
}
