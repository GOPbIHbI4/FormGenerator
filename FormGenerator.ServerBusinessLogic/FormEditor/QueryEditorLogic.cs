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
            ResponseObjectPackage<List<QueryTypeModel>> response = new DBUtils(new FireBirdConnectionFactory()).RunSqlAction(new QueryEditorDataCRUD().GetQueryTypeList, package);
            response.ThrowExceptionIfError();
            return response;
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
            ResponseObjectPackage<QueryTypeModel> response = new DBUtils(new FireBirdConnectionFactory()).RunSqlAction(new QueryEditorDataCRUD().GetQueryType, package);
            response.ThrowExceptionIfError();
            return response;
        }

        /// <summary>
        /// Получить список входных параметров типов запросов
        /// </summary>
        /// <param name="package"></param>
        /// <returns></returns>
        public ResponseObjectPackage<List<QueryInParameterModel>> GetQueryInParamsList(RequestPackage package)
        {
            ResponseObjectPackage<List<QueryInParameterModel>> response = new DBUtils(new FireBirdConnectionFactory()).RunSqlAction(new QueryEditorDataCRUD().GetQueryInParamsList, package);
            response.ThrowExceptionIfError();
            return response;
        }

        /// <summary>
        /// Получить список выходных параметров типов запросов
        /// </summary>
        /// <param name="package"></param>
        /// <returns></returns>
        public ResponseObjectPackage<List<QueryOutParameterModel>> GetQueryOutParamsList(RequestPackage package)
        {
            ResponseObjectPackage<List<QueryOutParameterModel>> response = new DBUtils(new FireBirdConnectionFactory()).RunSqlAction(new QueryEditorDataCRUD().GetQueryOutParamsList, package);
            response.ThrowExceptionIfError();
            return response;
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
            string sqlText = package.requestData.sqlText;
            sqlText = sqlText.Replace(System.Environment.NewLine, "");
            sqlText = sqlText.Replace("\n", "");
            package.requestData.sqlText = sqlText;
            ResponsePackage response = new DBUtils(new FireBirdConnectionFactory()).RunSqlAction(new QueryEditorDataCRUD().SaveQueryType, package);
            response.ThrowExceptionIfError();
            return response;
        }

        /// <summary>
        /// Функция сохранения входного параметр запроса
        /// </summary>
        /// <param name="package"></param>
        /// <returns></returns>
        public ResponsePackage SaveQueryInParameter(RequestObjectPackage<QueryInParameterModel> package)
        {
            ResponsePackage response = new DBUtils(new FireBirdConnectionFactory()).RunSqlAction(new QueryEditorDataCRUD().SaveQueryInParameter, package);
            response.ThrowExceptionIfError();
            return response;
        }

        /// <summary>
        /// Функция сохранения выходного параметр запроса
        /// </summary>
        /// <param name="package"></param>
        /// <returns></returns>
        public ResponsePackage SaveQueryOutParameter(RequestObjectPackage<QueryOutParameterModel> package)
        {
            ResponsePackage response = new DBUtils(new FireBirdConnectionFactory()).RunSqlAction(new QueryEditorDataCRUD().SaveQueryOutParameter, package);
            response.ThrowExceptionIfError();
            return response;
        }

        #endregion

    }
}
