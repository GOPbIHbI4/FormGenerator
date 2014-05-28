using FormGenerator.Models;
using FormGenerator.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.Models
{
    public static class ValueTypesConverter
    {
        private static AValueType GetValueTypeByID(int valueTypeID)
        {
            AValueType result = null;
            switch (valueTypeID)
            {
                case 1:
                    result = new StringValueType();
                    break;
                case 2:
                    result = new DoubleValueType();
                    break;
                case 3:
                    result = new IntValueType();
                    break;
                case 4:
                    result = new DateValueType();
                    break;
                default:
                    result = new StringValueType();
                    break;
            }
            return result;
        }

        public static AValueType Initialize(string obj, int valueTypeID, bool initialized = true)
        {
            AValueType result = GetValueTypeByID(valueTypeID);
            result.Initialize(obj, initialized);
            return result;
        }

        public static AValueType Convert(AValueType obj, int valueTypeID)
        {
            AValueType result = GetValueTypeByID(valueTypeID);
            result.Initialize(obj.Serialize(), true);
            return result;
        }
    }
}
