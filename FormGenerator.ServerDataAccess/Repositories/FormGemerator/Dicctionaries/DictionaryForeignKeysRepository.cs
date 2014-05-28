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
    public static class DictionaryForeignKeysRepository
    {
        public static readonly Dictionary<string, string> mappingDictionary = new Dictionary<string, string>()
        {
            {"ID","ID"},
            {"dictionaryFieldIDSource","DICTIONARY_FIELD_ID_SOURCE"},
            {"dictionaryFieldIDDestination","DICTIONARY_FIELD_ID_DESTINATION"},
        };

        public static ResponseObjectPackage<List<DictionaryForeignKeyModel>> GetBySearchTemplate(RequestObjectPackage<DictionaryForeignKeySearchTemplate> package, IDbConnection connectionID)
        {
            DictionaryForeignKeySearchTemplate obj = package.requestData;
            string sql = string.Format(
                "select ID, DICTIONARY_FIELD_ID_SOURCE, DICTIONARY_FIELD_ID_DESTINATION " + Environment.NewLine +
                "from DICTIONARY_FOREIGN_KEYS " + Environment.NewLine + 
                "where {0}",
                DictionaryForeignKeysRepository.ToSqlWhere(obj)
            ); 
            ResponseTablePackage res = DBUtils.OpenSQL(sql, connectionID);
            res.ThrowExceptionIfError();

            List<DictionaryForeignKeyModel> list = DBOrmUtils.OpenSqlList<DictionaryForeignKeyModel>(sql, DictionaryForeignKeysRepository.mappingDictionary, connectionID);
            return new ResponseObjectPackage<List<DictionaryForeignKeyModel>>() { resultData = list };
        }

        public static ResponseObjectPackage<List<DictionaryForeignKeyModel>> GetByDictionaryIDSource(RequestPackage package, IDbConnection connectionID)
        {
            int dictionaryID = package.requestID;
            string sql = string.Format(
                "select k.ID, k.DICTIONARY_FIELD_ID_SOURCE, k.DICTIONARY_FIELD_ID_DESTINATION " + Environment.NewLine +
                "from DICTIONARY_FOREIGN_KEYS k " + Environment.NewLine +
                "inner join DICTIONARY_FIELDS f on f.ID = k.DICTIONARY_FIELD_ID_SOURCE " + Environment.NewLine +
                "where f.DICTIONARY_ID = {0};",
                    dictionaryID
            );
            ResponseTablePackage res = DBUtils.OpenSQL(sql, connectionID);
            res.ThrowExceptionIfError();

            List<DictionaryForeignKeyModel> list = DBOrmUtils.OpenSqlList<DictionaryForeignKeyModel>(sql, DictionaryForeignKeysRepository.mappingDictionary, connectionID);
            return new ResponseObjectPackage<List<DictionaryForeignKeyModel>>() { resultData = list };
        }


        public static string ToSqlWhere(DictionaryForeignKeySearchTemplate obj)
        {
            string where = " 1 = 1";
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.ID, "ID");
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.dictionaryFieldIDSource, "DICTIONARY_FIELD_ID_SOURCE");
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.dictionaryFieldIDDestination, "DICTIONARY_FIELD_ID_DESTINATION");
            return where;
        }
    }
}