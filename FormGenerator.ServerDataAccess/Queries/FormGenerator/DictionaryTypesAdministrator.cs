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
    public class DictionaryTypesAdministrator
    {
        private static Dictionary<string, string> mapping = new Dictionary<string, string>() 
        {
            { "ID" , "ID" },
            { "name" , "NAME" },
            { "columnName" , "COLUMN_NAME" },
            { "dictionaryID" , "DICTIONARY_ID" },
            { "domainValueTypeID" , "DOMAIN_VALUE_TYPE_ID" },
            { "domainValueTypeName" , "VALUE_TYPE_NAME" },
            { "pkID" , "PK_ID" },
            { "fkID" , "FK_ID" },
            { "fkDictionaryFieldName" , "FK_FIELD_NAME" },
            { "fkDictionaryName" , "FK_DICTIONARY_NAME" },
        };

        public ResponseObjectPackage<List<DictionaryFieldAdminModel>> GetDictionaryTypesAdministratorData(RequestPackage request, IDbConnection connectionID)
        {


            int dictionaryID = request.requestID;
            string sql = string.Format(
                "select df.ID, df.NAME, df.COLUMN_NAME, df.DICTIONARY_ID, df.DOMAIN_VALUE_TYPE_ID, t.NAME as VALUE_TYPE_NAME,  " + Environment.NewLine +
                "pk.ID as PK_ID, fk.ID as FK_ID, df_fk.NAME as FK_FIELD_NAME, d_fk.NAME as FK_DICTIONARY_NAME " + Environment.NewLine +
                "from DICTIONARY_FIELDS df " + Environment.NewLine +
                "inner join DOMAIN_VALUE_TYPES t on t.ID = df.DOMAIN_VALUE_TYPE_ID " + Environment.NewLine +
                "left join DICTIONARY_PRIMARY_KEYS pk on pk.DICTIONARY_FIELD_ID = df.ID " + Environment.NewLine +
                "left join DICTIONARY_FOREIGN_KEYS fk on fk.DICTIONARY_FIELD_ID_SOURCE = df.ID " + Environment.NewLine +
                "left join DICTIONARY_FIELDS df_fk on fk.DICTIONARY_FIELD_ID_DESTINATION = df_fk.ID " + Environment.NewLine +
                "left join DICTIONARIES d_fk on df_fk.DICTIONARY_ID = d_fk.ID " + Environment.NewLine +

                "where df.DICTIONARY_ID = {0}",
                dictionaryID
            );

            List<DictionaryFieldAdminModel> list = DBOrmUtils.OpenSqlList<DictionaryFieldAdminModel>(sql, DictionaryTypesAdministrator.mapping, connectionID);
            list.ForEach(e => e.SetPK());
            return new ResponseObjectPackage<List<DictionaryFieldAdminModel>>() { resultData = list };
        }

        public ResponsePackage SaveDictionary(RequestObjectPackage<DictionaryModel> request, IDbConnection connectionID)
        {
            DictionaryModel obj = request.requestData;
            bool isEdit = obj.ID > 0;
            int dictionaryID = 0;
            using (IDbTransaction transactionID = connectionID.BeginTransaction())
            {
                try
                {
                    this.CreateTableForDictionary(obj, connectionID, transactionID);
                    dictionaryID = DictionariesRepository.SaveDictionary(request, connectionID, transactionID).GetIdOrExceptionIfError();
                    if (!isEdit)
                    {
                        RequestObjectPackage<DictionaryFieldModel> fieldRequest = new RequestObjectPackage<DictionaryFieldModel>()
                        {
                            requestData = new DictionaryFieldModel()
                            {
                                ID = 0,
                                dictionaryID = dictionaryID,
                                columnName = "ID",
                                name = "Уникальный ключ",
                                domainValueTypeID = 3
                            }
                        };
                        int dictionaryFieldID = DictionaryFieldsRepository.SaveDictionaryField(fieldRequest, connectionID, transactionID).GetIdOrExceptionIfError();

                        RequestObjectPackage<DictionaryPrimaryKeyModel> pkRequest = new RequestObjectPackage<DictionaryPrimaryKeyModel>()
                        {
                            requestData = new DictionaryPrimaryKeyModel()
                            {
                                ID = 0,
                                dictionaryID = dictionaryID,
                                dictionaryFieldID = dictionaryFieldID
                            }
                        };
                        DictionaryPrimaryKeysRepository.SavePrimaryKey(pkRequest, connectionID, transactionID).ThrowExceptionIfError();
                    }
                    transactionID.Commit();
                }
                catch (Exception ex)
                {
                    transactionID.Rollback();
                    return new ResponsePackage()
                    {
                        resultCode = -1,
                        resultMessage = "Не удалось сохранить словарь! " + ex.Message
                    };
                }
            }
            return new ResponsePackage() { resultID = dictionaryID };
        }
        public ResponsePackage DeleteDictionary(RequestPackage request, IDbConnection connectionID)
        {
            int dictionaryID = request.requestID;

            RequestObjectPackage<DictionarySearchTemplate> dictRequest = new RequestObjectPackage<DictionarySearchTemplate>()
            {
                requestData = new DictionarySearchTemplate()
                {
                    ID = dictionaryID
                }
            };
            DictionaryModel dictionary = DictionariesRepository.GetBySearchTemplate(dictRequest, connectionID).GetDataOrExceptionIfError().First();

            RequestObjectPackage<DictionaryFieldSearchTemplate> fieldsRequest = new RequestObjectPackage<DictionaryFieldSearchTemplate>()
            {
                requestData = new DictionaryFieldSearchTemplate()
                {
                    dictionaryID = dictionaryID
                }
            };
            List<DictionaryFieldModel> fields = DictionaryFieldsRepository.GetBySearchTemplate(fieldsRequest, connectionID).GetDataOrExceptionIfError();

            RequestObjectPackage<DictionaryPrimaryKeySearchTemplate> pkRequest = new RequestObjectPackage<DictionaryPrimaryKeySearchTemplate>()
            {
                requestData = new DictionaryPrimaryKeySearchTemplate()
                {
                    dictionaryID = dictionaryID
                }
            };
            DictionaryPrimaryKeyModel pk = DictionaryPrimaryKeysRepository.GetBySearchTemplate(pkRequest, connectionID).GetDataOrExceptionIfError().First();

            List<DictionaryForeignKeyModel> fks = new List<DictionaryForeignKeyModel>();

            foreach (DictionaryFieldModel field in fields)
            {
                RequestObjectPackage<DictionaryForeignKeySearchTemplate> fkRequest = new RequestObjectPackage<DictionaryForeignKeySearchTemplate>()
                {
                    requestData = new DictionaryForeignKeySearchTemplate()
                    {
                        dictionaryFieldIDDestination = field.ID
                    }
                };
                fks.AddRange(DictionaryForeignKeysRepository.GetBySearchTemplate(fkRequest, connectionID).GetDataOrExceptionIfError());
                fkRequest = new RequestObjectPackage<DictionaryForeignKeySearchTemplate>()
                {
                    requestData = new DictionaryForeignKeySearchTemplate()
                    {
                        dictionaryFieldIDSource = field.ID
                    }
                };
                fks.AddRange(DictionaryForeignKeysRepository.GetBySearchTemplate(fkRequest, connectionID).GetDataOrExceptionIfError());
            }

            using (IDbTransaction transactionID = connectionID.BeginTransaction())
            {
                try
                {
                    RequestPackage deleteRequest = null;
                    foreach (DictionaryForeignKeyModel fk in fks)
                    {
                        deleteRequest = new RequestPackage()
                        {
                            requestID = fk.ID
                        };
                        DictionaryForeignKeysRepository.DeleteForeignKey(deleteRequest, connectionID, transactionID).ThrowExceptionIfError();
                    }
                    deleteRequest = new RequestPackage()
                    {
                        requestID = pk.ID
                    };
                    DictionaryPrimaryKeysRepository.DeletePrimaryKey(deleteRequest, connectionID, transactionID).ThrowExceptionIfError();

                    foreach (DictionaryFieldModel field in fields)
                    {
                        deleteRequest = new RequestPackage()
                        {
                            requestID = field.ID
                        };
                        DictionaryFieldsRepository.DeleteDictionaryField(deleteRequest, connectionID, transactionID).ThrowExceptionIfError();
                    }


                    deleteRequest = new RequestPackage()
                    {
                        requestID = dictionaryID
                    };
                    DictionariesRepository.DeleteDictionary(deleteRequest, connectionID, transactionID).ThrowExceptionIfError();
                    this.DropTableForDictionary(dictionary.tableName, connectionID, transactionID);
                    transactionID.Commit();
                }
                catch (Exception ex)
                {
                    transactionID.Rollback();
                    return new ResponsePackage()
                    {
                        resultCode = -1,
                        resultMessage = "Не удалось удалить словарь! " + ex.Message
                    };
                }
            }
            return new ResponsePackage();
        }

        public ResponsePackage SaveDictionaryField(RequestObjectPackage<DictionaryFieldModel> request, IDbConnection connectionID)
        {
            DictionaryFieldModel obj = request.requestData;
            bool isEdit = obj.ID > 0;
            int dictionaryFieldID = 0;
            RequestObjectPackage<DictionarySearchTemplate> dictRequest = new RequestObjectPackage<DictionarySearchTemplate>()
            {
                requestData = new DictionarySearchTemplate()
                {
                    ID = obj.dictionaryID
                }
            };
            DictionaryModel dictionary = DictionariesRepository.GetBySearchTemplate(dictRequest, connectionID).GetDataOrExceptionIfError().First();

            using (IDbTransaction transactionID = connectionID.BeginTransaction())
            {
                try
                {
                    this.CreateColumnForDictionaryField(obj, dictionary, connectionID, transactionID);
                    dictionaryFieldID = DictionaryFieldsRepository.SaveDictionaryField(request, connectionID, transactionID).GetIdOrExceptionIfError();
                    transactionID.Commit();
                }
                catch (Exception ex)
                {
                    transactionID.Rollback();
                    return new ResponsePackage()
                    {
                        resultCode = -1,
                        resultMessage = "Не удалось сохранить поле словаря! " + ex.Message
                    };
                }
            }
            return new ResponsePackage() { resultID = dictionaryFieldID };
        }
        public ResponsePackage DeleteDictionaryField(RequestPackage request, IDbConnection connectionID)
        {
            int dictionaryFieldID = request.requestID;
            RequestObjectPackage<DictionaryFieldSearchTemplate> fieldRequest = new RequestObjectPackage<DictionaryFieldSearchTemplate>()
            {
                requestData = new DictionaryFieldSearchTemplate()
                {
                    ID = dictionaryFieldID
                }
            };
            DictionaryFieldModel obj = DictionaryFieldsRepository.GetBySearchTemplate(fieldRequest, connectionID).GetDataOrExceptionIfError().First();

            RequestObjectPackage<DictionarySearchTemplate> dictRequest = new RequestObjectPackage<DictionarySearchTemplate>()
            {
                requestData = new DictionarySearchTemplate()
                {
                    ID = obj.dictionaryID
                }
            };
            DictionaryModel dictionary = DictionariesRepository.GetBySearchTemplate(dictRequest, connectionID).GetDataOrExceptionIfError().First();

            using (IDbTransaction transactionID = connectionID.BeginTransaction())
            {
                try
                {
                    this.DropColumnForDictionaryField(obj, dictionary, connectionID, transactionID);
                    dictionaryFieldID = DictionaryFieldsRepository.DeleteDictionaryField(request, connectionID, transactionID).GetIdOrExceptionIfError();
                    transactionID.Commit();
                }
                catch (Exception ex)
                {
                    transactionID.Rollback();
                    return new ResponsePackage()
                    {
                        resultCode = -1,
                        resultMessage = "Не удалось сохранить поле словаря! " + ex.Message
                    };
                }
            }
            return new ResponsePackage() { resultID = dictionaryFieldID };
        }

        private void CreateTableForDictionary(DictionaryModel obj, IDbConnection connectionID, IDbTransaction transactionID)
        {
            string sql = null;
            bool isEdit = obj.ID > 0;
            if (!isEdit)
            {
                sql = string.Format(
                    "create table {0}(id integer not null primary key);",
                    obj.tableName
                );
                DBUtils.ExecuteSQL(sql, connectionID, false, transactionID).ThrowExceptionIfError();
                sql = string.Format(
                    "create generator generator_{0};",
                    obj.tableName
                );
                DBUtils.ExecuteSQL(sql, connectionID, false, transactionID).ThrowExceptionIfError();
                sql = string.Format(
                    "create trigger ins_{0} for {0} active " + Environment.NewLine +
                    "before insert position 1 " + Environment.NewLine +
                    "as " + Environment.NewLine +
                    "begin " + Environment.NewLine +
                    "   if (new.id is null) then " + Environment.NewLine +
                    "    new.id = gen_id (generator_{0}, 1); " + Environment.NewLine +
                    "end ",
                    obj.tableName
                );
                DBUtils.ExecuteSQL(sql, connectionID, false, transactionID).ThrowExceptionIfError();
            }
        }
        private void DropTableForDictionary(string tableName, IDbConnection connectionID, IDbTransaction transactionID)
        {
            string sql = string.Format(
                "drop trigger ins_{0};",
                tableName
            );
            DBUtils.ExecuteSQL(sql, connectionID, false, transactionID).ThrowExceptionIfError();
            sql = string.Format(
                "drop generator generator_{0};",
                tableName
            );
            DBUtils.ExecuteSQL(sql, connectionID, false, transactionID).ThrowExceptionIfError();
            sql = string.Format(
                "drop table {0};",
                tableName
            );
            DBUtils.ExecuteSQL(sql, connectionID, false, transactionID).ThrowExceptionIfError();
        }

        private void CreateColumnForDictionaryField(DictionaryFieldModel obj, DictionaryModel dictionary, IDbConnection connectionID, IDbTransaction transactionID)
        {
            string sql = null;
            bool isEdit = obj.ID > 0;
            if (!isEdit)
            {
                sql = string.Format(
                    "alter table {0} add {1} {2};",
                    dictionary.tableName,
                    obj.columnName,
                    GetDBTypeByID(obj.domainValueTypeID)
                );
                DBUtils.ExecuteSQL(sql, connectionID, false, transactionID).ThrowExceptionIfError();
            }
        }
        private void DropColumnForDictionaryField(DictionaryFieldModel obj, DictionaryModel dictionary, IDbConnection connectionID, IDbTransaction transactionID)
        {
            string sql = null;
            bool isEdit = obj.ID > 0;
            if (!isEdit)
            {
                sql = string.Format(
                    "alter table {0} drop {1};",
                    dictionary.tableName,
                    obj.columnName
                );
                DBUtils.ExecuteSQL(sql, connectionID, false, transactionID).ThrowExceptionIfError();
            }
        }

        private string GetDBTypeByID(int domainValueTypeID)
        {
            switch (domainValueTypeID)
            {
                case 1:
                    return "varchar(200)";
                case 2:
                    return "decimal";
                case 3:
                    return "integer";
                case 4:
                    return "date";
                default:
                    return "varchar(100)";
            }
        }
    }
}
