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
    public static class QueriesRepository
    {
        public static readonly Dictionary<string, string> mappingDictionary = new Dictionary<string, string>()
        {
            {"ID","ID"},
            {"queryTypeID","QUERY_TYPE_ID"},
        };

        public static ResponseObjectPackage<List<QueryModel>> GetBySearchTemplate(RequestObjectPackage<QuerySearchTemplate> package, IDbConnection connectionID)
        {
            QuerySearchTemplate obj = package.requestData;
            string sql = string.Format(
                "select ID, QUERY_TYPE_ID " + Environment.NewLine +
                "from QUERIES " + Environment.NewLine + 
                "where {0}",
                QueriesRepository.ToSqlWhere(obj)
            ); 
            ResponseTablePackage res = DBUtils.OpenSQL(sql, connectionID);
            res.ThrowExceptionIfError();

            List<QueryModel> list = DBOrmUtils.OpenSqlList<QueryModel>(sql, QueriesRepository.mappingDictionary, connectionID);
            return new ResponseObjectPackage<List<QueryModel>>() { resultData = list };
        }

        /// <summary>
        /// Сохранение запроса
        /// </summary>
        /// <param name="package"></param>
        /// <param name="connectionID"></param>
        /// <returns></returns>
        public static ResponsePackage SaveQuery(RequestObjectPackage<QueryModel> package, IDbConnection connectionID, IDbTransaction transactionID)
        {
            QueryModel obj = package.requestData;
            string sql = string.Empty;
            
            if (obj.ID > 0)
            {
                sql = string.Format(
                    " update QUERIES set QUERY_TYPE_ID = {0} " + Environment.NewLine +
                    " where ID = {1} returning ID",
                    obj.queryTypeID,
                    obj.ID
                );
            }
            else
            {
                sql = string.Format(
                    " insert into QUERIES (QUERY_TYPE_ID) " + Environment.NewLine +
                    " values ({0}) returning ID",
                    obj.queryTypeID
                );
            }
            ResponseTablePackage res = DBUtils.ExecuteSQL(sql, connectionID, true, transactionID);
            res.ThrowExceptionIfError();
            return new ResponsePackage() { resultID = res.resultID };
        }
        public static ResponsePackage SaveQuery(RequestObjectPackage<QueryModel> package, IDbConnection connectionID)
        {
            return SaveQuery(package, connectionID, null);
        }

        /// <summary>
        /// Удалить все о query по FormID
        /// </summary>
        /// <param name="request"></param>
        /// <param name="connectionID"></param>
        /// <param name="transactionID"></param>
        /// <returns></returns>
        public static ResponsePackage DeleteAllQueriesByFormID(RequestPackage request, IDbConnection connectionID, IDbTransaction transactionID)
        {
            int formID = request.requestID;

            string sql = string.Format(
               " delete from CONTROL_QUERY_MAPPING " +
               " where control_id in (" +
               "  select control_id from controls where form_id = {0}" +
               ") ",
               formID
           );
            DBUtils.ExecuteSQL(sql, connectionID, false, transactionID).ThrowExceptionIfError();

            sql = string.Format(
                " delete from QUERY_QUERY_IN_PARAMETER " +
                " where control_id in (" +
                "  select control_id from controls where form_id = {0}" +
                ") ",
                formID
            );
            DBUtils.ExecuteSQL(sql, connectionID, false, transactionID).ThrowExceptionIfError();

            sql = string.Format(
               " delete from QUERIES " +
               " where id in (" +
               "  select query_id from QUERY_QUERY_IN_PARAMETER where control_id in (" +
               "     select control_id from controls where form_id = {0} " +
               "  )" +
               ") ",
               formID
           );
            DBUtils.ExecuteSQL(sql, connectionID, false, transactionID).ThrowExceptionIfError();

            sql = string.Format(
                " delete from CONTROL_DICTIONARY_MAPPING " +
                " where control_id in (" +
                "  select control_id from controls where form_id = {0}" +
                ") ",
                formID
            );
            DBUtils.ExecuteSQL(sql, connectionID, false, transactionID).ThrowExceptionIfError();

            return new ResponsePackage();
        }
        
        public static string ToSqlWhere(QuerySearchTemplate obj)
        {
            string where = " 1 = 1";
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.ID, "ID");
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.queryTypeID, "QUERY_TYPE_ID");
            return where;
        }
    }
}
