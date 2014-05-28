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
    public class ControlListEntity : ControlModel
    {
        public string controlType { get; set; }
    }
}
