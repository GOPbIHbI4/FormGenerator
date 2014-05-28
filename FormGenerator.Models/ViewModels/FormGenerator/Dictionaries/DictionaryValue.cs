using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.Models
{
    public class DictionaryValue
    {
        public DictionaryValue(DictionaryModel dictionary_, List<DictionaryFieldValue> fields_)
        {
            this.dictionary = dictionary_;
            this.fields = fields_;
        }

        public DictionaryValue(Dictionary dictionary_, Dictionary<string, string> row)
        {
            this.dictionary = dictionary_;
            this.fields = new List<DictionaryFieldValue>();
            foreach (DictionaryField field in dictionary_.fields)
            {
                DictionaryFieldValue item = null;
                if (row.ContainsKey(field.columnName))
                {
                    item = new DictionaryFieldValue(field, row[field.columnName]);
                }
                else
                {
                    item = new DictionaryFieldValue(field, null, false);
                }

                this.fields.Add(item);
            }
        }

        public DictionaryModel dictionary { get; set; }
        public List<DictionaryFieldValue> fields { get; set; }

        public DictionaryFieldValue GetPrimaryKey()
        {
            return this.fields.Where(e => e.dictionaryField.primaryKey).First();
        }
    }
}
