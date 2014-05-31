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
            List<ControlPropertyViewModel> properties = new ControlPropertyLogic().GetPropertiesByFormID(package).GetDataOrExceptionIfError();
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
        /// Сохранить запросы формы
        /// </summary>
        /// <param name="package"></param>
        /// <returns></returns>
        public ResponsePackage SaveQueries(RequestObjectPackage<List<QueryViewModel>> package)
        {
            // сохранить запросы
            if (package.requestData != null)
            {
                foreach (QueryModel q in package.requestData)
                {
                    RequestObjectPackage<QueryModel> queryReq = new RequestObjectPackage<QueryModel>()
                    {
                        requestData = q
                    };
                    ResponsePackage saveQueryResponse = new DBUtils(new FireBirdConnectionFactory()).RunSqlAction(QueriesRepository.SaveQuery, queryReq).GetSelfOrExceptionIfError();
                    q.ID = saveQueryResponse.resultID;
                }
            }

            return new ResponsePackage();
        }

        /// <summary>
        /// Сохранить данные 
        /// </summary>
        /// <param name="package">package.requestID = controlID</param>
        /// <returns></returns>
        public ResponsePackage SaveQueryData(RequestObjectPackage<QueryData> package)
        {
            // сохранить запросы
            if (package.requestData != null)
            {
                if (package.requestData.queryID != null)
                {
                    if (package.requestData.queryOutKeyID != null)
                    {
                        RequestObjectPackage<ControlQueryMappingModel> queryReq = new RequestObjectPackage<ControlQueryMappingModel>()
                        {
                            requestData = new ControlQueryMappingModel()
                            {
                                controlID = package.requestID,
                                queryID = (int)package.requestData.queryID,
                                queryOutParameterID = (int)package.requestData.queryOutKeyID
                            }
                        };
                        ResponsePackage saveQueryResponse = new DBUtils(new FireBirdConnectionFactory()).RunSqlAction(ControlQueryMappingRepository.SaveControlQueryMapping, queryReq).GetSelfOrExceptionIfError();
                    }
                    if (package.requestData.queryOutValueID != null)
                    {
                        RequestObjectPackage<ControlQueryMappingModel> queryReq = new RequestObjectPackage<ControlQueryMappingModel>()
                        {
                            requestData = new ControlQueryMappingModel()
                            {
                                controlID = package.requestID,
                                queryID = (int)package.requestData.queryID,
                                queryOutParameterID = (int)package.requestData.queryOutValueID
                            }
                        };
                        ResponsePackage saveQueryResponse = new DBUtils(new FireBirdConnectionFactory()).RunSqlAction(ControlQueryMappingRepository.SaveControlQueryMapping, queryReq).GetSelfOrExceptionIfError();
                    }
                }
                if (package.requestData.saveField != null)
                {
                    RequestObjectPackage<ControlDictionaryMappingModel> cdReq = new RequestObjectPackage<ControlDictionaryMappingModel>()
                    {
                        requestData = new ControlDictionaryMappingModel()
                        {
                            controlID = package.requestID,
                            dictionaryFieldID = (int)package.requestData.saveField
                        }
                    };
                    ResponsePackage saveQueryResponse = new DBUtils(new FireBirdConnectionFactory()).RunSqlAction(ControlDictionaryMappingRepository.SaveControlDictionaryMapping, cdReq).GetSelfOrExceptionIfError();
                }
            }

            return new ResponsePackage();
        }

        /// <summary>
        /// Рекурсивная функция сохранения формы, точнее ее элементов и свойств
        /// </summary>
        /// <param name="package"></param>
        /// <returns>Объект типа SaveControlModel, содержащий в себе исходный объект формы, но с информацией об ID вставленных компонентов</returns>
        public ResponseObjectPackage<SaveControlModel> SaveAllForm(RequestObjectPackage<SaveControlModel> package)
        {
            // Сохранить контрол
            RequestObjectPackage<ControlModel> controlReq = new RequestObjectPackage<ControlModel>()
            {
                requestData = package.requestData.control
            };
            ResponsePackage saveControlResponse = new DBUtils(new FireBirdConnectionFactory()).RunSqlAction(new ControlsRepository().SaveControl, controlReq).GetSelfOrExceptionIfError();
            package.requestData.control.ID = saveControlResponse.resultID;
            if (package.requestData.items != null) package.requestData.items.ForEach(x => x.control.controlIDParent = saveControlResponse.resultID);
            if (package.requestData.properties != null) package.requestData.properties.ForEach(x => x.controlID = saveControlResponse.resultID);
            
            // сохранить входные и выходные параметы запроса 
            // TODO не забыть добавть _ID всем загружаемым
            // У загруженных был ID, у вновь добавленных - _ID
            if (package.requestData.data.queryID != null && package.requestData.data.queryID > 0)
            {
                QueryViewModel query = package.requestData.queries.FindAll(x => x._ID == package.requestData.data.queryID).FirstOrDefault();
                package.requestData.data.queryID = query.ID;
            }
            RequestObjectPackage<QueryData> queryDataReq = new RequestObjectPackage<QueryData>()
            {
                requestData = package.requestData.data,
                requestID = package.requestData.control.ID
            };
            ResponsePackage saveQueryDataResponse = this.SaveQueryData(queryDataReq).GetSelfOrExceptionIfError();

            // сохранить свойства
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

            // сохранить параметры запроса
            if (package.requestData.queryInParams != null)
            {
                foreach (QueryInParam param in package.requestData.queryInParams)
                {
                    if (param.controlName == package.requestData.properties.FindAll(x => x.property == "name").FirstOrDefault().value)
                    {
                        int queryID = param.queryID.GetValueOrDefault(0);
                        if (queryID == 0)
                        {
                            QueryViewModel anotherQuery = package.requestData.queries.FindAll(x => x._ID == param.query_ID.GetValueOrDefault()).FirstOrDefault();
                            queryID = anotherQuery.ID;
                        }
                        RequestObjectPackage<QueryQueryInParameterModel> inReq = new RequestObjectPackage<QueryQueryInParameterModel>()
                        {
                            requestData = new QueryQueryInParameterModel()
                            {
                                ID = param.ID.GetValueOrDefault(0),
                                controlID = package.requestData.control.ID,
                                queryID = queryID,
                                queryInParameterID = param.queryInParameterID.GetValueOrDefault()
                            }
                        };
                        ResponsePackage saveInResponse = new DBUtils(new FireBirdConnectionFactory()).RunSqlAction(QueryQueryInParametersRepository.SaveQueryQueryInParameter, inReq).GetSelfOrExceptionIfError();
                    }
                }
            }

            // рекурсия
            if (package.requestData.items != null)
            {
                foreach (SaveControlModel item in package.requestData.items)
                {
                    item.queries = package.requestData.queries;
                    RequestObjectPackage<SaveControlModel> propItem = new RequestObjectPackage<SaveControlModel>(){requestData = item};
                    ResponsePackage saveItemResponse = SaveAllForm(propItem).GetSelfOrExceptionIfError();
                }
            }

            return new ResponseObjectPackage<SaveControlModel>() { resultData = package.requestData };
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

        /// <summary>
        /// Удалить удаленные пользвателем компоненты
        /// </summary>
        /// <param name="package"></param>
        /// <returns></returns>
        public ResponsePackage DeleteOldControls(RequestObjectPackage<SaveControlModel> package)
        {
            // все контролы формы
            List<ControlListEntity> oldControls = new ControlsLogic().GetControlsByFormID(new RequestPackage() { requestID = package.requestID }).GetDataOrExceptionIfError();
            // список свежих ID контролов
            List<int> newIDs = new List<int>();
            Action<SaveControlModel> action = null; 
            action = delegate(SaveControlModel current)
            {
                if (current.control.ID > 0)
                {
                    newIDs.Add(current.control.ID);
                }
                if (current.items != null && current.items.Count > 0)
                {
                    foreach (SaveControlModel ctrl in current.items)
                    {
                        action(ctrl);
                    }
                }
            };
            action(package.requestData);
            List<int> IDsToDelete = oldControls.FindAll(x => newIDs.Contains(x.ID) == false).OrderByDescending(x => x.orderNumber).Select(x => x.ID).ToList();
            if (IDsToDelete != null && IDsToDelete.Count > 0)
            {
                foreach (int id in IDsToDelete)
                {
                    RequestPackage req = new RequestPackage() { requestID = id };
                    // Проверить возможность удаления
                    ResponsePackage responseCheck = new DBUtils(new FireBirdConnectionFactory()).RunSqlAction(new ControlsRepository().CheckDeleteControl, req);
                    responseCheck.ThrowExceptionIfError();
                    // Удалить свойства контрола
                    ResponsePackage responseDelProperty = new DBUtils(new FireBirdConnectionFactory()).RunSqlAction(new ControlPropertiesRepository().DeletePropertiesByControlID, req);
                    responseDelProperty.ThrowExceptionIfError();
                    // Удалить контрол
                    ResponsePackage responseDelControl = new DBUtils(new FireBirdConnectionFactory()).RunSqlAction(new ControlsRepository().DeleteControlByID, req);
                    responseDelControl.ThrowExceptionIfError();
                }
            }

            return new ResponsePackage();
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
