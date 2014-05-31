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
    public class ControlTypesLogic
    {
        /// <summary>
        /// Функция получения типа контролов формы по его ID
        /// </summary>
        /// <param name="request">Объект-оболочка RequestPackage, содержащая в поле requestID ID типа контрола</param>
        /// <returns>Объект-оболочка ResponseObjectPackagе, содержащая в поле resultData тип контрола формы</returns>
        public ResponseObjectPackage<ControlTypeListEntity> GetControlTypeByID(RequestPackage request)
        {
            ResponseObjectPackage<ControlTypeListEntity> response = new DBUtils().RunSqlAction(new ControlTypeRepository().GetControlTypeByID, request);
            response.ThrowExceptionIfError();
            return response;
        }

        /// <summary>
        /// Функция сохранения типа контрола формы.
        /// </summary>
        /// <param name="package">Объект-оболочка RequestPackage, содержащая в поле requestData тип контрола</param>
        /// <returns>Объект-оболочка ResponsePackagе</returns>
        public ResponsePackage SaveControlType(RequestObjectPackage<ControlTypeModel> package)
        {
            ResponsePackage response = new DBUtils(new FireBirdConnectionFactory()).RunSqlAction(new ControlTypeRepository().SaveControlType, package);
            response.ThrowExceptionIfError();
            return response;
        }

        /// <summary>
        /// Функция удаления типа контрола
        /// </summary>
        /// <param name="request">Объект-оболочка RequestPackage, содержащая в поле requestID ID типа контрола</param>
        /// <returns>Объект-оболочка ResponsePackagе</returns>
        public ResponsePackage DeleteControlTypeByID(RequestPackage request)
        {
            ResponsePackage response = new DBUtils().RunSqlAction(new ControlTypeRepository().DeleteControlTypeByID, request);
            response.ThrowExceptionIfError();
            return response;
        }

    }
}
