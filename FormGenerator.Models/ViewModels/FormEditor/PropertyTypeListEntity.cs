using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.Models
{
    public class PropertyTypeListEntity : ControlTypePropertyTypeModel
    {
        public string property { get; set; }
        public int logicValueTypeID { get; set; }

        /// <summary>
        /// Функция, задающая верный тип значения свойства по умолчанию, т.к. в базе все хранится в формате строки
        /// </summary>
        public object GetRightDefaultValue()
        {
            if (string.IsNullOrEmpty(this.defaultValue))
            {
                return "";
            }
            if (this.logicValueTypeID == 2 || this.logicValueTypeID == 5)
            {
                decimal temp;
                if (decimal.TryParse(this.defaultValue, out temp))
                {
                    return temp;
                }
                else
                {
                    return "";
                }
            }
            else if (this.logicValueTypeID == 3 || this.logicValueTypeID == 6)
            {
                int temp;
                if (int.TryParse(this.defaultValue, out temp))
                {
                    return temp;
                }
                else
                {
                    return "";
                }
            }
            else if (this.logicValueTypeID == 4 || this.logicValueTypeID == 7)
            {
                DateTime temp;
                if (DateTime.TryParse(this.defaultValue, out temp))
                {
                    return temp;
                }
                else
                {
                    return "";
                }
            }
            else if (this.logicValueTypeID == 8 || this.logicValueTypeID == 9)
            {
                Boolean temp;
                if (Boolean.TryParse(this.defaultValue, out temp))
                {
                    return temp;
                }
                else
                {
                    return "";
                }
            }
            else
            {
                return this.defaultValue;
            }
        }
    }
}
