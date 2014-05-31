using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.Models
{
    public class DictionaryFieldAdminModel
    {
        public int ID { get; set; }
        public string name { get; set; }
        public string columnName { get; set; }
        public int dictionaryID { get; set; }
        public int domainValueTypeID { get; set; }
        public string domainValueTypeName { get; set; }
        public int? pkID { get; set; }
        public int? fkID { get; set; }
        public bool primaryKey { get; set; }
        public string fkDictionaryFieldName { get; set; }
        public string fkDictionaryName { get; set; }

        public void SetPK() 
        {
            if (this.pkID.HasValue)
            {
                this.primaryKey = true;
            }
        }
    }
}
