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
    public class FormOutParametersRepository
    {
        public static readonly Dictionary<string, string> mappingDictionary = new Dictionary<string, string>()
        {
            {"ID","ID"},
            {"name","NAME"},
            {"controlID","CONTROL_ID"},
        };

        public static ResponseObjectPackage<List<FormOutParameterModel>> GetBySearchTemplate(RequestObjectPackage<FormOutParameterSearchTemplate> package, IDbConnection connectionID)
        {
            FormOutParameterSearchTemplate obj = package.requestData;
            string sql = string.Format(
                "select ID, CONTROL_ID, NAME " + Environment.NewLine +
                "from FORM_IN_PARAMETERS " + Environment.NewLine +
                "where {0}",
                FormOutParametersRepository.ToSqlWhere(obj)
            );
            ResponseTablePackage res = DBUtils.OpenSQL(sql, connectionID);
            res.ThrowExceptionIfError();

            List<FormOutParameterModel> list = DBOrmUtils.OpenSqlList<FormOutParameterModel>(sql, FormOutParametersRepository.mappingDictionary, connectionID);
            return new ResponseObjectPackage<List<FormOutParameterModel>>() { resultData = list };
        }

        public static ResponsePackage SaveOutParam(RequestObjectPackage<FormOutParameterModel> request, IDbConnection connectionID, IDbTransaction transactionID)
        {
            FormOutParameterModel obj = request.requestData;
            string sql = string.Empty;

            if (obj.ID > 0)
            {
                sql = string.Format(
                    " update FORM_OUT_PARAMETERS set NAME = '{0}', CONTROL_ID = {1} " +
                    " where ID = {2} returning id ",
                    obj.name ?? "",
                    obj.controlID,
                    obj.ID
                );
            }
            else
            {
                sql = string.Format(
                    " insert into FORM_OUT_PARAMETERS (NAME, CONTROL_ID) " +
                    " values ('{0}', {1}) returning id ",
                    obj.name ?? "",
                    obj.controlID
                );
            }
            ResponseTablePackage res = DBUtils.ExecuteSQL(sql, connectionID, true, transactionID);
            res.ThrowExceptionIfError();
            return new ResponsePackage() { resultID = res.resultID };
        }
        public static ResponsePackage SaveOutParam(RequestObjectPackage<FormOutParameterModel> request, IDbConnection connectionID)
        {
            return SaveOutParam(request, connectionID, null);
        }

        public static ResponseObjectPackage<List<FormOutParameterModel>> GetByFormID(RequestPackage package, IDbConnection connectionID)
        {
            int formID = package.requestID;
            string sql = string.Format(
                "select p.ID, p.CONTROL_ID, p.NAME " + Environment.NewLine +
                "from FORM_OUT_PARAMETERS p " + Environment.NewLine +
                "inner join CONTROLS c on c.ID = p.CONTROL_ID " +
                "where c.FORM_ID = {0}",
                formID
            );
            ResponseTablePackage res = DBUtils.OpenSQL(sql, connectionID);
            res.ThrowExceptionIfError();

            List<FormOutParameterModel> list = DBOrmUtils.OpenSqlList<FormOutParameterModel>(sql, FormOutParametersRepository.mappingDictionary, connectionID);
            return new ResponseObjectPackage<List<FormOutParameterModel>>() { resultData = list };
        }

        public static ResponsePackage DeleteByFormID(RequestPackage request, IDbConnection connectionID, IDbTransaction transactionID)
        {
            int formID = request.requestID;
            string sql = string.Format(
                " delete from FORM_OUT_PARAMETERS " +
                " where control_id in (" +
                "   select control_id from controls where form_id = {0} " +
                ") ",
                formID
            );
            DBUtils.ExecuteSQL(sql, connectionID, false, transactionID).ThrowExceptionIfError();

            return new ResponsePackage();
        }

        public static string ToSqlWhere(FormOutParameterSearchTemplate obj)
        {
            string where = " 1 = 1";
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.ID, "ID");
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.controlID, "CONTROL_ID");
            where += DBOrmUtils.GetSqlWhereFromString(obj.name, "NAME");
            return where;
        }
    }
}
