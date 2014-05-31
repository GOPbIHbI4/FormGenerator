using FormGenerator.Models;
using FormGenerator.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.ServerDataAccess
{
    public static class DomainValueTypesRepository
    {
        public static readonly Dictionary<string, string> mappingDictionary = new Dictionary<string, string>()
        {
            {"ID","ID"},
            {"name","NAME"},
        };

        public static ResponseObjectPackage<List<DomainValueTypeModel>> GetAll(RequestPackage package, IDbConnection connectionID)
        {
            string sql = string.Format(
                "select ID, NAME " + Environment.NewLine +
                "from DOMAIN_VALUE_TYPES;"
            );
            List<DomainValueTypeModel> list = DBOrmUtils.OpenSqlList<DomainValueTypeModel>(sql, DomainValueTypesRepository.mappingDictionary, connectionID);
            return new ResponseObjectPackage<List<DomainValueTypeModel>>() { resultData = list };
        }

    }
}
