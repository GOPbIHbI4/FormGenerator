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
        /// <returns>Объект-оболочка ResponseObjectPackagе, содержащая в поле resultData объект формы типа FormListEntity</returns>
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
        /// <returns>Объект-оболочка ResponseObjectPackagе, содержащая в поле resultData список объектов типа FormListEntity</returns>
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

        /// <summary>
        /// Функция сохранения формы для редактора форм.
        /// </summary>
        /// <param name="request">Объект-оболочка RequestPackage с формой в requestData</param>
        /// <param name="connectionID">Объект подключения к базе данных</param>
        /// <returns>Объект-оболочка ResponsePackage</returns>
        public ResponsePackage SaveForm(RequestObjectPackage<FormModel> request, IDbConnection connectionID, IDbTransaction transactionID)
        {
            FormModel obj = request.requestData;
            string sql = string.Empty;

            if (obj.ID > 0)
            {
                sql = string.Format(
                    " update forms set name = '{0}', dictionary_id = {1} " +
                    " where id = {2} returning id ",
                    obj.name ?? "", 
                    obj.dictionaryID == null ? "null" : obj.dictionaryID.ToString(), 
                    obj.ID
                );
            }
            else
            {
                sql = string.Format(
                    " insert into forms (name, dictionary_id) " +
                    " values ('{0}', {1}) returning id ",
                    obj.name ?? "", 
                    obj.dictionaryID == null ? "null" : obj.dictionaryID.ToString()
                );
            }
            ResponseTablePackage res = DBUtils.ExecuteSQL(sql, connectionID, true, transactionID);
            res.ThrowExceptionIfError();
            return new ResponsePackage() { resultID = res.resultID };
        }
        public ResponsePackage SaveForm(RequestObjectPackage<FormModel> request, IDbConnection connectionID)
        {
            return this.SaveForm(request, connectionID, null);
        }

        /// <summary>
        /// Функция удаления формы
        /// </summary>
        /// <param name="request">Объект-оболочка RequestPackage c ID формы в requestID</param>
        /// <param name="connectionID">Объект подключения к базе данных</param>
        /// <returns>Объект-оболочка ResponsePackage</returns>
        public ResponsePackage DeleteFormByID(RequestPackage request, IDbConnection connectionID)
        {
            string sql = string.Format(
                " delete from forms where id = {0} ",
                request.requestID
            );
            DBUtils.ExecuteSQL(sql, connectionID).ThrowExceptionIfError();
            return new ResponsePackage();
        }

        /// <summary>
        /// Удалить свойства по ID формы
        /// </summary>
        /// <param name="request"></param>
        /// <param name="connectionID"></param>
        /// <param name="transactionID"></param>
        /// <returns></returns>
        public ResponsePackage DeletePropertiesByFormID(RequestPackage request, IDbConnection connectionID, IDbTransaction transactionID)
        {
            int formID = request.requestID;
            string sql = string.Format(
                " delete from control_properties where control_id in (" +
                "   select control_id from controls where form_id = {0} " +
                ") ",
                formID
            );
            DBUtils.ExecuteSQL(sql, connectionID, false, transactionID).ThrowExceptionIfError();
            return new ResponsePackage();
        }
        public ResponsePackage DeletePropertiesByControlID(RequestPackage request, IDbConnection connectionID)
        {
            return this.DeletePropertiesByFormID(request, connectionID, null);
        }
    }
}
