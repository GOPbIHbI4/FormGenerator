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
    public class QueryEditorDataCRUD
    {

        #region Выборки

        /// <summary>
        /// Получить список типов запросов
        /// </summary>
        /// <param name="request"></param>
        /// <param name="connectionID"></param>
        /// <returns></returns>
        public ResponseObjectPackage<List<QueryTypeModel>> GetQueryTypeList(RequestPackage request, IDbConnection connectionID)
        {
            string sql = string.Format(
                 " select * " +
                 " from query_types "
             );
            List<QueryTypeModel> list = DBOrmUtils.OpenSqlList<QueryTypeModel>(sql, QueryEditorDataCRUD.queryTypeMapping, connectionID);
            return new ResponseObjectPackage<List<QueryTypeModel>>() { resultData = list };
        }

        /// <summary>
        /// Получить тип запроса
        /// </summary>
        /// <param name="request"></param>
        /// <param name="connectionID"></param>
        /// <returns></returns>
        public ResponseObjectPackage<QueryTypeModel> GetQueryType(RequestPackage request, IDbConnection connectionID)
        {
            string sql = string.Format(
                 " select * " +
                 " from query_types " +
                 " where id = {0} ",
                 request.requestID
             );
            ResponseTablePackage res = DBUtils.OpenSQL(sql, connectionID);
            res.ThrowExceptionIfError();
            if (res.resultData.Rows.Count == 1)
            {
                List<QueryTypeModel> list = DBOrmUtils.OpenSqlList<QueryTypeModel>(sql, QueryEditorDataCRUD.queryTypeMapping, connectionID);
                return new ResponseObjectPackage<QueryTypeModel>(){ resultData = list[0] };
            }
            else
            {
                return new ResponseObjectPackage<QueryTypeModel>() { resultCode = -1, resultMessage = "Тип запроса не найден [ID = " + request.requestID + "]." };
            }
        }

        /// <summary>
        /// Получить список входных параметров типов запросов
        /// </summary>
        /// <param name="request"></param>
        /// <param name="connectionID"></param>
        /// <returns></returns>
        public ResponseObjectPackage<List<QueryInParameterModel>> GetQueryInParamsList(RequestPackage request, IDbConnection connectionID)
        {
            string sql = string.Format(
                 " select * " +
                 " from query_in_parameters " +
                 " where query_type_id = {0} ",
                 request.requestID
             );
            List<QueryInParameterModel> list = DBOrmUtils.OpenSqlList<QueryInParameterModel>(sql, QueryEditorDataCRUD.queryTypeInOutMapping, connectionID);
            return new ResponseObjectPackage<List<QueryInParameterModel>>() { resultData = list };
        }

        /// <summary>
        /// Получить список выходных параметров типов запросов
        /// </summary>
        /// <param name="request"></param>
        /// <param name="connectionID"></param>
        /// <returns></returns>
        public ResponseObjectPackage<List<QueryOutParameterModel>> GetQueryOutParamsList(RequestPackage request, IDbConnection connectionID)
        {
            string sql = string.Format(
                 " select * " +
                 " from query_out_parameters " +
                 " where query_type_id = {0} ",
                 request.requestID
             );
            List<QueryOutParameterModel> list = DBOrmUtils.OpenSqlList<QueryOutParameterModel>(sql, QueryEditorDataCRUD.queryTypeInOutMapping, connectionID);
            return new ResponseObjectPackage<List<QueryOutParameterModel>>() { resultData = list };
        }

        #endregion

        #region Сохранение

        /// <summary>
        /// Функция сохранения типа запроса
        /// </summary>
        /// <param name="request"></param>
        /// <param name="connectionID"></param>
        /// <returns></returns>
        public ResponsePackage SaveQueryType(RequestObjectPackage<QueryTypeModel> request, IDbConnection connectionID)
        {
            QueryTypeModel obj = request.requestData;
            string sql = string.Empty;

            if (obj.ID > 0)
            {
                sql = string.Format(
                    " update query_types set sql_text = '{0}' " +
                    " where id = {1} returning id ",
                    obj.sqlText ?? "", obj.ID
                );
            }
            else
            {
                sql = string.Format(
                    " insert into query_types (sql_text) " +
                    " values ('{0}') returning id ",
                    obj.sqlText ?? ""
                );
            }
            ResponseTablePackage res = DBUtils.ExecuteSQL(sql, connectionID, true);
            res.ThrowExceptionIfError();
            return new ResponsePackage() { resultID = res.resultID };
        }

        /// <summary>
        /// Сохранить входной параметр запроса
        /// </summary>
        /// <param name="request"></param>
        /// <param name="connectionID"></param>
        /// <returns></returns>
        public ResponsePackage SaveQueryInParameter(RequestObjectPackage<QueryInParameterModel> request, IDbConnection connectionID)
        {
            QueryInParameterModel obj = request.requestData;
            string sql = string.Empty;

            if (obj.ID > 0)
            {
                sql = string.Format(
                    " update query_in_parameters set name = '{0}', query_type_id = {1}, domain_value_type_id = {2} " +
                    " where id = {3} returning id ",
                    obj.name ?? "", obj.queryTypeID, obj.domainValueTypeID, obj.ID
                );
            }
            else
            {
                sql = string.Format(
                    " insert into query_in_parameters (name, query_type_id, domain_value_type_id) " +
                    " values ('{0}', {1}, {2}) returning id ",
                    obj.name ?? "", obj.queryTypeID, obj.domainValueTypeID
                );
            }
            ResponseTablePackage res = DBUtils.ExecuteSQL(sql, connectionID, true);
            res.ThrowExceptionIfError();
            return new ResponsePackage() { resultID = res.resultID };
        }

        /// <summary>
        /// Сохранить выходной параметр запроса
        /// </summary>
        /// <param name="request"></param>
        /// <param name="connectionID"></param>
        /// <returns></returns>
        public ResponsePackage SaveQueryOutParameter(RequestObjectPackage<QueryOutParameterModel> request, IDbConnection connectionID)
        {
            QueryOutParameterModel obj = request.requestData;
            string sql = string.Empty;

            if (obj.ID > 0)
            {
                sql = string.Format(
                    " update query_out_parameters set name = '{0}', query_type_id = {1}, domain_value_type_id = {2} " +
                    " where id = {3} returning id ",
                    obj.name ?? "", obj.queryTypeID, obj.domainValueTypeID, obj.ID
                );
            }
            else
            {
                sql = string.Format(
                    " insert into query_out_parameters (name, query_type_id, domain_value_type_id) " +
                    " values ('{0}', {1}, {2}) returning id ",
                    obj.name ?? "", obj.queryTypeID, obj.domainValueTypeID
                );
            }
            ResponseTablePackage res = DBUtils.ExecuteSQL(sql, connectionID, true);
            res.ThrowExceptionIfError();
            return new ResponsePackage() { resultID = res.resultID };
        }

        #endregion

        #region Маппинг

        #region Запрос

        public static readonly Dictionary<string, string> queryTypeMapping = new Dictionary<string, string>()
        {
            {"ID","ID"},
            {"sqlText","SQL_TEXT"}
        };

        public static readonly Dictionary<string, string> queryTypeInOutMapping = new Dictionary<string, string>()
        {
            {"ID","ID"},
            {"name","NAME"},
            {"queryTypeID","QUERY_TYPE_ID"},
            {"domainValueTypeID","DOMAIN_VALUE_TYPE_ID"}
        };

        #endregion

        #endregion
    }
}
