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
    public class DictionaryForeignKeysLogic
    {
        public ResponseObjectPackage<List<DictionaryForeignKeyModel>> GetDictionaryForeignKeysByDictionaryIDSource(int dictionaryID)
        {
            RequestPackage request = new RequestPackage()
            {
                requestID = dictionaryID
            };
            ResponseObjectPackage<List<DictionaryForeignKeyModel>> response = new DBUtils().RunSqlAction(DictionaryForeignKeysRepository.GetByDictionaryIDSource, request);
            return response;
        }
    }
}
