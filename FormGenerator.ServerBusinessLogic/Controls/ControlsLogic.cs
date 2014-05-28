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
            return response;
        }
    }
}
