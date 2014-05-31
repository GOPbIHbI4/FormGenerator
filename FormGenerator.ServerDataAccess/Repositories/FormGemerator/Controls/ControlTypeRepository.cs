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
    public class ControlTypeRepository
    {
        public static readonly Dictionary<string, string> controlTypeMapping = new Dictionary<string, string>()
        {
            {"ID","ID"},
            {"component","NAME"},
            {"controlTypeGroupID","CONTROL_TYPE_GROUP_ID"},
            {"path","PATH"},
            {"group","GROUP_NAME"},
            {"description","DESCRIPTION"}
        };

        /// <summary>
        /// Функция получения типа контролов формы по его ID
        /// </summary>
        /// <param name="request">Объект-оболочка RequestPackage, содержащая в поле requestID ID типа контрола</param>
        /// <param name="connectionID">Объект подключения к базе данных</param>
        /// <returns>Объект-оболочка ResponseObjectPackagе, содержащая в поле resultData тип контрола формы</returns>
        public ResponseObjectPackage<ControlTypeListEntity> GetControlTypeByID(RequestPackage request, IDbConnection connectionID)
        {
            string sql = string.Format(
                " select t.*, g.name as group_name " +
                " from control_types t " +
                " left join control_type_groups g on t.control_type_group_id = g.id " +
                " where t.id = {0} ",
                request.requestID
            );
            List<ControlTypeListEntity> list = DBOrmUtils.OpenSqlList<ControlTypeListEntity>(sql, ControlTypeRepository.controlTypeMapping, connectionID);
            if (list.Count == 1)
            {
                return new ResponseObjectPackage<ControlTypeListEntity>() { resultData = list[0] };
            }
            else
            {
                return new ResponseObjectPackage<ControlTypeListEntity>() { resultCode = -1, resultMessage = "Не удалось найти контрол[id = " + request.requestID + "]." };
            }
        }

        /// <summary>
        /// Функция сохранения типа контрола
        /// </summary>
        /// <param name="request">Объект-оболочка RequestPackage, содержащая в поле requestData тип контрола</param>
        /// <param name="connectionID">Объект подключения к базе данных</param>
        /// <returns>Объект-оболочка ResponsePackagе</returns>
        public ResponsePackage SaveControlType(RequestObjectPackage<ControlTypeModel> request, IDbConnection connectionID)
        {
            ControlTypeModel obj = request.requestData;
            string sql = string.Empty;

            if (obj.ID > 0)
            {
                sql = string.Format(
                    " update control_types set NAME = {0}, CONTROL_TYPE_GROUP_ID = {1}, PATH = {2}, DESCRIPTION = {3} " +
                    " where id = {4} returning id ",
                    obj.component ?? "",
                    obj.controlTypeGroupID,
                    obj.path == null ? "null" : ("'" + obj.path.TrimIfNotNull() + "'"),
                    obj.description == null ? "null" : ("'" + obj.description.TrimIfNotNull() + "'"),
                    obj.ID
                );
            }
            else
            {
                sql = string.Format(
                    " insert into control_types (NAME, CONTROL_TYPE_GROUP_ID, PATH, DESCRIPTION) " +
                    " values ({0}, {1}, {2}, {3}) returning id ",
                    obj.component ?? "",
                    obj.controlTypeGroupID,
                    obj.path == null ? "null" : ("'" + obj.path.TrimIfNotNull() + "'"),
                    obj.description == null ? "null" : ("'" + obj.description.TrimIfNotNull() + "'")
                );
            }
            ResponseTablePackage res = DBUtils.ExecuteSQL(sql, connectionID, true);
            res.ThrowExceptionIfError();
            return new ResponsePackage() { resultID = res.resultID };
        }

        /// <summary>
        /// Функция удаления типа контрола
        /// </summary>
        /// <param name="request">Объект-оболочка RequestPackage, содержащая в поле requestID ID типа контрола</param>
        /// <param name="connectionID">Объект подключения к базе данных</param>
        /// <returns>Объект-оболочка ResponsePackagе</returns>
        public ResponsePackage DeleteControlTypeByID(RequestPackage request, IDbConnection connectionID)
        {
            string sql = string.Format(
                " delete from control_types where ID = {0} ",
                request.requestID
            );
            DBUtils.ExecuteSQL(sql, connectionID).ThrowExceptionIfError();
            return new ResponsePackage();
        }
    }
}
