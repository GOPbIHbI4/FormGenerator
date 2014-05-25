using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.Models
{
    public class DictionaryField:DictionaryFieldModel
    {
        public DictionaryField(DictionaryFieldModel dictionaryField_, bool primaryKey_)
            : base()
        {
            this.columnName = dictionaryField_.columnName;
            this.dictionaryID = dictionaryField_.dictionaryID;
            this.domainValueTypeID = dictionaryField_.domainValueTypeID;
            this.ID = dictionaryField_.ID;
            this.name = dictionaryField_.name;
            this.primaryKey = primaryKey_;
        }
        public bool primaryKey { get; set; }
    }
}
