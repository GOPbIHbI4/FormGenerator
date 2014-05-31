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
    public class ControlPropertiesRepository
    {
        public static readonly Dictionary<string, string> propertyMapping = new Dictionary<string, string>()
        {
            {"ID","ID"},
            {"controlID","CONTROL_ID"},
            {"controlPropertyTypeID","CONTROL_PROPERTY_TYPE_ID"},
            {"value","VALUE_"},
            {"property","PROPERTY"},
            {"controlTypeID","CONTROL_TYPE_ID"},
            {"logicValueTypeID","LOGIC_VALUE_TYPE_ID"},
            {"DOMAIN_VALUE_TYPE_ID_LOGIC", "DOMAIN_VALUE_TYPE_ID_DATA"}
        };

        /// <summary>
        /// Функция получения списка свойств компонента по его ID
        /// </summary>
        /// <param name="request">Объект-оболочка RequestPackage, содержащая в поле requestID id компонента</param>
        /// <param name="connectionID">Объект подключения к базе данных</param>
        /// <returns>Объект-оболочка ResponseObjectPackagе, содержащая в поле resultData список свойств компонента</returns>
        public ResponseObjectPackage<List<ControlPropertyViewModel>> GetPropertiesByControlID(RequestPackage request, IDbConnection connectionID)
        {
            int controlID = request.requestID;
            string sql = string.Format(
                " select p.*, ct.name as property, ct.logic_value_type_id, t.control_type_id " +
                " from control_properties p " +
                " left join control_type_property_type t on p.control_propery_type_id = t.id " +
                " left join control_property_types ct on t.control_propery_type_id = ct.id " +
                " where p.control_id = {0} ",
                controlID
            );
            List<ControlPropertyViewModel> list = DBOrmUtils.OpenSqlList<ControlPropertyViewModel>(sql, ControlPropertiesRepository.propertyMapping, connectionID);
            return new ResponseObjectPackage<List<ControlPropertyViewModel>>() { resultData = list };
        }

        /// </summary>
        /// Функция получения списка свойств компонентов формы по ее ID
        /// </summary>
        /// <param name="request">Объект-оболочка RequestPackage, содержащая в поле requestID id формы</param>
        /// <param name="connectionID">Объект подключения к базе данных</param>
        /// <returns>Объект-оболочка ResponseObjectPackagе, содержащая в поле resultData список свойств компонентов формы</returns>
        public ResponseObjectPackage<List<ControlPropertyViewModel>> GetPropertiesByFormID(RequestPackage request, IDbConnection connectionID)
        {
            int formID = request.requestID;
            string sql = string.Format(
                " select p.*, ct.name as property, ct.logic_value_type_id, t.control_type_id, lt.DOMAIN_VALUE_TYPE_ID_DATA " +
                " from control_properties p " +
                " left join control_type_property_type t on p.control_property_type_id = t.id " +
                " left join control_property_types ct on t.control_property_type_id = ct.id " +
                " left join LOGIC_VALUE_TYPES lt on lt.ID = ct.logic_value_type_id " +
                " left join controls c on p.control_id = c.id " +
                " where c.form_id = {0} ",
                formID
            );
            List<ControlPropertyViewModel> list = DBOrmUtils.OpenSqlList<ControlPropertyViewModel>(sql, ControlPropertiesRepository.propertyMapping, connectionID);
            return new ResponseObjectPackage<List<ControlPropertyViewModel>>() { resultData = list };
        }

        /// <summary>
        /// Функция сохранения свойства контрола формы для редактора форм.
        /// </summary>
        /// <param name="request"></param>
        /// <param name="connectionID"></param>
        /// <returns></returns>
        public ResponsePackage SaveProperty(RequestObjectPackage<ControlPropertyModel> request, IDbConnection connectionID)
        {
            ControlPropertyModel obj = request.requestData;
            string sql = string.Empty;

            if (obj.ID > 0)
            {
                sql = string.Format(
                    " update control_properties set control_id = {0}, control_property_type_id = {1}, value_ = '{2}' " +
                    " where id = {3} returning id ",
                    obj.controlID,
                    obj.controlPropertyTypeID,
                    obj.value == null ? "" : obj.value.TrimIfNotNull(),
                    obj.ID
                );
            }
            else
            {
                sql = string.Format(
                    " insert into control_properties (control_id, control_property_type_id, value_) " +
                    " values ({0}, {1}, '{2}') returning id ",
                    obj.controlID,
                    obj.controlPropertyTypeID,
                    obj.value == null ? "" : obj.value.TrimIfNotNull()
                );
            }
            ResponseTablePackage res = DBUtils.ExecuteSQL(sql, connectionID, true);
            res.ThrowExceptionIfError();
            return new ResponsePackage() { resultID = res.resultID };
        }

        /// <summary>
        /// Функция удаления свойства контрола по его ID
        /// </summary>
        /// <param name="request">Объект-оболочка RequestPackage, содержащая в поле requestID ID компонента</param>
        /// <param name="connectionID">Объект подключения к базе данных</param>
        /// <returns>Объект-оболочка ResponsePackagе</returns>
        public ResponsePackage DeletePropertiesByControlID(RequestPackage request, IDbConnection connectionID)
        {
            string sql = string.Format(
                " delete from control_properties where control_id = {0} ",
                request.requestID
            );
            DBUtils.ExecuteSQL(sql, connectionID).ThrowExceptionIfError();
            return new ResponsePackage();
        }

        /// <summary>
        /// Функция удаления свойства контрола по ее ID
        /// </summary>
        /// <param name="request">Объект-оболочка RequestPackage, содержащая в поле requestID ID свойства</param>
        /// <param name="connectionID">Объект подключения к базе данных</param>
        /// <returns>Объект-оболочка ResponsePackagе</returns>
        public ResponsePackage DeletePropertyByID(RequestPackage request, IDbConnection connectionID)
        {
            string sql = string.Format(
                " delete from control_properties where id = {0} ",
                request.requestID
            );
            DBUtils.ExecuteSQL(sql, connectionID).ThrowExceptionIfError();
            return new ResponsePackage();
        }
    }
}
