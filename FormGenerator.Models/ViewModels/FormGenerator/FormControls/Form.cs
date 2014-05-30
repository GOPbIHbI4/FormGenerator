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
        public Dictionary dictionary { get; set; }
        public Control window { get; set; }
        public List<QueryType> queries { get; set; }
        public List<FormInParameterModel> inParameters { get; set; }
        public List<FormOutParameterModel> outParameters { get; set; }
    }
}
