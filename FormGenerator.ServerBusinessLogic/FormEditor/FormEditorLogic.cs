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
    public class FormEditorLogic
    {
        // значение группы "Все"
        private readonly static string ALL_GROUP_NAME = "Все";
        private readonly static int ALL_GROUP_ID = 99;

        /// <summary>
        /// Функция, получающая древовидную структуру формы по ее ID
        /// </summary>
        /// <param name="package">Объект-оболочка RequestPackage, содержащая в поле requestID ID формы</param>
        /// <returns>Объект-оболочка RequestPackage ResponseObjectPackagе, содержащая в поле resultData древовидную структуру формы</returns>
        public ResponseObjectPackage<OpenFormModel> GetFormByID(RequestPackage package)
        {
            int formID = package.requestID;
            OpenFormModel result = new OpenFormModel();
            // форма
            result.form = new DBUtils(new FireBirdConnectionFactory()).RunSqlAction(new FormsRepository().GetFormByID, package).GetDataOrExceptionIfError();
            // все контролы формы
            List<ControlListEntity> controls = new ControlsLogic().GetControlsByFormID(package).GetDataOrExceptionIfError();
            // все свойства формы
            List<ControlPropertyViewModel> properties = new PropertyLogic().GetPropertiesByFormID(package).GetDataOrExceptionIfError();
            // задаем каждому контролу его свойства
            List<OpenControlModel> openControls = new List<OpenControlModel>();
            foreach (ControlListEntity ctrl in controls)
            {
                OpenControlModel o = new OpenControlModel();
                o.control = ctrl;
                foreach (ControlPropertyViewModel prop in properties)
                {
                    if (prop.controlID == ctrl.ID)
                    {
                        o.properties.Add(prop);
                        if (prop.property.ToLower() == "name")
                        {
                            o.name = prop.value;
                        }
                    }
                }
                openControls.Add(o);
            }

            // рекурсивная обработка свойств для определения отношений parent-child
            OpenControlModel root = null;
            foreach (OpenControlModel ctrl in openControls)
            {
                if (ctrl.control.controlIDParent == null)
                {
                    root = ctrl;
                }
                else
                {
                    foreach (OpenControlModel subCtrl in openControls)
                    {
                        if (ctrl.control.controlIDParent == subCtrl.control.ID)
                        {
                            subCtrl.items.Add(ctrl);
                        }
                    }
                }
            }

            result.root = root;
            return new ResponseObjectPackage<OpenFormModel>() { resultData = result };
        }

        #region Сохранение

        /// <summary>
        /// Рекурсивная функция сохранения формы, точнее ее элементов и свойств
        /// </summary>
        /// <param name="package"></param>
        /// <returns>Объект типа SaveControlModel, содержащий в себе исходный объект формы, но с информацией об ID вставленных компонентов</returns>
        public ResponseObjectPackage<SaveControlModel> SaveAllForm(RequestObjectPackage<SaveControlModel> package)
        {
            RequestObjectPackage<ControlModel> controlReq = new RequestObjectPackage<ControlModel>()
            {
                requestData = package.requestData.control
            };
            ResponsePackage saveControlResponse = new DBUtils(new FireBirdConnectionFactory()).RunSqlAction(new FormEditorDataCRUD().SaveControl, controlReq).GetSelfOrExceptionIfError();
            package.requestData.control.ID = saveControlResponse.resultID;
            if (package.requestData.items != null) package.requestData.items.ForEach(x => x.control.controlIDParent = saveControlResponse.resultID);
            if (package.requestData.properties != null) package.requestData.properties.ForEach(x => x.controlID = saveControlResponse.resultID);
            if (package.requestData.properties != null)
            {
                foreach (ControlPropertyViewModel prop in package.requestData.properties)
                {
                    RequestObjectPackage<ControlPropertyViewModel> propReq = new RequestObjectPackage<ControlPropertyViewModel>()
                    {
                        requestData = prop
                    };
                    ResponsePackage savePropResponse = new DBUtils(new FireBirdConnectionFactory()).RunSqlAction(new FormEditorDataCRUD().SaveProperty, propReq).GetSelfOrExceptionIfError();
                }
            }
            if (package.requestData.items != null)
            {
                foreach (SaveControlModel item in package.requestData.items)
                {
                    RequestObjectPackage<SaveControlModel> propItem = new RequestObjectPackage<SaveControlModel>()
                    {
                        requestData = item
                    };
                    ResponsePackage saveItemResponse = SaveAllForm(propItem).GetSelfOrExceptionIfError();
                }
            }

            return new ResponseObjectPackage<SaveControlModel>() { resultData = package.requestData };
        }

        /// <summary>
        /// Функция сохранения формы для редактора форм.
        /// </summary>
        /// <param name="package"></param>
        /// <returns></returns>
        public ResponsePackage SaveForm(RequestObjectPackage<FormModel> package)
        {
            return new DBUtils(new FireBirdConnectionFactory()).RunSqlAction(new FormEditorDataCRUD().SaveForm, package);
        }

        /// <summary>
        /// Функция сохранения контрола формы для редактора форм.
        /// </summary>
        /// <param name="package"></param>
        /// <returns></returns>
        public ResponsePackage SaveControl(RequestObjectPackage<ControlModel> package)
        {
            return new DBUtils(new FireBirdConnectionFactory()).RunSqlAction(new FormEditorDataCRUD().SaveControl, package);
        }

        /// <summary>
        /// Функция сохранения свойства контрола формы для редактора форм.
        /// </summary>
        /// <param name="package"></param>
        /// <returns></returns>
        public ResponsePackage SaveProperty(RequestObjectPackage<ControlPropertyViewModel> package)
        {
            return new DBUtils(new FireBirdConnectionFactory()).RunSqlAction(new FormEditorDataCRUD().SaveProperty, package);
        }

        #endregion

        #region Выборки

        /// <summary>
        /// Получить список групп типов контролов
        /// </summary>
        /// <param name="package"></param>
        /// <returns></returns>
        public ResponseObjectPackage<List<ControlTypeGroup>> GetControlTypeGroupList(RequestPackage package)
        {
            ResponseObjectPackage<List<ControlTypeGroup>> res = new DBUtils(new FireBirdConnectionFactory()).RunSqlAction(new FormEditorDataCRUD().GetControlTypeGroupList, package);
            res.resultData.Add(new ControlTypeGroup() { ID = ALL_GROUP_ID, name = ALL_GROUP_NAME });
            res.resultData.Sort((x, y) => x.name.CompareTo(y.name)); 
            return res;
        }

        /// <summary>
        /// Функция получения списка типов контролов
        /// </summary>
        /// <param name="package"></param>
        /// <returns></returns>
        public ResponseObjectPackage<List<ControlTypeListEntity>> GetControlTypeList(RequestPackage package)
        {
            // получим список типов контролов
            List<ControlTypeListEntity> res = new DBUtils(new FireBirdConnectionFactory()).RunSqlAction(new FormEditorDataCRUD().GetControlTypeList, package).GetDataOrExceptionIfError();
            // получим список зависимостей контролов
            List<ControlTypeDependenciesListEntity> depRes = new DBUtils(new FireBirdConnectionFactory()).RunSqlAction(new FormEditorDataCRUD().GetControlTypeDependenciesList, package).GetDataOrExceptionIfError();
            // получим список свойств
            List<PropertyTypeListEntity> propRes = new DBUtils(new FireBirdConnectionFactory()).RunSqlAction(new FormEditorDataCRUD().GetPropertyTypeList, package).GetDataOrExceptionIfError();
            foreach (ControlTypeListEntity type in res)
            {
                type.SetComponentIcon();
                foreach (ControlTypeDependenciesListEntity dep in depRes)
                {
                    if (type.ID == dep.controlTypeIDParent)
                    {
                        type.childComponents.Add(dep.child);
                    }
                }
                foreach (PropertyTypeListEntity prop in propRes)
                {
                    if (type.ID == prop.controlTypeID)
                    {
                        type.properties.Add(prop.property, prop.GetRightDefaultValue());
                    }
                }
            }
            res.Sort((x, y)=> x.component.ToLower().CompareTo(y.component.ToLower()));
            return new ResponseObjectPackage<List<ControlTypeListEntity>>() { resultData = res };
        }

        #endregion
    }
}
