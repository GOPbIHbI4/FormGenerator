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
            ResponseObjectPackage<List<DictionaryModel>> response = new DBUtils().RunSqlAction(DictionariesRepository.GetBySearchTemplate, request);
            return response;
        }

        public ResponseObjectPackage<DictionaryModel> GetDictionaryByID(int dictionaryID)
        {
            RequestObjectPackage<DictionarySearchTemplate> request = new RequestObjectPackage<DictionarySearchTemplate>()
            {
                requestData = new DictionarySearchTemplate()
                {
                    ID = dictionaryID
                }
            };
            ResponseObjectPackage<List<DictionaryModel>> response = new DBUtils().RunSqlAction(DictionariesRepository.GetBySearchTemplate, request);
            DictionaryModel dictionary = response.GetDataOrExceptionIfError().First();
            return new ResponseObjectPackage<DictionaryModel>() { resultData = dictionary };
        }

        public ResponseObjectPackage<Dictionary> GetDictionaryViewModel(int dictionaryID)
        {
            DictionaryModel dict = this.GetDictionaryByID(dictionaryID).GetDataOrExceptionIfError();
            List<DictionaryField> fields = new DictionaryFieldsLogic().GetDictionaryFieldsViewModel(dictionaryID).GetDataOrExceptionIfError();
            Dictionary dictionary = new Dictionary(dict, fields);
            return new ResponseObjectPackage<Dictionary>() { resultData = dictionary };
        }
    }
}
