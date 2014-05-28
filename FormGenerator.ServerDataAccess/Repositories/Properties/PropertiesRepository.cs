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
    public class PropertiesRepository
    {
        public static readonly Dictionary<string, string> propertyMapping = new Dictionary<string, string>()
        {
            {"ID","ID"},
            {"controlID","CONTROL_ID"},
            {"controlPropertyTypeID","CONTROL_PROPERTY_TYPE_ID"},
            {"value","VALUE_"},
            {"property","PROPERTY"},
            {"controlTypeID","CONTROL_TYPE_ID"},
            {"logicValueTypeID","LOGIC_VALUE_TYPE_ID"}
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
            List<ControlPropertyViewModel> list = DBOrmUtils.OpenSqlList<ControlPropertyViewModel>(sql, PropertiesRepository.propertyMapping, connectionID);
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
                " select p.*, ct.name as property, ct.logic_value_type_id, t.control_type_id " +
                " from control_properties p " +
                " left join control_type_property_type t on p.control_property_type_id = t.id " +
                " left join control_property_types ct on t.control_property_type_id = ct.id " +
                " left join controls c on p.control_id = c.id " +
                " where c.form_id = {0} ",
                formID
            );
            List<ControlPropertyViewModel> list = DBOrmUtils.OpenSqlList<ControlPropertyViewModel>(sql, PropertiesRepository.propertyMapping, connectionID);
            return new ResponseObjectPackage<List<ControlPropertyViewModel>>() { resultData = list };
        }
    }
}
