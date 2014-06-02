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
        class IntClass
        {
            public int ID { get; set; }
        }

        public static readonly Dictionary<string, string> IDMapping = new Dictionary<string, string>()
        {
            {"ID","ID"}
        };

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
        public ResponseObjectPackage<List<ControlListEntity>> GetControlsByFormID(RequestPackage request, IDbConnection connectionID, IDbTransaction transactionID)
        {
            string sql = string.Format(
                " select c.*, t.name as control_type " +
                " from controls c " +
                " left join control_types t on c.control_type_id = t.id " +
                " where c.form_id = {0} ",
                request.requestID
            );
            List<ControlListEntity> list = DBOrmUtils.OpenSqlList<ControlListEntity>(sql, ControlsRepository.controlsMapping, connectionID, transactionID);
            return new ResponseObjectPackage<List<ControlListEntity>>() { resultData = list };
        }
        public ResponseObjectPackage<List<ControlListEntity>> GetControlsByFormID(RequestPackage request, IDbConnection connectionID)
        {
            return this.GetControlsByFormID(request, connectionID, null);
        }

        /// <summary>
        /// Функция получения контрола формы по его ID
        /// </summary>
        /// <param name="request">Объект-оболочка RequestPackage, содержащая в поле requestID ID контрола</param>
        /// <param name="connectionID">Объект подключения к базе данных</param>
        /// <returns>Объект-оболочка ResponseObjectPackagе, содержащая в поле resultData контрол формы</returns>
        public ResponseObjectPackage<ControlListEntity> GetControlByID(RequestPackage request, IDbConnection connectionID, IDbTransaction transactionID)
        {
            string sql = string.Format(
                " select c.*, t.name as control_type " +
                " from controls c " +
                " left join control_types t on c.control_type_id = t.id " +
                " where c.id = {0} ",
                request.requestID
            );
            List<ControlListEntity> list = DBOrmUtils.OpenSqlList<ControlListEntity>(sql, ControlsRepository.controlsMapping, connectionID, transactionID);
            if (list.Count == 1)
            {
                return new ResponseObjectPackage<ControlListEntity>() { resultData = list[0] };
            }
            else
            {
                return new ResponseObjectPackage<ControlListEntity>() { resultCode = -1, resultMessage = "Не удалось найти контрол[id = " + request.requestID + "]." };
            }
        }
        public ResponseObjectPackage<ControlListEntity> GetControlByID(RequestPackage request, IDbConnection connectionID)
        {
            return this.GetControlByID(request, connectionID, null);
        }

        /// <summary>
        /// Функция сохранения контрола формы.
        /// </summary>
        /// <param name="request">Объект-оболочка RequestPackage, содержащая в поле requestData контрол</param>
        /// <param name="connectionID">Объект подключения к базе данных</param>
        /// <returns>Объект-оболочка ResponsePackagе</returns>
        public ResponsePackage SaveControl(RequestObjectPackage<ControlModel> request, IDbConnection connectionID, IDbTransaction transactionID)
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
            ResponseTablePackage res = DBUtils.ExecuteSQL(sql, connectionID, true, transactionID);
            res.ThrowExceptionIfError();
            return new ResponsePackage() { resultID = res.resultID };
        }
        public ResponsePackage SaveControl(RequestObjectPackage<ControlModel> request, IDbConnection connectionID)
        {
            return this.SaveControl(request, connectionID, null);
        }

        /// <summary>
        /// Функция удаления контрола из формы
        /// </summary>
        /// <param name="request">Объект-оболочка RequestPackage, содержащая в поле requestID ID контрола</param>
        /// <param name="connectionID">Объект подключения к базе данных</param>
        /// <returns>Объект-оболочка ResponsePackagе</returns>
        public ResponsePackage DeleteControlByID(RequestPackage request, IDbConnection connectionID, IDbTransaction transactionID)
        {
            try
            {
                string sql = string.Format(
                    " delete from controls where ID = {0} ",
                    request.requestID
                );
                DBUtils.ExecuteSQL(sql, connectionID, false, transactionID).ThrowExceptionIfError();
                return new ResponsePackage();
            }
            catch (Exception)
            {
                return new ResponsePackage() { resultID = -1, resultMessage = "На форме есть данные, связанные с этим компонентом [id=" + request.requestID + "]. Удалить его невозможно." };
            }
        }
        public ResponsePackage DeleteControlByID(RequestPackage request, IDbConnection connectionID)
        {
            return this.DeleteControlByID(request, connectionID, null);
        }

        /// <summary>
        /// Функция удаления всех контролов из формы
        /// </summary>
        /// <param name="request">Объект-оболочка RequestPackage, содержащая в поле requestID ID формы</param>
        /// <param name="connectionID">Объект подключения к базе данных</param>
        /// <returns>Объект-оболочка ResponsePackagе</returns>
        public ResponsePackage DeleteControlByFormID(RequestPackage request, IDbConnection connectionID, IDbTransaction transactionID)
        {
            int formID = request.requestID;
            string sql = string.Format(
                "  select ID from CONTROLS where FORM_ID = {0} order by ORDER_NUMBER DESC ",
                formID
            );
            List<IntClass> list = DBOrmUtils.OpenSqlList<IntClass>(sql, ControlsRepository.IDMapping, connectionID, transactionID);
            foreach (IntClass IDclass in list)
            {
                sql = string.Format(
                    " delete from CONTROLS where ID = {0} ",
                    IDclass.ID
                );
                DBUtils.ExecuteSQL(sql, connectionID, false, transactionID).ThrowExceptionIfError();
            }

            return new ResponsePackage();
        }
        public ResponsePackage DeleteControlByFormID(RequestPackage request, IDbConnection connectionID)
        {
            return this.DeleteControlByFormID(request, connectionID, null);
        }

        /// <summary>
        /// Проверить возможность удаления компонента
        /// </summary>
        /// <param name="request">бъект-оболочка RequestPackage, содержащая в поле requestID ID компонента</param>
        /// <param name="connectionID">Объект подключения к базе данных</param>
        /// <returns>Объект-оболочка ResponsePackagе</returns>
        public ResponsePackage CheckDeleteControl(RequestPackage request, IDbConnection connectionID, IDbTransaction transactionID)
        {
            string sql = string.Format(
                " select id from CONTROL_QUERY_MAPPING where control_id = {0} " +
                "  union " +
                " select id from FORM_IN_PARAMETERS where control_id = {0} " +
                "  union " +
                " select id from FORM_OUT_PARAMETERS where control_id = {0} " +
                "  union " +
                " select id from ACTION_PARAMETERS where control_id = {0} " +
                "  union " +
                " select id from QUERY_QUERY_IN_PARAMETER where control_id = {0} ",
                request.requestID
            );
            ResponseTablePackage res = DBUtils.OpenSQL(sql, connectionID, transactionID);
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
        public ResponsePackage CheckDeleteControl(RequestPackage request, IDbConnection connectionID)
        {
            return this.CheckDeleteControl(request, connectionID, null);
        }
    }
}
