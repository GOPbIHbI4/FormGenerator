using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.Models
{
    public class Dictionary : DictionaryModel
    {
        public Dictionary(DictionaryModel dictionaryModel_, List<DictionaryField> fields_)
            : base()
        {
            this.dictionaryGroupID = dictionaryModel_.dictionaryGroupID;
            this.ID = dictionaryModel_.ID;
            this.name = dictionaryModel_.name;
            this.tableName = dictionaryModel_.tableName;
            this.fields = fields_;
        }
        public List<DictionaryField> fields { get; set; }

        public DictionaryField GetPrimaryKey() 
        {
            return this.fields.Where(e => e.primaryKey).First();
        }

    }
}
