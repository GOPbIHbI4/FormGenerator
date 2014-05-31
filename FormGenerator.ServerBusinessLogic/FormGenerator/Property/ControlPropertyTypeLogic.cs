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
    public class ControlPropertyTypeLogic
    {
        /// <summary>
        /// Функция получения типа свойств компонентов формы по его ID
        /// </summary>
        /// <param name="request">Объект-оболочка RequestPackage, содержащая в поле requestID id типа свойств</param>
        /// <returns>Объект-оболочка ResponseObjectPackagе, содержащая в поле resultData тип свойства</returns>
        public ResponseObjectPackage<ControlPropertyTypeModel> GetPropertyTypeByID(RequestPackage request)
        {
            ResponseObjectPackage<ControlPropertyTypeModel> response = new DBUtils().RunSqlAction(new ControlPropertyTypeRepository().GetPropertyTypeByID, request);
            response.ThrowExceptionIfError();
            return response;
        }

        /// <summary>
        /// Функция получения списка типов свойств по его ID типа компонента
        /// </summary>
        /// <param name="request">Объект-оболочка RequestPackage, содержащая в поле requestID id типа компонента</param>
        /// <returns>Объект-оболочка ResponseObjectPackagе, содержащая в поле resultData список типов свойств</returns>
        public ResponseObjectPackage<List<ControlPropertyTypeModel>> GetPropertyTypeList(RequestPackage request)
        {
            ResponseObjectPackage<List<ControlPropertyTypeModel>> response = new DBUtils().RunSqlAction(new ControlPropertyTypeRepository().GetPropertyTypeList, request);
            response.ThrowExceptionIfError();
            return response;
        }

        /// <summary>
        /// Функция сохранения типа свойств для типа контрола формы.
        /// </summary>
        /// <param name="package">Объект-оболочка RequestPackage</param>
        /// <returns>Объект-оболочка ResponsePackage</returns>
        public ResponsePackage SavePropertyType(RequestObjectPackage<ControlPropertyTypeModel> package)
        {
            ResponsePackage response = new DBUtils(new FireBirdConnectionFactory()).RunSqlAction(new ControlPropertyTypeRepository().SavePropertyType, package);
            response.ThrowExceptionIfError();
            return response;
        }

        /// <summary>
        /// Функция удаления типа свойства для типа контрола по его ID
        /// </summary>
        /// <param name="package">Объект-оболочка RequestPackage, содержащая в поле requestID ID типа свойства</param>
        /// <returns>Объект-оболочка ResponsePackagе</returns>
        public ResponsePackage DeletePropertyTypeByID(RequestPackage package)
        {
            ResponsePackage response = new DBUtils(new FireBirdConnectionFactory()).RunSqlAction(new ControlPropertyTypeRepository().DeletePropertyTypeByID, package);
            response.ThrowExceptionIfError();
            return response;
        }

    }
}
