﻿using FirebirdSql.Data.FirebirdClient;
using FormGenerator.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.ServerDataAccess
{
    /// <summary> Делегат, описывающий sql-действие с подключением connectionID и параметрами запроса, передаваемыми в request
    /// </summary>
    /// <param name="request">пакет параметров запроса</param>
    /// <param name="connectionID"></param>
    /// <returns></returns>
    public delegate ResponsePackage SqlAction(RequestPackage request, IDbConnection connectionID);

    /// <summary> Класс, описывающий утилиты для работы с базами данных
    /// </summary>
    public class DBUtils
    {
        private IConnectionFactory _connectionFactory;
        public DBUtils(IConnectionFactory connectionFactory_)
        {
            this._connectionFactory = connectionFactory_;
        }

        /// <summary> Выполнить запрос sql, представленный делегатом action с параметрами, переданными в пакете request
        /// </summary>
        /// <param name="action">ссыль на метод, который принимает как параметры пакет запроса и подключение к БД</param>
        /// <param name="request"></param>
        /// <returns></returns>
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

        /// <summary> Выполнить sql-запрос и вернуть результаты в виде пакета с таблицей данных DataTable
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="connectionID"></param>
        /// <param name="transactionID"></param>
        /// <returns></returns>
        public static ResponseTablePackage OpenSQL(string sql, IDbConnection connectionID, IDbTransaction transactionID = null)
        {
            ResponseTablePackage result = new ResponseTablePackage();
            try
            {
                using (IDbCommand command = connectionID.CreateCommand())
                {
                    command.CommandTimeout = 180;
                    command.CommandText = sql;
                    command.CommandType = CommandType.Text;
                    command.Transaction = transactionID;

                    using (IDataReader reader = command.ExecuteReader(CommandBehavior.SingleResult))
                    {
                        result.resultData = new DataTable();
                        result.resultData.Load(reader, LoadOption.OverwriteChanges);
                        reader.Close();
                    }
                }
            }
            catch (Exception ex)
            {
                result.resultCode = -1;
                result.resultMessage = "Ошибка запроса:" + ex.Message;
            }
            return result;
        }

        /// <summary> Выполнить sql-запрос на изменение базы данных и вернуть результаты в виде пакета с ключом resultID, 
        /// означающим ID вставленной записи, если в запросе указывалось returning ID; иначе - количество измененных строк
        /// </summary>
        /// <param name="sql"></param>
        /// <param name="connectionID"></param>
        /// <param name="transactionID"></param>
        /// <returns></returns>
        public static ResponseTablePackage ExecuteSQL(string sql, IDbConnection connectionID, IDbTransaction transactionID = null)
        {
            ResponseTablePackage result = new ResponseTablePackage();
            try
            {
                using (IDbCommand command = connectionID.CreateCommand())
                {
                    command.CommandTimeout = 180;
                    command.CommandText = sql;
                    command.CommandType = CommandType.Text;
                    command.Transaction = transactionID;

                    result.resultID = (int)command.ExecuteScalar();
                }
            }
            catch (Exception ex)
            {
                result.resultCode = -1;
                result.resultMessage = "Ошибка запроса:" + ex.Message;
            }
            return result;
        }
    }
}
