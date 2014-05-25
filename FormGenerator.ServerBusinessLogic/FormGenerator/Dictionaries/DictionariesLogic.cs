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

        public ResponseObjectPackage<List<DictionaryField>> GetDictionaryFieldsViewModel(int dictionaryID)
        {
            List<DictionaryFieldModel> fields = this.GetDictionaryFieldsByDictionaryID(dictionaryID).GetDataOrExceptionIfError();
            DictionaryPrimaryKeyModel pk = new DictionaryPrimaryKeysLogic().GetDictionaryPrimaryKeyByDictionaryID(dictionaryID).GetDataOrExceptionIfError();
            List<DictionaryField> fieldsWithPk = fields.Select(e => new DictionaryField(e, e.ID == pk.dictionaryFieldID)).ToList();
            return new ResponseObjectPackage<List<DictionaryField>>() { resultData = fieldsWithPk };
        }

        public ResponseObjectPackage<Dictionary> GetDictionaryViewModel(int dictionaryID)
        {
            DictionaryModel dict = this.GetDictionaryByID(dictionaryID).GetDataOrExceptionIfError();
            List<DictionaryField> fields = this.GetDictionaryFieldsViewModel(dictionaryID).GetDataOrExceptionIfError();
            Dictionary dictionary = new Dictionary(dict, fields);
            return new ResponseObjectPackage<Dictionary>() { resultData = dictionary };
        }
    }
}
