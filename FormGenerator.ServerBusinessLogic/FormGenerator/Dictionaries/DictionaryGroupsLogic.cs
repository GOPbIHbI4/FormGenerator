using FormGenerator.Models;
using FormGenerator.ServerDataAccess;
using FormGenerator.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.ServerBusinessLogic
{
    public class DictionaryGroupsLogic
    {
        public ResponseObjectPackage<List<DictionaryGruopModel>> GetAllDictionaryGroups()
        {
            RequestObjectPackage<DictionaryGroupSearchTemplate> request = new RequestObjectPackage<DictionaryGroupSearchTemplate>()
            {
                requestData = new DictionaryGroupSearchTemplate()
            };
            ResponseObjectPackage<List<DictionaryGruopModel>> response = new DBUtils().RunSqlAction(DictionaryGroupsRepository.GetBySearchTemplate, request);
            return response;
        }

        public ResponseObjectPackage<List<DictionaryTreeItem>> GetDictionariesTree()
        {
            List<DictionaryGruopModel> dictGroups = this.GetAllDictionaryGroups().GetDataOrExceptionIfError();
            List<DictionaryModel> dicts = new DictionariesLogic().GetAllDictionaries().GetDataOrExceptionIfError();

            List<DictionaryTreeItem> list = new List<DictionaryTreeItem>();
            Func<DictionaryGruopModel, DictionaryTreeItem> fillDictionaryGroup = null;
            fillDictionaryGroup = (g) =>
            {
                DictionaryTreeItem thisItem = new DictionaryTreeItem(g);
                foreach (DictionaryGruopModel group_ in dictGroups.Where(e => e.dictionaryGroupID_Parent == g.ID))
                {
                    thisItem.children.Add(fillDictionaryGroup(group_));
                }
                foreach (DictionaryModel dict_ in dicts.Where(e => e.dictionaryGroupID == g.ID))
                {
                    thisItem.children.Add(new DictionaryTreeItem(dict_));
                }
                return thisItem;
            };

            foreach (DictionaryGruopModel group in dictGroups.Where(e => e.dictionaryGroupID_Parent == null))
            {
                list.Add(fillDictionaryGroup(group));
            }
            return new ResponseObjectPackage<List<DictionaryTreeItem>>() { resultData = list };
        }
    }
}
