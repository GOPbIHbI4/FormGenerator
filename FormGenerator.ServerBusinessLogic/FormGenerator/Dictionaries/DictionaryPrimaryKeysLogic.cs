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
    public class DictionaryPrimaryKeysLogic
    {
        public ResponseObjectPackage<DictionaryPrimaryKeyModel> GetDictionaryPrimaryKeyByDictionaryID(int dictionaryID)
        {
            RequestObjectPackage<DictionaryPrimaryKeySearchTemplate> request = new RequestObjectPackage<DictionaryPrimaryKeySearchTemplate>()
            {
                requestData = new DictionaryPrimaryKeySearchTemplate()
                {
                    dictionaryID = dictionaryID
                }
            };
            ResponseObjectPackage<List<DictionaryPrimaryKeyModel>> response = new DBUtils().RunSqlAction(DictionaryPrimaryKeysRepository.GetBySearchTemplate, request);
            DictionaryPrimaryKeyModel pk = response.GetDataOrExceptionIfError().First();
            return new ResponseObjectPackage<DictionaryPrimaryKeyModel>() { resultData = pk };
        }
    }
}
