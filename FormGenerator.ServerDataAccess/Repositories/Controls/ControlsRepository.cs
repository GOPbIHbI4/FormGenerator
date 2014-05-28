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
    }
}
