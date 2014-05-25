using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.Models
{
    public class DictionaryTreeItem
    {
        private DictionaryTreeItem()
        {
            this.children = new List<DictionaryTreeItem>();
        }
        public DictionaryTreeItem(DictionaryGruopModel group)
            : this()
        {
            this.ID = group.ID;
            this.text = group.name;
            this.leaf = false;
        }
        public DictionaryTreeItem(DictionaryModel dict)
            : this()
        {
            this.ID = dict.ID;
            this.text = dict.name;
            this.leaf = true;
        }

        public int ID { get; set; }
        public string text { get; set; }
        public bool leaf { get; set; }
        public List<DictionaryTreeItem> children { get; set; }
    }
}
