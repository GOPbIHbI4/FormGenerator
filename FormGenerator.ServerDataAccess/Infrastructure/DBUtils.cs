using FirebirdSql.Data.FirebirdClient;
using FormGenerator.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.ServerDataAccess
{
    public delegate ResponsePackage SqlAction(RequestPackage request, IDbConnection connectionID);

    public class DBUtils
    {
        private IConnectionFactory _connectionFactory;
        public DBUtils()
        {
            this._connectionFactory = new FireBirdConnectionFactory();
        }

        public ResponsePackage RunSqlAction(SqlAction action, RequestPackage request)
        {
            ResponsePackage response = null;
            using (IDbConnection connectionID = this._connectionFactory.GetConnection())
            {
                connectionID.Open();
                response = action(request, connectionID);
                connectionID.Close();
            }
            return response;
        }

        public static ResponseTablePackage OpenSQL(string sql, IDbConnection connectionID, IDbTransaction transactionID = null)
        {

            ResponseTablePackage result = new ResponseTablePackage();
            using (IDbCommand myCommand = new FbCommand(sql, connectionID as FbConnection, transactionID as FbTransaction))
            {
                myCommand.CommandTimeout = 180;
                //using гарантирует вызов Dispose
                using (IDataReader reader = myCommand.ExecuteReader(CommandBehavior.SingleResult))
                {
                    Dictionary<string, string> readerColumnDataTypes = new Dictionary<string, string>();
                    for (int i = 0; i < reader.FieldCount; i++)
                    {
                        if (!readerColumnDataTypes.ContainsKey(reader.GetName(i)))
                        {
                            readerColumnDataTypes.Add(reader.GetName(i), reader.GetDataTypeName(i));
                        }
                        else
                        {
                            //добавяем суффикс для дублирущийся имен колонок
                            int postfix = 1;
                            //Ищем свободный суффикс для колонки
                            while (readerColumnDataTypes.ContainsKey(reader.GetName(i) + postfix))
                            {
                                postfix++;
                            }
                            readerColumnDataTypes.Add(reader.GetName(i) + postfix, reader.GetDataTypeName(i));
                        }
                    }

                    //---------------------------------
                    //Выполнить запрос
                    //---------------------------------
                    DataTable existTable = new DataTable();
                    existTable.Load(reader, LoadOption.OverwriteChanges);
                    result.resultData = existTable;
                    reader.Close();
                }
            }

            return result;
        }

        public static ResponseTablePackage ExecuteSQL(string sql, IDbConnection connectionID, IDbTransaction transactionID = null)
        {
            ResponseTablePackage result = new ResponseTablePackage();
            using (IDbCommand myCommand = new FbCommand(sql, connectionID as FbConnection, transactionID as FbTransaction))
            {
                myCommand.CommandTimeout = 180;
                result.resultID = (int)myCommand.ExecuteScalar();
            }
            return result;
        }
    }
}
