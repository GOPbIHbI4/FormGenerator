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
    public static class EventsRepository
    {
        public static readonly Dictionary<string, string> mappingDictionary = new Dictionary<string, string>()
        {
            {"ID","ID"},
            {"eventTypeID","EVENT_TYPE_ID"},
            {"controlID","CONTROL_ID"},
        };

        public static ResponseObjectPackage<List<EventModel>> GetBySearchTemplate(RequestObjectPackage<EventSearchTemplate> request, IDbConnection connectionID)
        {
            EventSearchTemplate obj = request.requestData;
            string sql = string.Format(
                "select ID, EVENT_TYPE_ID, CONTROL_ID " + Environment.NewLine +
                "from EVENTS " + Environment.NewLine +
                "where {0}",
                ToSqlWhere(obj)
            );
            ResponseTablePackage res = DBUtils.OpenSQL(sql, connectionID);
            res.ThrowExceptionIfError();

            List<EventModel> list = DBOrmUtils.OpenSqlList<EventModel>(sql, mappingDictionary, connectionID);
            return new ResponseObjectPackage<List<EventModel>>() { resultData = list };
        }
        public static string ToSqlWhere(EventSearchTemplate obj)
        {
            string where = " 1 = 1";
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.ID, "ID");
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.eventTypeID, "EVENT_TYPE_ID");
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.controlID, "CONTROL_ID");
            return where;
        }

        public static ResponsePackage Save(RequestObjectPackage<EventModel> request, IDbConnection connectionID)
        {
            return Save(request, connectionID, null);
        }
        public static ResponsePackage Save(RequestObjectPackage<EventModel> request, IDbConnection connectionID, IDbTransaction transactionID)
        {
            EventModel obj = request.requestData;
            string sql = string.Empty;

            if (obj.ID > 0)
            {
                sql = string.Format(
                    " update EVENTS set EVENT_TYPE_ID = {0}, CONTROL_ID = {1} " + Environment.NewLine +
                    " where ID = {2} returning ID",
                    SQL.FromNumber(obj.eventTypeID),
                    SQL.FromNumber(obj.controlID),
                    SQL.FromNumber(obj.ID)
                );
            }
            else
            {
                sql = string.Format(
                    " insert into EVENTS (EVENT_TYPE_ID, CONTROL_ID) " + Environment.NewLine +
                    " values ({0}, {1}) returning ID",
                    SQL.FromNumber(obj.eventTypeID),
                    SQL.FromNumber(obj.controlID)
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
                "delete from EVENTS" +
                "where ID = {0}",
                    ID
            );
            DBUtils.ExecuteSQL(sql, connectionID, false, transactionID).ThrowExceptionIfError();
            return new ResponsePackage();
        }
    }
}
