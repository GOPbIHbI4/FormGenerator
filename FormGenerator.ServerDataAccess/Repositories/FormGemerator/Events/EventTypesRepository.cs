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
    public static class EventTypesRepository
    {
        public static readonly Dictionary<string, string> mappingDictionary = new Dictionary<string, string>()
        {
            {"ID","ID"},
            {"name","NAME"}
        };

        public static ResponseObjectPackage<List<EventTypeModel>> GetBySearchTemplate(RequestObjectPackage<EventTypeSearchTemplate> request, IDbConnection connectionID)
        {
            EventTypeSearchTemplate obj = request.requestData;
            string sql = string.Format(
                "select ID, NAME " + Environment.NewLine +
                "from EVENT_TYPES " + Environment.NewLine +
                "where {0}",
                    ToSqlWhere(obj)
            );

            List<EventTypeModel> list = DBOrmUtils.OpenSqlList<EventTypeModel>(sql, mappingDictionary, connectionID);
            return new ResponseObjectPackage<List<EventTypeModel>>() { resultData = list };
        }
        public static string ToSqlWhere(EventTypeSearchTemplate obj)
        {
            string where = " 1 = 1";
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.ID, "ID");
            where += DBOrmUtils.GetSqlWhereFromString(obj.name, "NAME");
            return where;
        }

        public static ResponsePackage Save(RequestObjectPackage<EventTypeModel> request, IDbConnection connectionID)
        {
            return Save(request, connectionID, null);
        }
        public static ResponsePackage Save(RequestObjectPackage<EventTypeModel> request, IDbConnection connectionID, IDbTransaction transactionID)
        {
            EventTypeModel obj = request.requestData;
            string sql = string.Empty;

            if (obj.ID > 0)
            {
                sql = string.Format(
                    " update EVENT_TYPES set NAME = {0} " + Environment.NewLine +
                    " where ID = {1} returning ID",
                    SQL.FromString(obj.name),
                    SQL.FromNumber(obj.ID)
                );
            }
            else
            {
                sql = string.Format(
                    " insert into EVENT_TYPES (NAME) " + Environment.NewLine +
                    " values ({0}) returning ID",
                    SQL.FromString(obj.name)
                );
            }
            ResponseTablePackage res = DBUtils.ExecuteSQL(sql, connectionID, true, transactionID);
            res.ThrowExceptionIfError();
            return new ResponsePackage() { resultID = res.resultID };
        }

        public static ResponsePackage Delete(RequestPackage request, IDbConnection connectionID)
        {
            return Delete(request, connectionID, null);
        }
        public static ResponsePackage Delete(RequestPackage request, IDbConnection connectionID, IDbTransaction transactionID)
        {
            int ID = request.requestID;
            string sql = string.Format(
                "delete from EVENT_TYPES" +
                "where ID = {0}",
                    ID
            );
            DBUtils.ExecuteSQL(sql, connectionID, false, transactionID).ThrowExceptionIfError();
            return new ResponsePackage();
        }
    }
}
