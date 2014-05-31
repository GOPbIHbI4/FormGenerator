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
    public class ControlTypePropertyTypeRepository
    {
        public static readonly Dictionary<string, string> propertyTypeMapping = new Dictionary<string, string>()
        {
            {"ID","ID"},
            {"property","PROPERTY"},
            {"controlTypeID","CONTROL_TYPE_ID"},
            {"controlPropertyTypeID","CONTROL_PROPERTY_TYPE_ID"},
            {"logicValueTypeID","LOGIC_VALUE_TYPE_ID"},
            {"defaultValue","DEFAULT_VALUE"}
        };

        /// </summary>
        /// Функция получения типа свойств компонентов формы по его ID
        /// </summary>
        /// <param name="request">Объект-оболочка RequestPackage, содержащая в поле requestID id типа свойств</param>
        /// <param name="connectionID">Объект подключения к базе данных</param>
        /// <returns>Объект-оболочка ResponseObjectPackagе, содержащая в поле resultData тип свойства</returns>
        public ResponseObjectPackage<PropertyTypeListEntity> GetPropertyTypeByID(RequestPackage request, IDbConnection connectionID)
        {
            string sql = string.Format(
                " select p.*, t.name as property, t.logic_value_type_id " +
                " from control_type_property_type p " +
                " left join control_property_types t on p.control_property_type_id = t.id " +
                " where p.id = {0} ",
                request.requestID
            );
            List<PropertyTypeListEntity> list = DBOrmUtils.OpenSqlList<PropertyTypeListEntity>(sql, ControlTypePropertyTypeRepository.propertyTypeMapping, connectionID);
            if (list.Count == 1)
            {
                return new ResponseObjectPackage<PropertyTypeListEntity>() { resultData = list[0] };
            }
            else
            {
                return new ResponseObjectPackage<PropertyTypeListEntity>() { resultCode = -1, resultMessage = "Не удалось найти тип свойства [id = " + request.requestID + "]." };
            }
        }

        /// <summary>
        /// Функция получения списка типов свойств по его ID типа компонента
        /// </summary>
        /// <param name="request">Объект-оболочка RequestPackage, содержащая в поле requestID id типа компонента</param>
        /// <param name="connectionID">Объект подключения к базе данных</param>
        /// <returns>Объект-оболочка ResponseObjectPackagе, содержащая в поле resultData список типов свойств</returns>
        public ResponseObjectPackage<List<PropertyTypeListEntity>> GetPropertyTypeListByControlType(RequestPackage request, IDbConnection connectionID)
        {
            string sql = string.Format(
                 " select p.*, t.name as property, t.logic_value_type_id " +
                 " from control_type_property_type p " +
                 " left join control_property_types t on p.control_property_type_id = t.id " +
                 " where p.CONTROL_TYPE_ID = {0}",
                 request.requestID
             );
            List<PropertyTypeListEntity> list = DBOrmUtils.OpenSqlList<PropertyTypeListEntity>(sql, ControlTypePropertyTypeRepository.propertyTypeMapping, connectionID);
            return new ResponseObjectPackage<List<PropertyTypeListEntity>>() { resultData = list };
        }

        /// <summary>
        /// Функция сохранения типа свойств для типа контрола формы.
        /// </summary>
        /// <param name="request">Объект-оболочка RequestPackage</param>
        /// <param name="connectionID">Объект подключения к базе данных</param>
        /// <returns>Объект-оболочка ResponsePackage</returns>
        public ResponsePackage SavePropertyType(RequestObjectPackage<ControlTypePropertyTypeModel> request, IDbConnection connectionID)
        {
            ControlTypePropertyTypeModel obj = request.requestData;
            string sql = string.Empty;

            if (obj.ID > 0)
            {
                sql = string.Format(
                    " update control_type_property_type set CONTROL_TYPE_ID = {0}, CONTROL_PROPERTY_TYPE_ID = {1}, DEFAULT_VALUE = '{2}' " +
                    " where id = {3} returning id ",
                    obj.controlTypeID,
                    obj.controlPropertyTypeID,
                    obj.defaultValue ?? "",
                    obj.ID
                );
            }
            else
            {
                sql = string.Format(
                    " insert into control_type_property_type (CONTROL_TYPE_ID, CONTROL_PROPERTY_TYPE_ID, DEFAULT_VALUE) " +
                    " values ({0}, {1}, '{2}') returning id ",
                    obj.controlTypeID,
                    obj.controlPropertyTypeID,
                    obj.defaultValue ?? ""
                );
            }
            ResponseTablePackage res = DBUtils.ExecuteSQL(sql, connectionID, true);
            res.ThrowExceptionIfError();
            return new ResponsePackage() { resultID = res.resultID };
        }

        /// <summary>
        /// Функция удаления типа свойства для типа контрола по его ID
        /// </summary>
        /// <param name="request">Объект-оболочка RequestPackage, содержащая в поле requestID ID типа свойства</param>
        /// <param name="connectionID">Объект подключения к базе данных</param>
        /// <returns>Объект-оболочка ResponsePackagе</returns>
        public ResponsePackage DeletePropertyTypeByID(RequestPackage request, IDbConnection connectionID)
        {
            string sql = string.Format(
                " delete from control_type_property_type where id = {0} ",
                request.requestID
            );
            DBUtils.ExecuteSQL(sql, connectionID).ThrowExceptionIfError();
            return new ResponsePackage();
        }
    }
}
