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
    public class DictionaryFieldsLogic
    {
        public ResponseObjectPackage<DictionaryFieldModel> GetDictionaryFieldByID(int ID)
        {
            RequestObjectPackage<DictionaryFieldSearchTemplate> request = new RequestObjectPackage<DictionaryFieldSearchTemplate>()
            {
                requestData = new DictionaryFieldSearchTemplate()
                {
                    ID = ID
                }
            };
            ResponseObjectPackage<List<DictionaryFieldModel>> response = new DBUtils().RunSqlAction(DictionaryFieldsRepository.GetBySearchTemplate, request);
            DictionaryFieldModel field = response.GetDataOrExceptionIfError().First();
            return new ResponseObjectPackage<DictionaryFieldModel>() { resultData = field };
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
            List<DictionaryForeignKeyModel> fkList = new DictionaryForeignKeysLogic().GetDictionaryForeignKeysByDictionaryIDSource(dictionaryID).GetDataOrExceptionIfError();

            List<DictionaryField> fieldsWithPk = new List<DictionaryField>();
            foreach (DictionaryFieldModel field in fields)
            {
                DictionaryFieldModel foreignKey = fkList
                     .Where(fk => fk.dictionaryFieldIDSource == field.ID)
                     .Select(fks => new DictionaryFieldsLogic().GetDictionaryFieldByID(fks.dictionaryFieldIDDestination).GetDataOrExceptionIfError()).FirstOrDefault();
                bool isPrimaryKey = field.ID == pk.dictionaryFieldID;
                fieldsWithPk.Add(new DictionaryField(field, isPrimaryKey, foreignKey));
            }

            return new ResponseObjectPackage<List<DictionaryField>>() { resultData = fieldsWithPk };
        }

    }
}
