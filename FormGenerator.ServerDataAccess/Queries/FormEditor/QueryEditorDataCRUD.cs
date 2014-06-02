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
        /// Выбрать все запросы по ID формы
        /// </summary>
        /// <param name="request"></param>
        /// <param name="connectionID"></param>
        /// <returns></returns>
        public ResponseObjectPackage<List<OpenQuery>> GetQueriesByFormID(RequestPackage request, IDbConnection connectionID)
        {
            int formID = request.requestID;
            string sql = string.Format(
                 " select q.ID, q.QUERY_TYPE_ID, qt.SQL_TEXT " +
                 " from QUERIES q " +
                 " left join QUERY_TYPES qt on q.QUERY_TYPE_ID = qt.ID " +
                 " left join CONTROL_QUERY_MAPPING qm on qm.QUERY_ID = q.ID " +
                 " where qm.control_id in (" +
                 "  select control_id from controls where form_id = {0} " +
                 ") ",
                 formID
             );
            List<OpenQuery> list = DBOrmUtils.OpenSqlList<OpenQuery>(sql, QueryEditorDataCRUD.queryFormMapping, connectionID);
            foreach (OpenQuery query in list)
            {
                query._ID = query.ID;
                sql = string.Format(
                    " select qq.ID, qq.QUERY_ID, qq.QUERY_IN_PARAMETER_ID, q.QUERY_TYPE_ID, qp.NAME as QUERY_IN_PARAMETER_NAME, p.VALUE_ " +
                    " from QUERY_QUERY_IN_PARAMETER qq " +
                    " left join QUERIES q on q.ID = qq.QUERY_ID " +
                    " left join QUERY_IN_PARAMETERS qp on qp.ID = qq.QUERY_IN_PARAMETER_ID " +
                    " left join CONTROLS c on c.ID = qq.CONTROL_ID " +
                    " left join CONTROL_PROPERTIES p on c.ID = p.CONTROL_ID " +
                    " left join CONTROL_TYPE_PROPERTY_TYPE ctpt on ctpt.ID = p.CONTROL_PROPERTY_TYPE_ID " +
                    " left join CONTROL_PROPERTY_TYPES cpt on cpt.ID = ctpt.CONTROL_PROPERTY_TYPE_ID " +
                    " where qq.QUERY_ID = {0} and cpt.NAME = 'name' ",
                    query.ID
                );
                List<OpenQueryParams> parameters = DBOrmUtils.OpenSqlList<OpenQueryParams>(sql, QueryEditorDataCRUD.queryFormParamMapping, connectionID);
                parameters.ForEach(x => x.query_ID = x.queryID); 
                query.queryInParams = parameters;
            }

            return new ResponseObjectPackage<List<OpenQuery>>() { resultData = list };
        }

        /// <summary>
        /// Получить значение данных для контрла
        /// </summary>
        /// <param name="request"></param>
        /// <param name="connectionID"></param>
        /// <returns></returns>
        public ResponseObjectPackage<QueryData> GetQueryDataByControlID(RequestPackage request, IDbConnection connectionID)
        {
            int controlID = request.requestID;
            QueryData result = new QueryData();
            string sql = string.Format(
                 " select qm.QUERY_ID, qm.QUERY_OUT_PARAMETER_ID, qm.QUERY_MAPPING_ROLE_ID, cdm.DICTIONARY_FIELD_ID " +
                 " from CONTROL_QUERY_MAPPING qm " +
                 " left join QUERY_OUT_PARAMETERS qop on qm.QUERY_OUT_PARAMETER_ID = qop.ID " +
                 " left join CONTROL_DICTIONARY_MAPPING cdm on cdm.ID = qm.CONTROL_ID " +
                 " where qm.CONTROL_ID = {0}",
                 controlID
             );
            List<QueryOutParams> list = DBOrmUtils.OpenSqlList<QueryOutParams>(sql, QueryEditorDataCRUD.queryOutParamMapping, connectionID);
            foreach (QueryOutParams parameter in list)
            {
                result.queryID = parameter.queryID;
                result.saveField = parameter.dictionaryFieldID;
                if (parameter.queryMappingRoleID == 1)
                {
                    result.queryOutValueID = parameter.queryOutParameterID;
                }
                else if (parameter.queryMappingRoleID == 2)
                {
                    result.queryOutKeyID = parameter.queryOutParameterID;
                }
            }

            return new ResponseObjectPackage<QueryData>() { resultData = result };
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

        public static readonly Dictionary<string, string> queryFormMapping = new Dictionary<string, string>()
        {
            {"ID","ID"},
            {"queryTypeID","QUERY_TYPE_ID"},
            {"sqlText","SQL_TEXT"}
        };

        public static readonly Dictionary<string, string> queryFormParamMapping = new Dictionary<string, string>()
        {
            {"ID","ID"},
            {"queryID","QUERY_ID"},
            {"queryTypeID","QUERY_TYPE_ID"},
            {"queryInParameterName","QUERY_IN_PARAMETER_NAME"},
            {"controlName","VALUE_"},
            {"queryInParameterID","QUERY_IN_PARAMETER_ID"}
        };

        public static readonly Dictionary<string, string> queryOutParamMapping = new Dictionary<string, string>()
        {
            {"queryID","QUERY_ID"},
            {"queryOutParameterID","QUERY_OUT_PARAMETER_ID"},
            {"queryMappingRoleID","QUERY_MAPPING_ROLE_ID"},
            {"dictionaryFieldID","DICTIONARY_FIELD_ID"}
        };

        class QueryOutParams
        {
            public int? queryID { get; set; }
            public int? queryOutParameterID { get; set; }
            public int? queryMappingRoleID { get; set; }
            public int? dictionaryFieldID { get; set; }
        }

        #endregion
    }
}
