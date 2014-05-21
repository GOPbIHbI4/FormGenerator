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
    public class DictionariesLogic
    {
        public ResponseObjectPackage<List<DictionaryModel>> GetAllDictionaries()
        {
            RequestObjectPackage<DictionarySearchTemplate> request = new RequestObjectPackage<DictionarySearchTemplate>()
            {
                requestData = new DictionarySearchTemplate()
            };
            ResponseObjectPackage<List<DictionaryModel>> response = new DBUtils().RunSqlAction(DictionariesRepository.GetBySearchModel, request);
            return response;
        }

        public ResponseObjectPackage<List<DictionaryFieldModel>> GetDictionaryFieldsByDictionaryID(int dictionaryID)
        {
            RequestObjectPackage<DictionaryFieldSearchTemplate> request = new RequestObjectPackage<DictionaryFieldSearchTemplate>()
            {
                requestData = new DictionaryFieldSearchTemplate() 
                {
                    dictionaryID = dictionaryID
                }
            };
            ResponseObjectPackage<List<DictionaryFieldModel>> response = new DBUtils().RunSqlAction(DictionaryFieldsRepository.GetBySearchTemplate, request);
            return response;
        }
    }
}
