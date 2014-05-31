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
    public class FormInParametersRepository
    {
        public static readonly Dictionary<string, string> mappingDictionary = new Dictionary<string, string>()
        {
            {"ID","ID"},
            {"name","NAME"},
            {"controlID","CONTROL_ID"},
        };

        public static ResponseObjectPackage<List<FormInParameterModel>> GetBySearchTemplate(RequestObjectPackage<FormInParameterSearchTemplate> package, IDbConnection connectionID)
        {
            FormInParameterSearchTemplate obj = package.requestData;
            string sql = string.Format(
                "select ID, CONTROL_ID, NAME " + Environment.NewLine +
                "from FORM_IN_PARAMETERS " + Environment.NewLine +
                "where {0}",
                FormInParametersRepository.ToSqlWhere(obj)
            );
            ResponseTablePackage res = DBUtils.OpenSQL(sql, connectionID);
            res.ThrowExceptionIfError();

            List<FormInParameterModel> list = DBOrmUtils.OpenSqlList<FormInParameterModel>(sql, FormInParametersRepository.mappingDictionary, connectionID);
            return new ResponseObjectPackage<List<FormInParameterModel>>() { resultData = list };
        }

        public static ResponseObjectPackage<List<FormInParameterModel>> GetByFormID(RequestPackage package, IDbConnection connectionID)
        {
            int formID = package.requestID;
            string sql = string.Format(
                "select p.ID, p.CONTROL_ID, p.NAME " + Environment.NewLine +
                "from FORM_IN_PARAMETERS p " + Environment.NewLine +
                "inner join CONTROLS c on c.ID = p.CONTROL_ID " +
                "where c.FORM_ID = {0}",
                formID
            );
            ResponseTablePackage res = DBUtils.OpenSQL(sql, connectionID);
            res.ThrowExceptionIfError();

            List<FormInParameterModel> list = DBOrmUtils.OpenSqlList<FormInParameterModel>(sql, FormInParametersRepository.mappingDictionary, connectionID);
            return new ResponseObjectPackage<List<FormInParameterModel>>() { resultData = list };
        }

        public static string ToSqlWhere(FormInParameterSearchTemplate obj)
        {
            string where = " 1 = 1";
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.ID, "ID");
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.controlID, "CONTROL_ID");
            where += DBOrmUtils.GetSqlWhereFromString(obj.name, "NAME");
            return where;
        }
    }
}
