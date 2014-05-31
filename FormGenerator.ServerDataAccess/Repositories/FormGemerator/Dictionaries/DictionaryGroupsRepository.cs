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
    public static class DictionaryGroupsRepository
    {
        public static readonly Dictionary<string, string> mappingDictionary = new Dictionary<string, string>()
        {
            {"ID","ID"},
            {"name","NAME"},
            {"dictionaryGroupID_Parent","DICTIONARY_GROUP_ID_PARENT"},
            {"dictionaryGroupID_Root","DICTIONARY_GROUP_ID_ROOT"}
        };
        public static ResponseObjectPackage<List<DictionaryGruopModel>> GetBySearchTemplate(RequestObjectPackage<DictionaryGroupSearchTemplate> package, IDbConnection connectionID)
        {
            DictionaryGroupSearchTemplate obj = package.requestData;
            string sql = string.Format(
                "select ID, NAME, DICTIONARY_GROUP_ID_PARENT, DICTIONARY_GROUP_ID_ROOT " + Environment.NewLine +
                "from dictionary_groups " + Environment.NewLine +
                "where {0}",
                DictionaryGroupsRepository.ToSqlWhere(obj)
            );
            ResponseTablePackage res = DBUtils.OpenSQL(sql, connectionID);
            res.ThrowExceptionIfError();

            List<DictionaryGruopModel> list = DBOrmUtils.OpenSqlList<DictionaryGruopModel>(sql, DictionaryGroupsRepository.mappingDictionary, connectionID);
            return new ResponseObjectPackage<List<DictionaryGruopModel>>() { resultData = list };
        }

        public static string ToSqlWhere(DictionaryGroupSearchTemplate obj)
        {
            string where = " 1 = 1";
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.ID, "ID");
            where += DBOrmUtils.GetSqlWhereFromString(obj.name, "NAME");
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.dictionaryGroupID_Parent, "DICTIONARY_GROUP_ID_PARENT");
            where += DBOrmUtils.GetSqlWhereFromNumber(obj.dictionaryGroupID_Root, "DICTIONARY_GROUP_ID_ROOT");
            return where;
        }

        public static ResponsePackage SaveDictionaryGroup(RequestObjectPackage<DictionaryGruopModel> request, IDbConnection connectionID)
        {
            DictionaryGruopModel obj = request.requestData;
            bool isEdit = obj.ID > 0;

            string sql = null;
            if (isEdit)
            {
                sql = string.Format(
                    "update DICTIONARY_GROUPS " + Environment.NewLine +
                    "set ID = {0}, NAME = {1}, DICTIONARY_GROUP_ID_PARENT = {2} " + Environment.NewLine +
                    "where ID = {0} ",
                        SQL.FromNumber(obj.ID),
                        SQL.FromString(obj.name),
                        SQL.FromNumber(obj.dictionaryGroupID_Parent)
                );
            }
            else
            {
                sql = string.Format(
                   "insert into DICTIONARY_GROUPS " + Environment.NewLine +
                   "(NAME, DICTIONARY_GROUP_ID_PARENT) " + Environment.NewLine +
                   "values ({0}, {1}) returning ID",
                        SQL.FromString(obj.name),
                        SQL.FromNumber(obj.dictionaryGroupID_Parent)
                );
            }

            ResponseTablePackage res = DBUtils.ExecuteSQL(sql, connectionID, !isEdit);
            res.ThrowExceptionIfError();

            return new ResponsePackage() { resultID = isEdit ? obj.ID : res.resultID };
        }

        public static ResponsePackage DeleteDictionaryGroup(RequestPackage request, IDbConnection connectionID)
        {
            int id = request.requestID;
            string sql = string.Format(
                "select * " +
                "from DICTIONARY_GROUPS " + Environment.NewLine +
                "where DICTIONARY_GROUP_ID_PARENT = {0} ",
                id
            );
            ResponseTablePackage res = DBUtils.OpenSQL(sql, connectionID);
            res.ThrowExceptionIfError();
            if (res.resultData.Rows.Count > 0)
            {
                return new ResponsePackage()
                {
                    resultCode = -1,
                    resultMessage = "Удаление невозможно! " +
                    "Существуют группы словарей, для которых данная группа является родительской!"
                };
            }

            sql = string.Format(
                "select * " +
                "from DICTIONARIES " + Environment.NewLine +
                "where DICTIONARY_GROUP_ID = {0} ",
                id
            );
            res = DBUtils.OpenSQL(sql, connectionID);
            res.ThrowExceptionIfError();
            if (res.resultData.Rows.Count > 0)
            {
                return new ResponsePackage()
                {
                    resultCode = -1,
                    resultMessage = "Удаление невозможно! " +
                        "В выбранной группе есть словари!"
                };
            }

            sql = string.Format(
                "delete from DICTIONARY_GROUPS " + Environment.NewLine +
                "where ID = {0} ",
                id
            );
            DBUtils.ExecuteSQL(sql, connectionID).ThrowExceptionIfError();
            return new ResponsePackage();
        }
    }
}
