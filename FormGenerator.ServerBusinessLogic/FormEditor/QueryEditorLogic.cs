using FormGenerator.Models;
using FormGenerator.ServerBusinessLogic;
using FormGenerator.ServerDataAccess;
using FormGenerator.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.Server
{
    public class QueryEditorLogic
    {

        #region Выборки

        /// <summary>
        /// Получить список типов запросов
        /// </summary>
        /// <param name="package"></param>
        /// <returns></returns>
        public ResponseObjectPackage<List<QueryTypeModel>> GetQueryTypeList(RequestPackage package)
        {
            return new DBUtils(new FireBirdConnectionFactory()).RunSqlAction(new QueryEditorDataCRUD().GetQueryTypeList, package);
        }

        /// <summary>
        /// Получить тип запроса с параметрами
        /// </summary>
        /// <param name="package"></param>
        /// <returns></returns>
        public ResponseObjectPackage<FullQueryType> GetFullQueryType(RequestPackage package)
        {
            QueryTypeModel queryType = this.GetQueryType(package).GetDataOrExceptionIfError();
            List<QueryInParameterModel> inParams = this.GetQueryInParamsList(package).GetDataOrExceptionIfError();
            List<QueryOutParameterModel> outParams = this.GetQueryOutParamsList(package).GetDataOrExceptionIfError();
            FullQueryType result = new FullQueryType()
            {
                queryType = queryType,
                inParams = inParams,
                outParams = outParams
            };
            return new ResponseObjectPackage<FullQueryType>() { resultData = result };
        }

        /// <summary>
        /// Получить тип запроса
        /// </summary>
        /// <param name="package"></param>
        /// <returns></returns>
        public ResponseObjectPackage<QueryTypeModel> GetQueryType(RequestPackage package)
        {
            return new DBUtils(new FireBirdConnectionFactory()).RunSqlAction(new QueryEditorDataCRUD().GetQueryType, package);
        }

        /// <summary>
        /// Получить список входных параметров типов запросов
        /// </summary>
        /// <param name="package"></param>
        /// <returns></returns>
        public ResponseObjectPackage<List<QueryInParameterModel>> GetQueryInParamsList(RequestPackage package)
        {
            return new DBUtils(new FireBirdConnectionFactory()).RunSqlAction(new QueryEditorDataCRUD().GetQueryInParamsList, package);
        }

        /// <summary>
        /// Получить список выходных параметров типов запросов
        /// </summary>
        /// <param name="package"></param>
        /// <returns></returns>
        public ResponseObjectPackage<List<QueryOutParameterModel>> GetQueryOutParamsList(RequestPackage package)
        {
            return new DBUtils(new FireBirdConnectionFactory()).RunSqlAction(new QueryEditorDataCRUD().GetQueryOutParamsList, package);
        }

        #endregion

        #region Сохранение

        /// <summary>
        /// Функция сохранения типа запроса
        /// </summary>
        /// <param name="package"></param>
        /// <returns></returns>
        public ResponsePackage SaveQueryType(RequestObjectPackage<QueryTypeModel> package)
        {
            return new DBUtils(new FireBirdConnectionFactory()).RunSqlAction(new QueryEditorDataCRUD().SaveQueryType, package);
        }

        /// <summary>
        /// Функция сохранения входного параметр запроса
        /// </summary>
        /// <param name="package"></param>
        /// <returns></returns>
        public ResponsePackage SaveQueryInParameter(RequestObjectPackage<QueryInParameterModel> package)
        {
            return new DBUtils(new FireBirdConnectionFactory()).RunSqlAction(new QueryEditorDataCRUD().SaveQueryInParameter, package);
        }

        /// <summary>
        /// Функция сохранения выходного параметр запроса
        /// </summary>
        /// <param name="package"></param>
        /// <returns></returns>
        public ResponsePackage SaveQueryOutParameter(RequestObjectPackage<QueryOutParameterModel> package)
        {
            return new DBUtils(new FireBirdConnectionFactory()).RunSqlAction(new QueryEditorDataCRUD().SaveQueryOutParameter, package);
        }

        #endregion

    }
}
