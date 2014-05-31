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
    public class ControlTypeGroupRepository
    {
        public static readonly Dictionary<string, string> controlTypeGroupMapping = new Dictionary<string, string>()
        {
            {"ID","ID"},
            {"name","NAME"}
        };

        /// <summary>
        /// Функция получения группы типов контролов формы по ее ID
        /// </summary>
        /// <param name="request">Объект-оболочка RequestPackage, содержащая в поле requestID ID группы типов контрола</param>
        /// <param name="connectionID">Объект подключения к базе данных</param>
        /// <returns>Объект-оболочка ResponseObjectPackagе, содержащая в поле resultData группу типов контролов формы</returns>
        public ResponseObjectPackage<ControlTypeGroup> GetControlTypeGroupByID(RequestPackage request, IDbConnection connectionID)
        {
            string sql = string.Format(
                " select * " +
                " from control_type_groups " +
                " where id = {0} ",
                request.requestID
            );
            List<ControlTypeGroup> list = DBOrmUtils.OpenSqlList<ControlTypeGroup>(sql, ControlTypeRepository.controlTypeMapping, connectionID);
            if (list.Count == 1)
            {
                return new ResponseObjectPackage<ControlTypeGroup>() { resultData = list[0] };
            }
            else
            {
                return new ResponseObjectPackage<ControlTypeGroup>() { resultCode = -1, resultMessage = "Не удалось найти группу типов контролов[id = " + request.requestID + "]." };
            }
        }

        /// <summary>
        /// Функция сохранения группы типов контролов
        /// </summary>
        /// <param name="request">Объект-оболочка RequestPackage, содержащая в поле requestData нруппу типов контролов</param>
        /// <param name="connectionID">Объект подключения к базе данных</param>
        /// <returns>Объект-оболочка ResponsePackagе</returns>
        public ResponsePackage SaveControlTypeGroup(RequestObjectPackage<ControlTypeGroupModel> request, IDbConnection connectionID)
        {
            ControlTypeGroupModel obj = request.requestData;
            string sql = string.Empty;

            if (obj.ID > 0)
            {
                sql = string.Format(
                    " update control_type_groups set NAME = {0} " +
                    " where id = {1} returning id ",
                    obj.name ?? "",
                    obj.ID
                );
            }
            else
            {
                sql = string.Format(
                    " insert into control_type_groups (NAME) " +
                    " values ({0}) returning id ",
                    obj.name ?? ""
                );
            }
            ResponseTablePackage res = DBUtils.ExecuteSQL(sql, connectionID, true);
            res.ThrowExceptionIfError();
            return new ResponsePackage() { resultID = res.resultID };
        }

        /// <summary>
        /// Функция удаления группы типов контролов
        /// </summary>
        /// <param name="request">Объект-оболочка RequestPackage, содержащая в поле requestID ID группы типов контролов</param>
        /// <param name="connectionID">Объект подключения к базе данных</param>
        /// <returns>Объект-оболочка ResponsePackagе</returns>
        public ResponsePackage DeleteControlTypeGroupByID(RequestPackage request, IDbConnection connectionID)
        {
            string sql = string.Format(
                " delete from control_type_groups where ID = {0} ",
                request.requestID
            );
            DBUtils.ExecuteSQL(sql, connectionID).ThrowExceptionIfError();
            return new ResponsePackage();
        }
    }
}
