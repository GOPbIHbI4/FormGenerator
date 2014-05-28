using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.Models
{
    public class ControlPropertyViewModel : ControlPropertyModel
    {
        public string property { get; set; }
        public int controlTypeID { get; set; }
        public int logicValueTypeID { get; set; }
        // значение свойства в верном формате (верного типа)
        public object _value { get; set; }

        /// <summary>
        /// Функция, задающая верный тип значения свойства по умолчанию, т.к. в базе все хранится в формате строки
        /// </summary>
        public object GetRightValue()
        {
            if (string.IsNullOrEmpty(this.value))
            {
                return "";
            }
            if (this.logicValueTypeID == 2 || this.logicValueTypeID == 5)
            {
                decimal temp;
                if (decimal.TryParse(this.value, out temp))
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
                if (int.TryParse(this.value, out temp))
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
                if (DateTime.TryParse(this.value, out temp))
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
                if (Boolean.TryParse(this.value, out temp))
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
                return this.value;
            }
        }
    }
}
