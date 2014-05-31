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
    public class DictionaryTypeAdministratorLogic
    {
        public ResponseObjectPackage<List<DictionaryFieldAdminModel>> GetDictionaryTypesAdministratorData(int dictionaryID)
        {
            RequestPackage request = new RequestPackage()
            {
                requestID = dictionaryID
            };

            ResponseObjectPackage<List<DictionaryFieldAdminModel>> response = new DBUtils().RunSqlAction(new DictionaryTypesAdministrator().GetDictionaryTypesAdministratorData, request);
            response.ThrowExceptionIfError();
            return response;
        }

        public ResponseObjectPackage<List<DomainValueTypeModel>> GetDomainValueTypes()
        {
            RequestPackage request = new RequestPackage();
            ResponseObjectPackage<List<DomainValueTypeModel>> response = new DBUtils().RunSqlAction(DomainValueTypesRepository.GetAll, request);
            response.ThrowExceptionIfError();
            return response;
        }
        public ResponseObjectPackage<DictionaryFieldModel> GetDictionaryFieldByID(int dictionaryFieldID)
        {
            RequestObjectPackage<DictionaryFieldSearchTemplate> request = new RequestObjectPackage<DictionaryFieldSearchTemplate>()
            {
                requestData = new DictionaryFieldSearchTemplate()
                {
                    ID = dictionaryFieldID
                }
            };
            DictionaryFieldModel response = new DBUtils().RunSqlAction(DictionaryFieldsRepository.GetBySearchTemplate, request).GetDataOrExceptionIfError().First();
            return new ResponseObjectPackage<DictionaryFieldModel>() { resultData = response };
        }

        public ResponsePackage SaveDictionaryGroup(DictionaryGruopModel group)
        {
            RequestObjectPackage<DictionaryGruopModel> request = new RequestObjectPackage<DictionaryGruopModel>()
            {
                requestData = group
            };

            ResponsePackage response = new DBUtils().RunSqlAction(DictionaryGroupsRepository.SaveDictionaryGroup, request);
            response.ThrowExceptionIfError();
            return response;
        }

        public ResponsePackage DeleteDictionaryGroup(int dictionaryGroupID)
        {
            RequestPackage request = new RequestPackage()
            {
                requestID = dictionaryGroupID
            };

            ResponsePackage response = new DBUtils().RunSqlAction(DictionaryGroupsRepository.DeleteDictionaryGroup, request);
            response.ThrowExceptionIfError();
            return response;
        }

        public ResponsePackage SaveDictionary(DictionaryModel dictionary)
        {
            RequestObjectPackage<DictionaryModel> request = new RequestObjectPackage<DictionaryModel>()
            {
                requestData = dictionary
            };

            ResponsePackage response = new DBUtils().RunSqlAction(new DictionaryTypesAdministrator().SaveDictionary, request);
            response.ThrowExceptionIfError();
            return response;
        }

        public ResponsePackage DeleteDictionary(int dictionaryID)
        {
            RequestPackage request = new RequestPackage()
            {
                requestID = dictionaryID
            };

            ResponsePackage response = new DBUtils().RunSqlAction(new DictionaryTypesAdministrator().DeleteDictionary, request);
            response.ThrowExceptionIfError();
            return response;
        }

        public ResponsePackage SaveDictionaryField(DictionaryFieldModel field)
        {
            RequestObjectPackage<DictionaryFieldModel> fieldRequest = new RequestObjectPackage<DictionaryFieldModel>()
            {
                requestData = field
            };

            ResponsePackage response = new DBUtils().RunSqlAction(new DictionaryTypesAdministrator().SaveDictionaryField, fieldRequest);
            response.ThrowExceptionIfError();
            return response;
        }

        public ResponsePackage DeleteDictionaryField(int dictionaryFieldID)
        {
            RequestPackage fieldRequest = new RequestPackage()
            {
                requestID = dictionaryFieldID
            };
            ResponsePackage response = new DBUtils().RunSqlAction(new DictionaryTypesAdministrator().DeleteDictionaryField, fieldRequest);
            response.ThrowExceptionIfError();
            return response;
        }

        public ResponsePackage SaveForeignKey(int dictionaryID, int dictionaryFieldIDSource)
        {
            int dictionaryFieldIDDestination = new DictionaryPrimaryKeysLogic().GetDictionaryPrimaryKeyByDictionaryID(dictionaryID)
                .GetDataOrExceptionIfError().dictionaryFieldID;

            RequestObjectPackage<DictionaryForeignKeyModel> request = new RequestObjectPackage<DictionaryForeignKeyModel>()
            {
                requestData = new DictionaryForeignKeyModel()
                {
                    ID = 0,
                    dictionaryFieldIDDestination = dictionaryFieldIDDestination,
                    dictionaryFieldIDSource = dictionaryFieldIDSource
                }
            };

            ResponsePackage response = new DBUtils().RunSqlAction(DictionaryForeignKeysRepository.SaveForeignKey, request);
            response.ThrowExceptionIfError();
            return response;
        }

        public ResponsePackage DeleteForeignKey(int foreignKeyID)
        {
            RequestPackage request = new RequestPackage()
            {
                requestID = foreignKeyID
            };
            ResponsePackage response = new DBUtils().RunSqlAction(DictionaryForeignKeysRepository.DeleteForeignKey, request);
            response.ThrowExceptionIfError();
            return response;
        }

    }
}
