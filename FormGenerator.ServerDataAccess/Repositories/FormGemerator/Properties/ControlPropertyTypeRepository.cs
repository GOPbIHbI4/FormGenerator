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
    public class ControlPropertyTypeRepository
    {
        public static readonly Dictionary<string, string> propertyTypeMapping = new Dictionary<string, string>()
        {
            {"ID","ID"},
            {"name","NAME"},
            {"logicValueTypeID","LOGIC_VALUE_TYPE_ID"}
        };

        /// <summary>
        /// Функция получения списка типов свойств компонентов формы по его ID
        /// </summary>
        /// <param name="request">>Объект-оболочка RequestPackage</param>
        /// <param name="connectionID">Объект подключения к базе данных</param>
        /// <returns>Объект-оболочка ResponseObjectPackagе, содержащая в поле resultData список типов свойств</returns>
        public ResponseObjectPackage<List<ControlPropertyTypeModel>> GetPropertyTypeList(RequestPackage request, IDbConnection connectionID)
        {
            string sql = string.Format(
                " select p.* " +
                " from control_property_types p "
            );
            List<ControlPropertyTypeModel> list = DBOrmUtils.OpenSqlList<ControlPropertyTypeModel>(sql, ControlPropertyTypeRepository.propertyTypeMapping, connectionID);
            return new ResponseObjectPackage<List<ControlPropertyTypeModel>>() { resultData = list };
        }

        /// </summary>
        /// Функция получения типа свойств компонентов формы по его ID
        /// </summary>
        /// <param name="request">Объект-оболочка RequestPackage, содержащая в поле requestID id типа свойств</param>
        /// <param name="connectionID">Объект подключения к базе данных</param>
        /// <returns>Объект-оболочка ResponseObjectPackagе, содержащая в поле resultData тип свойства</returns>
        public ResponseObjectPackage<ControlPropertyTypeModel> GetPropertyTypeByID(RequestPackage request, IDbConnection connectionID)
        {
            string sql = string.Format(
                " select p.* " +
                " from control_property_types p " +
                " where p.id = {0} ",
                request.requestID
            );
            List<ControlPropertyTypeModel> list = DBOrmUtils.OpenSqlList<ControlPropertyTypeModel>(sql, ControlPropertyTypeRepository.propertyTypeMapping, connectionID);
            if (list.Count == 1)
            {
                return new ResponseObjectPackage<ControlPropertyTypeModel>() { resultData = list[0] };
            }
            else
            {
                return new ResponseObjectPackage<ControlPropertyTypeModel>() { resultCode = -1, resultMessage = "Не удалось найти тип свойства [id = " + request.requestID + "]." };
            }
        }

        /// <summary>
        /// Функция сохранения типа свойств для типа контрола формы.
        /// </summary>
        /// <param name="request">Объект-оболочка RequestPackage</param>
        /// <param name="connectionID">Объект подключения к базе данных</param>
        /// <returns>Объект-оболочка ResponsePackage</returns>
        public ResponsePackage SavePropertyType(RequestObjectPackage<ControlPropertyTypeModel> request, IDbConnection connectionID)
        {
            ControlPropertyTypeModel obj = request.requestData;
            string sql = string.Empty;

            if (obj.ID > 0)
            {
                sql = string.Format(
                    " update control_property_types set NAME = '{0}', LOGIC_VALUE_TYPE_ID = {1} " +
                    " where id = {2} returning id ",
                    obj.name ?? "",
                    obj.logicValueTypeID,
                    obj.ID
                );
            }
            else
            {
                sql = string.Format(
                    " insert into control_property_types (NAME, LOGIC_VALUE_TYPE_ID) " +
                    " values ('{0}', {1}) returning id ",
                     obj.name ?? "",
                     obj.logicValueTypeID
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
                " delete from control_property_types where id = {0} ",
                request.requestID
            );
            DBUtils.ExecuteSQL(sql, connectionID).ThrowExceptionIfError();
            return new ResponsePackage();
        }
    }
}
