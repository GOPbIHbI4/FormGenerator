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
    public class ControlsRepository
    {
        public static readonly Dictionary<string, string> controlsMapping = new Dictionary<string, string>()
        {
            {"ID","ID"},
            {"controlTypeID","CONTROL_TYPE_ID"},
            {"controlIDParent","CONTROL_ID_PARENT"},
            {"formID","FORM_ID"},
            {"orderNumber","ORDER_NUMBER"},
            {"controlType","CONTROL_TYPE"},
        };

        /// <summary>
        /// Функция получения списка контролов формы по ее ID
        /// </summary>
        /// <param name="request">Объект-оболочка RequestPackage, содержащая в поле requestID id формы</param>
        /// <param name="connectionID">Объект подключения к базе данных</param>
        /// <returns>Объект-оболочка ResponseObjectPackagе, содержащая в поле resultData список контролов формы</returns>
        public ResponseObjectPackage<List<ControlListEntity>> GetControlsByFormID(RequestPackage request, IDbConnection connectionID)
        {
            string sql = string.Format(
                " select c.*, t.name as control_type " +
                " from controls c " +
                " left join control_types t on c.control_type_id = t.id " +
                " where c.form_id = {0} ",
                request.requestID
            );
            List<ControlListEntity> list = DBOrmUtils.OpenSqlList<ControlListEntity>(sql, ControlsRepository.controlsMapping, connectionID);
            return new ResponseObjectPackage<List<ControlListEntity>>() { resultData = list };
        }

        /// <summary>
        /// Функция получения контрола формы по его ID
        /// </summary>
        /// <param name="request">Объект-оболочка RequestPackage, содержащая в поле requestID ID контрола</param>
        /// <param name="connectionID">Объект подключения к базе данных</param>
        /// <returns>Объект-оболочка ResponseObjectPackagе, содержащая в поле resultData контрол формы</returns>
        public ResponseObjectPackage<ControlListEntity> GetControlByID(RequestPackage request, IDbConnection connectionID)
        {
            string sql = string.Format(
                " select c.*, t.name as control_type " +
                " from controls c " +
                " left join control_types t on c.control_type_id = t.id " +
                " where c.id = {0} ",
                request.requestID
            );
            List<ControlListEntity> list = DBOrmUtils.OpenSqlList<ControlListEntity>(sql, ControlsRepository.controlsMapping, connectionID);
            if (list.Count == 1)
            {
                return new ResponseObjectPackage<ControlListEntity>() { resultData = list[0] };
            }
            else
            {
                return new ResponseObjectPackage<ControlListEntity>() { resultCode = -1, resultMessage = "Не удалось найти контрол[id = " + request.requestID + "]." };
            }
        }

        /// <summary>
        /// Функция сохранения контрола формы.
        /// </summary>
        /// <param name="request">Объект-оболочка RequestPackage, содержащая в поле requestData контрол</param>
        /// <param name="connectionID">Объект подключения к базе данных</param>
        /// <returns>Объект-оболочка ResponsePackagе</returns>
        public ResponsePackage SaveControl(RequestObjectPackage<ControlModel> request, IDbConnection connectionID)
        {
            ControlModel obj = request.requestData;
            string sql = string.Empty;

            if (obj.ID > 0)
            {
                sql = string.Format(
                    " update controls set control_type_id = {0}, control_id_parent = {1}, form_id = {2}, order_number= {3} " +
                    " where id = {4} returning id ",
                    obj.controlTypeID,
                    obj.controlIDParent == null ? "null" : obj.controlIDParent.ToString(),
                    obj.formID == null ? "null" : obj.formID.ToString(),
                    obj.orderNumber,
                    obj.ID
                );
            }
            else
            {
                sql = string.Format(
                    " insert into controls (control_type_id, control_id_parent, form_id, order_number) " +
                    " values ({0}, {1}, {2}, {3}) returning id ",
                    obj.controlTypeID,
                    obj.controlIDParent == null ? "null" : obj.controlIDParent.ToString(),
                    obj.formID == null ? "null" : obj.formID.ToString(),
                    obj.orderNumber
                );
            }
            ResponseTablePackage res = DBUtils.ExecuteSQL(sql, connectionID, true);
            res.ThrowExceptionIfError();
            return new ResponsePackage() { resultID = res.resultID };
        }

        /// <summary>
        /// Функция удаления контрола из формы
        /// </summary>
        /// <param name="request">Объект-оболочка RequestPackage, содержащая в поле requestID ID контрола</param>
        /// <param name="connectionID">Объект подключения к базе данных</param>
        /// <returns>Объект-оболочка ResponsePackagе</returns>
        public ResponsePackage DeleteControlByID(RequestPackage request, IDbConnection connectionID)
        {
            try
            {
                string sql = string.Format(
                    " delete from controls where ID = {0} ",
                    request.requestID
                );
                DBUtils.ExecuteSQL(sql, connectionID).ThrowExceptionIfError();
                return new ResponsePackage();
            }
            catch (Exception)
            {
                return new ResponsePackage() { resultID = -1, resultMessage = "На форме есть данные, связанные с этим компонентом [id=" + request.requestID + "]. Удалить его невозможно." };
            }
        }

        /// <summary>
        /// Проверить возможность удаления компонента
        /// </summary>
        /// <param name="request">бъект-оболочка RequestPackage, содержащая в поле requestID ID компонента</param>
        /// <param name="connectionID">Объект подключения к базе данных</param>
        /// <returns>Объект-оболочка ResponsePackagе</returns>
        public ResponsePackage CheckDeleteControl(RequestPackage request, IDbConnection connectionID)
        {
            string sql = string.Format(
                " select id from CONTROL_DICTIONARY_MAPPING where control_id = {0} " +
                "  union " +
                " select id from CONTROL_QUERY_MAPPING where control_id = {0} " +
                "  union " +
                " select id from FORM_IN_PARAMETERS where control_id = {0} " +
                "  union " +
                " select id from FORM_OUT_PARAMETERS where control_id = {0} " +
                "  union " +
                " select id from QUERY_QUERY_IN_PARAMETER where control_id = {0} ",
                request.requestID
            );
            ResponseTablePackage res = DBUtils.OpenSQL(sql, connectionID);
            res.ThrowExceptionIfError();
            if (res.resultData.Rows.Count > 0)
            {
                return new ResponsePackage() { resultCode = -1, resultMessage = "Удаление компонента невозможно. Проверьте все ссылки на него." };
            }
            else
            {
                return new ResponsePackage() { resultCode = 0, resultMessage = "Удаление возможно." };
            }
        }
    }
}
