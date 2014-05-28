using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.Models
{
    /// <summary>
    /// Класс, описывающий элемент списка форм (форму)
    /// </summary>
    public class ControlTypeListEntity : ControlTypeModel
    {
        public List<string> childComponents { get; set; }
        public string group { get; set; }
        public string icon { get; set; }
        public Dictionary<string, object> properties { get; set; }

        public ControlTypeListEntity()
        {
            this.childComponents = new List<string>();
            this.properties = new Dictionary<string, object>();
        }

        /// <summary>
        /// Функция, задающая элементу ControlTypeListEntity расположение иконки
        /// </summary>
        public void SetComponentIcon()
        {
            string path = @"Scripts/resources/icons/editor/";
            string png = ".png";
            if (this.component.ToLower().StartsWith("container"))
            {
                this.icon = path + "container" + png;
            }
            else
            {
                this.icon = path + this.component.ToLower() + png;
            }
        }
    }
}
