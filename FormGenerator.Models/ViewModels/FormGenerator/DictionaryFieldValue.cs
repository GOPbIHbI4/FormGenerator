using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.Models
{
    public class DictionaryFieldValue
    {
        public DictionaryFieldValue(DictionaryField dictionaryField_, object value_, bool initialized = true)
        {
            this.dictionaryField = dictionaryField_;
            string str = value_ == null ? null : value_.ToString();
            this.value = ValueTypesConverter.Initialize(str, dictionaryField_.domainValueTypeID, initialized);
        }

        public DictionaryField dictionaryField { get; set; }
        public AValueType value { get; set; }
    }
}
