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
    public static class ActionsRepository
    {
        public static readonly Dictionary<string, string> mappingDictionary = new Dictionary<string, string>()
        {
            {"ID","ID"},
            {"eventID","EVENT_ID"},
            {"orderNumber","ORDER_NUMBER"},
            {"actionTypeID","ACTION_TYPE_ID"},
        };

        public static ResponseObjectPackage<List<ActionModel>> GetBySearchTemplate(RequestObjectPackage<ActionSearchTemplate> request, IDbConnection connectionID)
        {
            ActionSearchTemplate obj = request.requestData;
            string sql = string.Format(
                "select ID, EVENT_ID, ORDER_NUMBER, ACTION_TYPE_ID " + Environment.NewLine +
                "from ACTIONS " + Environment.NewLine +
                "where {0}",
                    ToSqlWhere(obj)
            );

            List<ActionModel> list = DBOrmUtils.OpenSqlList<ActionModel>(sql, mappingDictionary, connectionID);
            return new ResponseObjectPackage<List<ActionModel>>() { resultData = list };
        }

        public static ResponseObjectPackage<List<ActionModel>> GetByEventsList(RequestObjectPackage<List<EventModel>> request, IDbConnection connectionID)
        {
            List<int> obj = (request.requestData ?? new List<EventModel>()).Select(e => e.ID).ToList();
            obj.Add(-1);
            string sql = string.Format(
                "select ID, EVENT_ID, ORDER_NUMBER, ACTION_TYPE_ID " + Environment.NewLine +
                "from ACTIONS " + Environment.NewLine +
                "where EVENT_ID in({0});",
                    string.Join(", ", obj)
            );

            List<ActionModel> list = DBOrmUtils.OpenSqlList<ActionModel>(sql, mappingDictionary, connectionID);
            return new ResponseObjectPackage<List<ActionModel>>() { resultData = list };
        }

        public static string ToSqlWhere(ActionSearchTemplate obj)
        {
            string where = " 1 = 1";
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.ID, "ID");
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.eventID, "EVENT_ID");
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.orderNumber, "ORDER_NUMBER");
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.actionTypeID, "ACTION_TYPE_ID");
            return where;
        }

        public static ResponsePackage Save(RequestObjectPackage<ActionModel> request, IDbConnection connectionID)
        {
            return Save(request, connectionID, null);
        }
        public static ResponsePackage Save(RequestObjectPackage<ActionModel> request, IDbConnection connectionID, IDbTransaction transactionID)
        {
            ActionModel obj = request.requestData;
            string sql = string.Empty;

            if (obj.ID > 0)
            {
                sql = string.Format(
                    " update ACTIONS set EVENT_ID = {0}, ORDER_NUMBER = {1}, ACTION_TYPE_ID = {2} " + Environment.NewLine +
                    " where ID = {3} returning ID",
                    SQL.FromNumber(obj.eventID),
                    SQL.FromNumber(obj.orderNumber),
                    SQL.FromNumber(obj.actionTypeID),
                    SQL.FromNumber(obj.ID)
                );
            }
            else
            {
                sql = string.Format(
                    " insert into ACTIONS (EVENT_ID, ORDER_NUMBER, ACTION_TYPE_ID) " + Environment.NewLine +
                    " values ({0}, {1}, {2}) returning ID",
                    SQL.FromNumber(obj.eventID),
                    SQL.FromNumber(obj.orderNumber),
                    SQL.FromNumber(obj.actionTypeID)
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
                "delete from ACTIONS" +
                "where ID = {0}",
                    ID
            );
            DBUtils.ExecuteSQL(sql, connectionID, false, transactionID).ThrowExceptionIfError();
            return new ResponsePackage();
        }
    }
}
