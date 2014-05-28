using FirebirdSql.Data.FirebirdClient;
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
    public class FormsRepository
    {
        public static readonly Dictionary<string, string> formMapping = new Dictionary<string, string>()
        {
            {"ID","ID"},
            {"name","NAME"},
            {"dictionaryID","DICTIONARY_ID"},
            {"dictionary","DICTIONARY"},
        };

        /// <summary>
        /// Функция получения формы по ее ID
        /// </summary>
        /// <param name="request">Объект-оболочка RequestPackage, содержащая в поле requestID id формы</param>
        /// <param name="connectionID">Объект подключения к базе данных</param>
        /// <returns>Объект-оболочка RequestPackage ResponseObjectPackagе, содержащая в поле resultData объект формы типа FormListEntity</returns>
        public ResponseObjectPackage<FormListEntity> GetFormByID(RequestPackage request, IDbConnection connectionID)
        {
            string sql = string.Format(
                " select f.id, f.name, f.dictionary_id, d.name as dictionary " +
                " from forms f " +
                " left join dictionaries d on f.dictionary_id = d.id " +
                " where f.id = {0} ",
                request.requestID
            );
            List<FormListEntity> list = DBOrmUtils.OpenSqlList<FormListEntity>(sql, FormsRepository.formMapping, connectionID);
            if (list.Count == 1)
            {
                return new ResponseObjectPackage<FormListEntity>() { resultData = list[0] };
            }
            else
            {
                return new ResponseObjectPackage<FormListEntity>() { resultCode = -1, resultMessage = "Не найдена форма [id=" + request.requestID + "]." };
            }
        }

        /// <summary>
        /// Функция получения списка форм, зарегистрированных в системе
        /// </summary>
        /// <param name="request">Объект-оболочка RequestPackage</param>
        /// <param name="connectionID">Объект подключения к базе данных</param>
        /// <returns>Объект-оболочка RequestPackage ResponseObjectPackagе, содержащая в поле resultData список объектов типа FormListEntity</returns>
        public ResponseObjectPackage<List<FormListEntity>> GetFormsList(RequestPackage request, IDbConnection connectionID)
        {
            string sql = string.Format(
                " select f.id, f.name, f.dictionary_id, d.name as dictionary " +
                " from forms f " +
                " left join dictionaries d on f.dictionary_id = d.id "
            );
            List<FormListEntity> list = DBOrmUtils.OpenSqlList<FormListEntity>(sql, FormsRepository.formMapping, connectionID);
            return new ResponseObjectPackage<List<FormListEntity>>() { resultData = list };
        }
    }
}
