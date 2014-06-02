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
    public class EventEditorLogic
    {

        #region Выборки

        /// <summary>
        /// Получить список типов событий
        /// </summary>
        /// <param name="package"></param>
        /// <returns></returns>
        public ResponseObjectPackage<List<EventType>> GetEventTypeList(RequestPackage package)
        {
            ResponseObjectPackage<List<EventType>> response = new DBUtils().RunSqlAction(new EventEditorDataCRUD().GetEventTypeList, package);
            response.ThrowExceptionIfError();
            return response;
        }

        /// <summary>
        /// Получить список типов обработчика
        /// </summary>
        /// <param name="package"></param>
        /// <returns></returns>
        public ResponseObjectPackage<List<ActionTypeModel>> GetHandlerTypeList(RequestObjectPackage<ActionTypeSearchTemplate> package)
        {
            ResponseObjectPackage<List<ActionTypeModel>> response = new DBUtils().RunSqlAction(ActionTypesRepository.GetBySearchTemplate, package);
            response.ThrowExceptionIfError();
            return response;
        }

        /// <summary>
        /// Получить список параметров
        /// </summary>
        /// <param name="package"></param>
        /// <returns></returns>
        public ResponseObjectPackage<List<ActionParameterTypeModel>> GetParamTypeList(RequestObjectPackage<ActionParameterTypeSearchTemplate> package)
        {
            ResponseObjectPackage<List<ActionParameterTypeModel>> response = new DBUtils().RunSqlAction(ActionParameterTypesRepository.GetBySearchTemplate, package);
            response.ThrowExceptionIfError();
            return response;
        }

        #endregion

    }
}
