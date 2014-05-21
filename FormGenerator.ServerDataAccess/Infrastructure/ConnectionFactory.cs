using FirebirdSql.Data.FirebirdClient;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.ServerDataAccess
{
    /// <summary> Интерфейс для фабрики подключений
    /// </summary>
    public interface IConnectionFactory
    {
        /// <summary> Получить объект подключения к базе данных
        /// </summary>
        /// <returns></returns>
        IDbConnection GetConnection();
    }

    /// <summary> Фабрика подключений к БД FireBird
    /// </summary>
    public class FireBirdConnectionFactory:IConnectionFactory
    {
        public IDbConnection GetConnection()
        {
            string connectionName = "NotebookTestBase";
            ConnectionStringSettings connection = ConfigurationManager.ConnectionStrings[connectionName];
            if (connection == null || connection.ConnectionString == null)
            {
                throw new ConfigurationErrorsException("Не найдена строка подключения NotebookTestBase! Проверьте файл web.config!");
            }
            return new FbConnection(connection.ConnectionString);
        }
    }
}
