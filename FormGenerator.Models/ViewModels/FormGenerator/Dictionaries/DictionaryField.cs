using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.Models
{
    public class DictionaryField:DictionaryFieldModel
    {
        public DictionaryField(DictionaryFieldModel dictionaryField_, bool primaryKey_, DictionaryFieldModel dictionaryFieldModelForeignKey_ = null)
            : base()
        {
            this.columnName = dictionaryField_.columnName;
            this.dictionaryID = dictionaryField_.dictionaryID;
            this.domainValueTypeID = dictionaryField_.domainValueTypeID;
            this.ID = dictionaryField_.ID;
            this.name = dictionaryField_.name;
            this.primaryKey = primaryKey_;
            this.foreignKey = dictionaryFieldModelForeignKey_;
        }
        public bool primaryKey { get; set; }
        public DictionaryFieldModel foreignKey { get; set; }
    }
}
