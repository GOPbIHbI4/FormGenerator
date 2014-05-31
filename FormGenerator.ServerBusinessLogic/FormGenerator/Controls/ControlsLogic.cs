using FormGenerator.Models;
using FormGenerator.ServerDataAccess;
using FormGenerator.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.ServerBusinessLogic
{
    public class ControlsLogic
    {
        /// <summary>
        /// Функция получения списка контролов формы по ее ID
        /// </summary>
        /// <param name="request">Объект-оболочка RequestPackage, содержащая в поле requestID id формы</param>
        /// <returns>Объект-оболочка ResponseObjectPackagе, содержащая в поле resultData список контролов формы</returns>
        public ResponseObjectPackage<List<ControlListEntity>> GetControlsByFormID(RequestPackage request)
        {
            ResponseObjectPackage<List<ControlListEntity>> response = new DBUtils().RunSqlAction(new ControlsRepository().GetControlsByFormID, request);
            response.ThrowExceptionIfError();
            return response;
        }

        /// <summary>
        /// Функция получения контрола формы по его ID
        /// </summary>
        /// <param name="request">Объект-оболочка RequestPackage, содержащая в поле requestID ID контрола</param>
        /// <returns>Объект-оболочка ResponseObjectPackagе, содержащая в поле resultData контрол формы</returns>
        public ResponseObjectPackage<ControlListEntity> GetControlByID(RequestPackage request)
        {
            ResponseObjectPackage<ControlListEntity> response = new DBUtils().RunSqlAction(new ControlsRepository().GetControlByID, request);
            response.ThrowExceptionIfError();
            return response;
        }

        /// <summary>
        /// Функция сохранения контрола формы для редактора форм.
        /// </summary>
        /// <param name="package">Объект-оболочка RequestPackage, содержащая в поле requestData контрол</param>
        /// <returns>Объект-оболочка ResponsePackagе</returns>
        public ResponsePackage SaveControl(RequestObjectPackage<ControlModel> package)
        {
            ResponsePackage response = new DBUtils(new FireBirdConnectionFactory()).RunSqlAction(new ControlsRepository().SaveControl, package);
            response.ThrowExceptionIfError();
            return response;
        }

        /// <summary>
        /// Функция удаления контрола из формы
        /// </summary>
        /// <param name="request">Объект-оболочка RequestPackage, содержащая в поле requestID ID контрола</param>
        /// <returns>Объект-оболочка ResponsePackagе</returns>
        public ResponsePackage DeleteControlByID(RequestPackage request)
        {
            ResponsePackage response = new DBUtils().RunSqlAction(new ControlsRepository().DeleteControlByID, request);
            response.ThrowExceptionIfError();
            return response;
        }

        /// <summary>
        /// Проверить возможность удаления компонента
        /// </summary>
        /// <param name="request">бъект-оболочка RequestPackage, содержащая в поле requestID ID компонента</param>
        /// <returns>Объект-оболочка ResponsePackagе</returns>
        public ResponsePackage CheckDeleteControl(RequestPackage request)
        {
            ResponsePackage response = new DBUtils().RunSqlAction(new ControlsRepository().CheckDeleteControl, request);
            response.ThrowExceptionIfError();
            return response;
        }
    }
}
