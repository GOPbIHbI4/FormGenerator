using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.Models
{
    public class Form
    {
        public int ID { get; set; }
        public Control window { get; set; }
        public List<QueryType> queries { get; set; }
    }
}
