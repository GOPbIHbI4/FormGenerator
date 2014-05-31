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
    public class ControlPropertyLogic
    {
        /// <summary>
        /// Функция получения списка свойств компонентов формы по ее ID
        /// </summary>
        /// <param name="request">Объект-оболочка RequestPackage, содержащая в поле requestID ID формы</param>
        /// <returns>Объект-оболочка ResponseObjectPackagе, содержащая в поле resultData список свойств компонентов формы</returns>
        public ResponseObjectPackage<List<ControlPropertyViewModel>> GetPropertiesByFormID(RequestPackage request)
        {
            ResponseObjectPackage<List<ControlPropertyViewModel>> response = new DBUtils().RunSqlAction(new ControlPropertiesRepository().GetPropertiesByFormID, request);
            response.ThrowExceptionIfError();
            foreach (ControlPropertyViewModel c in response.resultData)
            {
                c._value = c.GetRightValue();
            }
            foreach (ControlPropertyViewModel c in response.resultData.FindAll(x => x.property.ToLower() == "id"))
            {
                c._value = c.controlID;
            }
            return response;
        }

        /// <summary>
        /// Функция получения списка свойств компонента по его ID
        /// </summary>
        /// <param name="request">Объект-оболочка RequestPackage, содержащая в поле requestID id компонента</param>
        /// <returns>Объект-оболочка ResponseObjectPackagе, содержащая в поле resultData список свойств компонента</returns>
        public ResponseObjectPackage<List<ControlPropertyViewModel>> GetPropertiesByControlID(RequestPackage request)
        {
            ResponseObjectPackage<List<ControlPropertyViewModel>> response = new DBUtils().RunSqlAction(new ControlPropertiesRepository().GetPropertiesByControlID, request);
            response.ThrowExceptionIfError();
            // Свойству id ставим значение ID компонента
            response.resultData.Find(x => x.property.ToLower() == "id").value = request.requestID.ToString();
            foreach (ControlPropertyViewModel c in response.resultData)
            {
                c._value = c.GetRightValue();
            }
            return response;
        }

        /// <summary>
        /// Функция сохранения свойства контрола формы для редактора форм.
        /// </summary>
        /// <param name="package"></param>
        /// <returns></returns>
        public ResponsePackage SaveProperty(RequestObjectPackage<ControlPropertyModel> package)
        {
            return new DBUtils(new FireBirdConnectionFactory()).RunSqlAction(new ControlPropertiesRepository().SaveProperty, package);
        }

        /// <summary>
        /// Функция удаления свойства контрола по его ID
        /// </summary>
        /// <param name="package">Объект-оболочка RequestPackage, содержащая в поле requestID ID компонента</param>
        /// <returns>Объект-оболочка ResponsePackagе</returns>
        public ResponsePackage DeletePropertiesByControlID(RequestPackage package)
        {
            ResponsePackage response = new DBUtils(new FireBirdConnectionFactory()).RunSqlAction(new ControlPropertiesRepository().DeletePropertiesByControlID, package);
            response.ThrowExceptionIfError();
            return response;
        }

        /// <summary>
        /// Функция удаления свойства контрола по ее ID
        /// </summary>
        /// <param name="package">Объект-оболочка RequestPackage, содержащая в поле requestID ID свойства</param>
        /// <returns>Объект-оболочка ResponsePackagе</returns>
        public ResponsePackage DeletePropertyByID(RequestPackage package)
        {
            ResponsePackage response = new DBUtils(new FireBirdConnectionFactory()).RunSqlAction(new ControlPropertiesRepository().DeletePropertyByID, package);
            response.ThrowExceptionIfError();
            return response;
        }
    }
}
