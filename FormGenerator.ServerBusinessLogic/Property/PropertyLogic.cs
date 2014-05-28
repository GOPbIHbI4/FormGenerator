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
    public class PropertyLogic
    {
        /// <summary>
        /// Функция получения списка свойств компонентов формы по ее ID
        /// </summary>
        /// <param name="request">Объект-оболочка RequestPackage, содержащая в поле requestID ID формы</param>
        /// <returns>Объект-оболочка ResponseObjectPackagе, содержащая в поле resultData список свойств компонентов формы</returns>
        public ResponseObjectPackage<List<ControlPropertyViewModel>> GetPropertiesByFormID(RequestPackage request)
        {
            ResponseObjectPackage<List<ControlPropertyViewModel>> response = new DBUtils().RunSqlAction(new PropertiesRepository().GetPropertiesByFormID, request);
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
            ResponseObjectPackage<List<ControlPropertyViewModel>> response = new DBUtils().RunSqlAction(new PropertiesRepository().GetPropertiesByControlID, request);
            // Свойству id ставим значение ID компонента
            response.resultData.Find(x => x.property.ToLower() == "id").value = request.requestID.ToString();
            foreach (ControlPropertyViewModel c in response.resultData)
            {
                c._value = c.GetRightValue();
            }
            return response;
        }
    }
}
