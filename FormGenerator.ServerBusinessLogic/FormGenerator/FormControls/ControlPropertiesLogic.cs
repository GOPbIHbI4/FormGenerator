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
    public class ControlPropertiesLogic
    {
        public ResponseObjectPackage<List<ControlProperty>> GetControlPropertiesByFormID(int formID)
        {
            RequestPackage request = new RequestPackage() { requestID = formID };
            List<ControlPropertyViewModel> properties = new DBUtils().RunSqlAction(new ControlPropertiesRepository().GetPropertiesByFormID, request).GetDataOrExceptionIfError();
            List<ControlProperty> propertiesList = properties.Select(e =>
                new ControlProperty()
                {
                    controlID = e.controlID,
                    controlPropertyTypeID = e.controlPropertyTypeID,
                    domainValueTypeID = e.DOMAIN_VALUE_TYPE_ID_LOGIC,
                    ID = e.ID,
                    name = e.property,
                    value = ValueTypesConverter.Initialize(e.value, e.logicValueTypeID, true)
                }
            ).ToList();
            ResponseObjectPackage<List<ControlProperty>> response = new ResponseObjectPackage<List<ControlProperty>>() { resultData = propertiesList };
            return response;
        }

        public ResponseObjectPackage<List<Control>> GetControlsByFormID(int formID)
        {
            RequestPackage request = new RequestPackage() { requestID = formID };
            List<ControlListEntity> controls = new DBUtils().RunSqlAction(new ControlsRepository().GetControlsByFormID, request).GetDataOrExceptionIfError();
            List<Control> controlsList = controls.Select(e =>
                new Control()
                {
                    children = new List<Control>(),
                    controlDictionaryMappings = new List<ControlDictionaryMappingModel>(),
                    controlIDParent = e.controlIDParent,
                    controlQueryMappings = new List<ControlQueryMappingModel>(),
                    controlTypeID = e.controlTypeID,
                    formID = e.formID,
                    ID = e.ID,
                    orderNumber = e.orderNumber,
                    properties = new List<ControlProperty>()
                }
            ).ToList();
            ResponseObjectPackage<List<Control>> response = new ResponseObjectPackage<List<Control>>() { resultData = controlsList };
            return response;
        }

        public ResponseObjectPackage<List<ControlDictionaryMappingModel>> GetControlDictionaryMappingByFormID(int formID)
        {
            RequestPackage request = new RequestPackage() { requestID = formID };
            List<ControlDictionaryMappingModel> mappings = new DBUtils().RunSqlAction(ControlDictionaryMappingRepository.GetByFormID, request).GetDataOrExceptionIfError();
            ResponseObjectPackage<List<ControlDictionaryMappingModel>> response = new ResponseObjectPackage<List<ControlDictionaryMappingModel>>() { resultData = mappings };
            return response;
        }
        public ResponseObjectPackage<List<ControlQueryMappingModel>> GetControlQueryMappingByFormID(int formID)
        {
            RequestPackage request = new RequestPackage() { requestID = formID };
            List<ControlQueryMappingModel> mappings = new DBUtils().RunSqlAction(ControlQueryMappingRepository.GetByFormID, request).GetDataOrExceptionIfError();
            ResponseObjectPackage<List<ControlQueryMappingModel>> response = new ResponseObjectPackage<List<ControlQueryMappingModel>>() { resultData = mappings };
            return response;
        }
        public ResponseObjectPackage<FormModel> GetFormByID(int formID)
        {
            RequestPackage request = new RequestPackage() { requestID = formID };
            FormModel form = new DBUtils().RunSqlAction(new FormsRepository().GetFormByID, request).GetDataOrExceptionIfError();
            ResponseObjectPackage<FormModel> response = new ResponseObjectPackage<FormModel>() { resultData = form };
            return response;
        }


        public ResponseObjectPackage<Control> BuildWindow(int formID)
        {
            List<Control> controls = this.GetControlsByFormID(formID).GetDataOrExceptionIfError();
            List<ControlProperty> properties = this.GetControlPropertiesByFormID(formID).GetDataOrExceptionIfError();
            List<ControlDictionaryMappingModel> dictionaryMappings = this.GetControlDictionaryMappingByFormID(formID).GetDataOrExceptionIfError();
            List<ControlQueryMappingModel> queryMappings = this.GetControlQueryMappingByFormID(formID).GetDataOrExceptionIfError();

            Func<Control, Control> fillControl = null;
            fillControl = (control) =>
            {
                control.properties = properties.Where(e => e.controlID == control.ID).ToList();
                control.controlQueryMappings = queryMappings.Where(e => e.controlID == control.ID).ToList();
                control.controlDictionaryMappings = dictionaryMappings.Where(e => e.controlID == control.ID).ToList();

                control.children = controls.Where(e => e.controlIDParent == control.ID).Select(i => fillControl(i)).ToList();
                return control;
            };
            Control root = controls.Where(e => e.controlIDParent == null).First();
            root = fillControl(root);


            return new ResponseObjectPackage<Control>() { resultData = root };
        }
    }
}
