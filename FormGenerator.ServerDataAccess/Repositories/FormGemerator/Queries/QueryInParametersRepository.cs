﻿using FormGenerator.Models;
using FormGenerator.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.ServerDataAccess
{
    public static class QueryInParametersRepository
    {
        public static readonly Dictionary<string, string> mappingDictionary = new Dictionary<string, string>()
        {
            {"ID","ID"},
            {"name","NAME"},
            {"queryTypeID","QUERY_TYPE_ID"},
            {"domainValueTypeID","DOMAIN_VALUE_TYPE_ID"}
        };

        public static ResponseObjectPackage<List<QueryInParameterModel>> GetBySearchTemplate(RequestObjectPackage<QueryInParameterSearchTemplate> package, IDbConnection connectionID)
        {
            QueryInParameterSearchTemplate obj = package.requestData;
            string sql = string.Format(
                "select ID, NAME, QUERY_TYPE_ID, DOMAIN_VALUE_TYPE_ID " + Environment.NewLine +
                "from QUERY_IN_PARAMETERS " + Environment.NewLine + 
                "where {0}",
                QueryInParametersRepository.ToSqlWhere(obj)
            ); 
            ResponseTablePackage res = DBUtils.OpenSQL(sql, connectionID);
            res.ThrowExceptionIfError();

            List<QueryInParameterModel> list = DBOrmUtils.OpenSqlList<QueryInParameterModel>(sql, QueryInParametersRepository.mappingDictionary, connectionID);
            return new ResponseObjectPackage<List<QueryInParameterModel>>() { resultData = list };
        }

        public static string ToSqlWhere(QueryInParameterSearchTemplate obj)
        {
            string where = " 1 = 1";
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.ID, "ID");
            where += DBOrmUtils.GetSqlWhereFromString(obj.name, "NAME");
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.queryTypeID, "QUERY_TYPE_ID");
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.domainValueTypeID, "DOMAIN_VALUE_TYPE_ID");
            return where;
        }
    }
}