using FirebirdSql.Data.FirebirdClient;
using FormGenerator.Models;
using FormGenerator.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.ServerDataAccess
{
    public class FormEditorDataCRUD
    {

        #region Сохранение формы

        /// <summary>
        /// Рекурсивная функция сохранения контролов формы
        /// </summary>
        /// <param name="package"></param>
        /// <param name="connectionID"></param>
        /// <param name="transactionID"></param>
        /// <returns></returns>
        public ResponseObjectPackage<SaveControlModel> SaveFullForm(RequestObjectPackage<SaveControlModel> package, IDbConnection connectionID, IDbTransaction transactionID)
        {
            int formID = package.requestID;
            // Сохранить контрол
            package.requestData.control.formID = formID;
            RequestObjectPackage<ControlModel> controlReq = new RequestObjectPackage<ControlModel>()
            {
                requestData = package.requestData.control
            };
            ResponsePackage saveControlResponse = new ControlsRepository().SaveControl(controlReq, connectionID, transactionID).GetSelfOrExceptionIfError();
            // controlID
            package.requestData.control.ID = saveControlResponse.resultID;
            if (package.requestData.items != null) package.requestData.items.ForEach(x => x.control.controlIDParent = saveControlResponse.resultID);
            if (package.requestData.properties != null) package.requestData.properties.ForEach(x => x.controlID = saveControlResponse.resultID);
            if (package.requestData.items != null) package.requestData.items.ForEach(x => x.control.controlIDParent = saveControlResponse.resultID);

            // сохранить входные и выходные параметы запроса 
            RequestObjectPackage<QueryData> queryDataReq = new RequestObjectPackage<QueryData>()
            {
                requestData = package.requestData.data,
                requestID = package.requestData.control.ID
            };
            ResponsePackage saveQueryDataResponse = this.SaveQueryData(queryDataReq, connectionID, transactionID).GetSelfOrExceptionIfError();

            // сохранить свойства
            if (package.requestData.properties != null)
            {
                foreach (ControlPropertyViewModel prop in package.requestData.properties)
                {
                    RequestObjectPackage<ControlPropertyViewModel> propReq = new RequestObjectPackage<ControlPropertyViewModel>()
                    {
                        requestData = prop
                    };
                    ResponsePackage savePropResponse = new FormEditorDataCRUD().SaveProperty(propReq, connectionID, transactionID).GetSelfOrExceptionIfError();
                }
            }

            // сохранить параметры запроса
            if (package.requestData.queryInParams != null)
            {
                foreach (QueryInParam param in package.requestData.queryInParams)
                {
                    if (param.controlName == package.requestData.properties.FindAll(x => x.property == "name").FirstOrDefault().value)
                    {
                        QueryViewModel anotherQuery = package.requestData.queries.FindAll(x => x._ID == param.query_ID.GetValueOrDefault()).FirstOrDefault();
                        int queryID = anotherQuery.ID;
                        RequestObjectPackage<QueryQueryInParameterModel> inReq = new RequestObjectPackage<QueryQueryInParameterModel>()
                        {
                            requestData = new QueryQueryInParameterModel()
                            {
                                controlID = package.requestData.control.ID,
                                queryID = queryID,
                                queryInParameterID = param.queryInParameterID.GetValueOrDefault()
                            }
                        };
                        ResponsePackage saveInResponse = QueryQueryInParametersRepository.SaveQueryQueryInParameter(inReq, connectionID, transactionID).GetSelfOrExceptionIfError();
                    }
                }
            }

            // рекурсия
            if (package.requestData.items != null)
            {
                foreach (SaveControlModel item in package.requestData.items)
                {
                    item.queries = package.requestData.queries;
                    RequestObjectPackage<SaveControlModel> propItem = new RequestObjectPackage<SaveControlModel>() { requestData = item, requestID = package.requestID };
                    ResponsePackage saveItemResponse = this.SaveFullForm(propItem, connectionID, transactionID).GetSelfOrExceptionIfError();
                }
            }

            return new ResponseObjectPackage<SaveControlModel>() { resultData = package.requestData };
        }

        /// <summary>
        /// Функция сохранения формы в транзакции
        /// </summary>
        /// <param name="request"></param>
        /// <param name="connectionID"></param>
        /// <returns></returns>
        public ResponsePackage SaveFormInTransaction(RequestObjectPackage<SaveFormModel> request, IDbConnection connectionID)
        {
            IDbTransaction transactionID = null;
            bool isEdit = request.requestData.form.ID > 0;
            try
            {
                // транзакция
                transactionID = connectionID.BeginTransaction();
                
                // сохранить форму
                RequestObjectPackage<FormModel> formRequest = new RequestObjectPackage<FormModel>() { requestData = request.requestData.form };
                ResponsePackage formResponse = this.SaveForm(formRequest, connectionID, transactionID).GetSelfOrExceptionIfError();
                int formID = formResponse.GetIdOrExceptionIfError();
                request.requestData.form.ID = formID;
                // сохранить событие открытия формы
                if (!isEdit)
                {
                    this.SaveOpenFormEvent(request, connectionID, transactionID).ThrowExceptionIfError();
                }
                RequestObjectPackage<SaveControlModel> allRequest = new RequestObjectPackage<SaveControlModel>()
                {
                    requestData = request.requestData.control,
                    requestID = formID
                };
                // удалить не нужные компоненты
                this.DeleteAllFormInformation(allRequest, connectionID, transactionID).ThrowExceptionIfError();
                // сохранить запросы
                this.SaveQueries(allRequest, connectionID, transactionID).ThrowExceptionIfError();
                // сохранить всю форму
                this.SaveFullForm(allRequest, connectionID, transactionID).ThrowExceptionIfError();
                // задать controlID евентам
                this.SetEventControlID(allRequest).ThrowExceptionIfError();
                // сохранить евенты
                this.SaveAllEvents(allRequest, connectionID, transactionID).ThrowExceptionIfError();
                // сохранить входные и выходные параметры формы
                request.requestData.control = allRequest.requestData;
                this.SaveFormParams(request, connectionID, transactionID).ThrowExceptionIfError();

                // коммит транзакции
                transactionID.Commit();
                return new ResponsePackage() { resultID = formID };
            }
            catch (Exception ex)
            {
                // Ошибка, откатываем изменения
                if (transactionID != null)
                {
                    transactionID.Rollback();
                }
                return new ResponsePackage()
                {
                    resultCode = -1,
                    resultMessage = "При сохранении формы произошла ошибка. Форма не сохранена." + Environment.NewLine + ex.Message
                };
            }
        }

        /// <summary>
        /// Сохранить запросы формы
        /// </summary>
        /// <param name="package"></param>
        /// <returns></returns>
        public ResponsePackage SaveQueries(RequestObjectPackage<SaveControlModel> package, IDbConnection connectionID, IDbTransaction transactionID)
        {
            List<QueryViewModel> queries = package.requestData.queries;
            // сохранить запросы
            if (queries != null)
            {
                foreach (QueryModel q in queries)
                {
                    RequestObjectPackage<QueryModel> queryReq = new RequestObjectPackage<QueryModel>() { requestData = q };
                    ResponsePackage saveQueryResponse = QueriesRepository.SaveQuery(queryReq, connectionID, transactionID).GetSelfOrExceptionIfError();
                    q.ID = saveQueryResponse.resultID;
                }
                // устанавливаем queryID всем нуждающимся в этом компонентам
                Action<SaveControlModel> action = null;
                action = delegate(SaveControlModel current)
                {
                    // У загруженных был ID, у вновь добавленных - _ID
                    if (current.data.queryID != null && current.data.queryID > 0)
                    {
                        QueryViewModel query = queries.FindAll(x => x._ID == current.data.queryID).FirstOrDefault();
                        current.data.queryID = query.ID;
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
            }

            return new ResponsePackage();
        }

        /// <summary>
        /// Сохранить данные 
        /// </summary>
        /// <param name="package">package.requestID = controlID</param>
        /// <returns></returns>
        public ResponsePackage SaveQueryData(RequestObjectPackage<QueryData> package, IDbConnection connectionID, IDbTransaction transactionID)
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
                        ResponsePackage saveQueryResponse = ControlQueryMappingRepository.SaveControlQueryMapping(queryReq, connectionID, transactionID);
                        saveQueryResponse.ThrowExceptionIfError();
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
                        ResponsePackage saveQueryResponse = ControlQueryMappingRepository.SaveControlQueryMapping(queryReq, connectionID, transactionID);
                        saveQueryResponse.ThrowExceptionIfError();
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
                    ResponsePackage saveQueryResponse = ControlDictionaryMappingRepository.SaveControlDictionaryMapping(cdReq, connectionID, transactionID);
                    saveQueryResponse.ThrowExceptionIfError();
                }
            }

            return new ResponsePackage();
        }

        /// <summary>
        /// Удалить удаленные пользвателем компоненты
        /// </summary>
        /// <param name="package"></param>
        /// <returns></returns>
        public ResponsePackage DeleteAllFormInformation(RequestObjectPackage<SaveControlModel> package, IDbConnection connectionID, IDbTransaction transactionID)
        {
            int formID = package.requestID;
            RequestPackage formIDRequest = new RequestPackage() { requestID = formID };

            // Для контролов удалить все евенты
            new EventEditorDataCRUD().DeleteAllEvents(formIDRequest, connectionID, transactionID).ThrowExceptionIfError();
            // Удалить запросы
            QueriesRepository.DeleteAllQueriesByFormID(formIDRequest, connectionID, transactionID).ThrowExceptionIfError();
            // Удалить параметры формы (входные и выходные)
            FormInParametersRepository.DeleteByFormID(formIDRequest, connectionID, transactionID).ThrowExceptionIfError();
            FormOutParametersRepository.DeleteByFormID(formIDRequest, connectionID, transactionID).ThrowExceptionIfError();
            // Удалить свойства
            new FormsRepository().DeletePropertiesByFormID(formIDRequest, connectionID, transactionID).ThrowExceptionIfError();
            // Удалить контролы
            new ControlsRepository().DeleteControlByFormID(formIDRequest, connectionID, transactionID).ThrowExceptionIfError();

            return new ResponsePackage();
        }

        /// <summary>
        /// Задать параметрам событий ControlID после сохранения контролов
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public ResponsePackage SetEventControlID(RequestObjectPackage<SaveControlModel> obj)
        {
            SaveControlModel root = obj.requestData;
            List<SaveControlModel> controls = new List<SaveControlModel>();
            Action<SaveControlModel> GetControlsList = null;
            GetControlsList = delegate(SaveControlModel cur)
            {
                controls.Add(cur);
                // рекурсия
                if (cur.items != null)
                {
                    foreach (SaveControlModel item in cur.items)
                    {
                        GetControlsList(item);
                    }
                }
            };
            GetControlsList(root);

            Action<SaveControlModel> SetControlID = null;
            SetControlID = delegate(SaveControlModel cur)
            {
                // заполняем для эвентов controlID
                if (cur.events != null)
                {
                    foreach (SaveEvent _event in cur.events)
                    {
                        if (_event.actions != null)
                        {
                            foreach (SaveAction action in _event.actions)
                            {
                                if (action.parameters != null)
                                {
                                    foreach (SaveActionParam param in action.parameters)
                                    {
                                        foreach (SaveControlModel control in controls)
                                        {
                                            if (control.properties.FindAll(x => x.property == "name").FirstOrDefault().value == param.controlName)
                                            {
                                                param.controlID = control.control.ID;
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                // рекурсия
                if (cur.items != null)
                {
                    foreach (SaveControlModel item in cur.items)
                    {
                        SetControlID(item);
                    }
                }
            };
            SetControlID(root);

            return new ResponsePackage();
        }

        /// <summary>
        /// Сохранить входные и выходные параметры формы
        /// </summary>
        /// <param name="obj"></param>
        /// <param name="connectionID"></param>
        /// <param name="transactionID"></param>
        /// <returns></returns>
        public ResponsePackage SaveFormParams(RequestObjectPackage<SaveFormModel> obj, IDbConnection connectionID, IDbTransaction transactionID)
        {
            SaveControlModel root = obj.requestData.control;
            // список контролов
            List<SaveControlModel> controls = new List<SaveControlModel>();
            Action<SaveControlModel> GetControlsList = null;
            GetControlsList = delegate(SaveControlModel cur)
            {
                controls.Add(cur);
                // рекурсия
                if (cur.items != null)
                {
                    foreach (SaveControlModel item in cur.items)
                    {
                        GetControlsList(item);
                    }
                }
            };
            GetControlsList(root);

            List<FormParams> inParams = obj.requestData.inParams;
            List<FormParams> outParams = obj.requestData.outParams;
            if (inParams != null)
            {
                foreach (FormParams param in inParams)
                {
                    foreach (SaveControlModel control in controls)
                    {
                        if (control.properties.FindAll(x => x.property == "name").FirstOrDefault().value == param.controlName)
                        {
                            param.controlID = control.control.ID;
                            break;
                        }
                    }
                    RequestObjectPackage<FormInParameterModel> reqInParam = new RequestObjectPackage<FormInParameterModel>()
                    {
                        requestData = new FormInParameterModel()
                        {
                            controlID = (int)param.controlID,
                            name = param.name
                        }
                    };
                    FormInParametersRepository.SaveInParam(reqInParam, connectionID, transactionID).ThrowExceptionIfError();
                }
            }
            if (outParams != null)
            {
                foreach (FormParams param in outParams)
                {
                    foreach (SaveControlModel control in controls)
                    {
                        if (control.properties.FindAll(x => x.property == "name").FirstOrDefault().value == param.controlName)
                        {
                            param.controlID = control.control.ID;
                            break;
                        }
                    }
                    RequestObjectPackage<FormOutParameterModel> reqOutParam = new RequestObjectPackage<FormOutParameterModel>()
                    {
                        requestData = new FormOutParameterModel()
                        {
                            controlID = (int)param.controlID,
                            name = param.name
                        }
                    };
                    FormOutParametersRepository.SaveOutParam(reqOutParam, connectionID, transactionID).ThrowExceptionIfError();
                }
            }

            return new ResponsePackage();
        }

        /// <summary>
        /// Сохранить событие открытия формы
        /// </summary>
        /// <param name="package"></param>
        /// <param name="connectionID"></param>
        /// <param name="transactionID"></param>
        /// <returns></returns>
        public ResponsePackage SaveOpenFormEvent(RequestObjectPackage<SaveFormModel> package, IDbConnection connectionID, IDbTransaction transactionID)
        {
            FormModel form = package.requestData.form;
            // вставить тип события открытия формы
            RequestObjectPackage<ActionTypeModel> saveActionTypeRequest = new RequestObjectPackage<ActionTypeModel>()
            {
                requestData = new ActionTypeModel() { name = "Открыть форму \" " + form.name + " \"", actionKindID = 1 }
            };
            ResponsePackage saveActionTypeResponse = ActionTypesRepository.Save(saveActionTypeRequest, connectionID, transactionID);
            saveActionTypeResponse.ThrowExceptionIfError();
            int actionTypeID = saveActionTypeResponse.GetIdOrExceptionIfError();

            // вставить свойства события
            RequestObjectPackage<ActionTypePropertyModel> saveActionTypePropertyRequest = new RequestObjectPackage<ActionTypePropertyModel>()
            {
                requestData = new ActionTypePropertyModel() { actionTypeID = actionTypeID, actionKindPropertyID = 1, value = form.ID }
            };
            ResponsePackage saveActionTypePropertyResponse = ActionTypePropertiesRepository.Save(saveActionTypePropertyRequest, connectionID, transactionID);
            saveActionTypePropertyResponse.ThrowExceptionIfError();

            return new ResponsePackage();
        }

        /// <summary>
        /// Сохранить евенты после сохранения формы
        /// </summary>
        /// <param name="package"></param>
        /// <returns></returns>
        public ResponseObjectPackage<SaveControlModel> SaveAllEvents(RequestObjectPackage<SaveControlModel> package, IDbConnection connectionID, IDbTransaction transactionID)
        {
            // сохранить евенты
            if (package.requestData.events != null)
            {
                foreach (SaveEvent _event in package.requestData.events)
                {
                    RequestObjectPackage<EventModel> requestEvent = new RequestObjectPackage<EventModel>()
                    {
                        requestData = new EventModel()
                        {
                            controlID = package.requestData.control.ID,
                            eventTypeID = _event.eventTypeID
                        }
                    };
                    ResponsePackage respEvent = EventsRepository.Save(requestEvent, connectionID, transactionID).GetSelfOrExceptionIfError();
                    _event.ID = respEvent.GetIdOrExceptionIfError();
                    if (_event.actions != null)
                    {
                        foreach (SaveAction action in _event.actions)
                        {
                            RequestObjectPackage<ActionModel> requestAction = new RequestObjectPackage<ActionModel>()
                            {
                                requestData = new ActionModel()
                                {
                                    eventID = (int)_event.ID,
                                    orderNumber = action.orderNumber,
                                    actionTypeID = action.actionTypeID
                                }
                            };
                            ResponsePackage respAction = ActionsRepository.Save(requestAction, connectionID, transactionID).GetSelfOrExceptionIfError();
                            action.ID = respAction.GetIdOrExceptionIfError();
                            if (action.parameters != null)
                            {
                                foreach (SaveActionParam param in action.parameters)
                                {
                                    RequestObjectPackage<ActionParameterModel> requestParam = new RequestObjectPackage<ActionParameterModel>()
                                    {
                                        requestData = new ActionParameterModel()
                                        {
                                            actionID = (int)action.ID,
                                            actionParameterTypeID = param.actionInParamTypeID,
                                            controlID = (int)param.controlID
                                        }
                                    };
                                    ResponsePackage respParam = ActionParametersRepository.Save(requestParam, connectionID, transactionID).GetSelfOrExceptionIfError();
                                }
                            }
                        }
                    }
                }
            }

            // рекурсия
            if (package.requestData.items != null)
            {
                foreach (SaveControlModel item in package.requestData.items)
                {
                    RequestObjectPackage<SaveControlModel> propItem = new RequestObjectPackage<SaveControlModel>() { requestData = item };
                    ResponsePackage saveItemResponse = this.SaveAllEvents(propItem, connectionID, transactionID).GetSelfOrExceptionIfError();
                }
            }

            return new ResponseObjectPackage<SaveControlModel>() { resultData = package.requestData };
        }

        #endregion

        #region Сохранение

        /// <summary>
        /// Функция сохранения формы для редактора форм.
        /// </summary>
        /// <param name="request"></param>
        /// <param name="connectionID"></param>
        /// <returns></returns>
        public ResponsePackage SaveForm(RequestObjectPackage<FormModel> request, IDbConnection connectionID, IDbTransaction transactionID)
        {
            FormModel obj = request.requestData;
            string sql = string.Empty;

            if (obj.ID <= 0)
            {
                sql = string.Format(
                    " select id from forms where name = '{0}' ",
                    obj.name ?? ""
                );
                List<PropertyTypeListEntity> list = DBOrmUtils.OpenSqlList<PropertyTypeListEntity>(sql, FormEditorDataCRUD.idMapping, connectionID, transactionID);
                if (list.Count > 0)
                {
                    throw new Exception("Форма с названием \"" + obj.name + "\" уже существует.");
                }
            }

            ResponsePackage result = new FormsRepository().SaveForm(request, connectionID, transactionID);
            result.ThrowExceptionIfError();
            return result;
        }
        public ResponsePackage SaveForm(RequestObjectPackage<FormModel> request, IDbConnection connectionID)
        {
            return this.SaveForm(request, connectionID, null);
        }

        /// <summary>
        /// Функция сохранения свойства контрола формы по имени для редактора форм.
        /// </summary>
        /// <param name="request"></param>
        /// <param name="connectionID"></param>
        /// <returns></returns>
        public ResponsePackage SaveProperty(RequestObjectPackage<ControlPropertyViewModel> request, IDbConnection connectionID, IDbTransaction transactionID)
        {
            ControlPropertyModel obj = GetPropertyByName(request, connectionID, transactionID).GetDataOrExceptionIfError();
            RequestObjectPackage<ControlPropertyModel> saveReq = new RequestObjectPackage<ControlPropertyModel>()
            {
                requestData = obj
            };
            ResponsePackage result = new ControlPropertiesRepository().SaveProperty(saveReq, connectionID, transactionID);
            result.ThrowExceptionIfError();
            return result;
        }
        public ResponsePackage SaveProperty(RequestObjectPackage<ControlPropertyViewModel> request, IDbConnection connectionID)
        {
            return this.SaveProperty(request, connectionID, null);
        }

        /// <summary>
        /// Получить объект ControlPropertyModel по объекту ControlPropertyViewModel. 
        /// Используется функцией SaveProperty для определения необходимых параметров объекта.
        /// </summary>
        /// <param name="request"></param>
        /// <param name="connectionID">Объект подключения к базе данных</param>
        /// <returns>Объект-оболочку ResponseObjectPackage, содержащий в поле resultData объект ControlPropertyModel, готовый для сохранения</returns>
        private ResponseObjectPackage<ControlPropertyModel> GetPropertyByName(RequestObjectPackage<ControlPropertyViewModel> request, IDbConnection connectionID, IDbTransaction transactionID)
        {
            ControlPropertyViewModel obj = request.requestData;
            string sql = string.Format(
                " select t.id " +
                " from control_type_property_type t " +
                " where t.control_type_id = {0} " +
                " and t.control_property_type_id in (select p.id from control_property_types p where p.name = '{1}') ",
                obj.controlTypeID,
                obj.property
            );
            List<PropertyTypeListEntity> list = DBOrmUtils.OpenSqlList<PropertyTypeListEntity>(sql, FormEditorDataCRUD.idMapping, connectionID, transactionID);
            if (list.Count == 1)
            {
                ControlPropertyModel prop = new ControlPropertyModel()
                {
                    value = obj.value,
                    controlID = obj.controlID,
                    controlPropertyTypeID = list[0].ID
                };
                // попытка найти уже существующее свойство
                sql = string.Format(
                    " select p.id " +
                    " from control_properties p " +
                    " where p.control_id = {0} " +
                    " and p.control_property_type_id = {1} ",
                    prop.controlID,
                    prop.controlPropertyTypeID
                );
                List<PropertyTypeListEntity> props = DBOrmUtils.OpenSqlList<PropertyTypeListEntity>(sql, FormEditorDataCRUD.idMapping, connectionID, transactionID);
                if (props.Count == 1)
                {
                    prop.ID = props[0].ID;
                }

                return new ResponseObjectPackage<ControlPropertyModel>() { resultData = prop };
            }
            else
            {
                throw new Exception("Ошибка получения свойства компонента.");
            }
        }
        private ResponseObjectPackage<ControlPropertyModel> GetPropertyByName(RequestObjectPackage<ControlPropertyViewModel> request, IDbConnection connectionID)
        {
            return this.GetPropertyByName(request, connectionID, null);
        }

        #endregion

        #region Выборки

        /// <summary>
        /// Получить список групп типов контролов
        /// </summary>
        /// <param name="request"></param>
        /// <param name="connectionID"></param>
        /// <returns></returns>
        public ResponseObjectPackage<List<ControlTypeGroup>> GetControlTypeGroupList(RequestPackage request, IDbConnection connectionID)
        {
            string sql = string.Format(
                 " select * " +
                 " from control_type_groups "
             );
            List<ControlTypeGroup> list = DBOrmUtils.OpenSqlList<ControlTypeGroup>(sql, FormEditorDataCRUD.controlTypeGroupMapping, connectionID);
            return new ResponseObjectPackage<List<ControlTypeGroup>>() { resultData = list };
        }

        /// <summary>
        /// Функция получения списка типов контролов
        /// </summary>
        /// <param name="request"></param>
        /// <param name="connectionID"></param>
        /// <returns></returns>
        public ResponseObjectPackage<List<ControlTypeListEntity>> GetControlTypeList(RequestPackage request, IDbConnection connectionID)
        {
            string sql = string.Format(
                 " select t.*, g.name as group_name " +
                 " from control_types t " +
                 " left join control_type_groups g on t.control_type_group_id = g.id "
             );
            List<ControlTypeListEntity> list = DBOrmUtils.OpenSqlList<ControlTypeListEntity>(sql, FormEditorDataCRUD.controlTypeMapping, connectionID);
            return new ResponseObjectPackage<List<ControlTypeListEntity>>() { resultData = list };
        }

        /// <summary>
        /// Функция получения всех зависимостей между типами компонентов
        /// </summary>
        /// <param name="request"></param>
        /// <param name="connectionID"></param>
        /// <returns></returns>
        public ResponseObjectPackage<List<ControlTypeDependenciesListEntity>> GetControlTypeDependenciesList(RequestPackage request, IDbConnection connectionID)
        {
            string sql = string.Format(
                 " select d.*, t.name " +
                 " from control_type_dependencies d " +
                 " left join control_types t on d.control_type_id_child = t.id "
             );
            List<ControlTypeDependenciesListEntity> list = DBOrmUtils.OpenSqlList<ControlTypeDependenciesListEntity>(sql, FormEditorDataCRUD.controlTypeDependenciesMapping, connectionID);
            return new ResponseObjectPackage<List<ControlTypeDependenciesListEntity>>() { resultData = list };
        }

        /// <summary>
        /// Выбрать все свойства компонентов
        /// </summary>
        /// <param name="request"></param>
        /// <param name="connectionID"></param>
        /// <returns></returns>
        public ResponseObjectPackage<List<PropertyTypeListEntity>> GetPropertyTypeList(RequestPackage request, IDbConnection connectionID)
        {
            string sql = string.Format(
                 " select p.*, t.name as property, t.logic_value_type_id " +
                 " from control_type_property_type p " +
                 " left join control_property_types t on p.control_property_type_id = t.id "
             );
            List<PropertyTypeListEntity> list = DBOrmUtils.OpenSqlList<PropertyTypeListEntity>(sql, FormEditorDataCRUD.propertyTypeMapping, connectionID);
            return new ResponseObjectPackage<List<PropertyTypeListEntity>>() { resultData = list };
        }

        #endregion

        #region Маппинг

        #region Форма

        public static readonly Dictionary<string, string> formMapping = new Dictionary<string, string>()
        {
            {"ID","ID"},
            {"name","NAME"},
            {"dictionaryID","DICTIONARY_ID"},
            {"dictionary","DICTIONARY"}
        };

        #endregion

        #region Контролы

        public static readonly Dictionary<string, string> controlTypeGroupMapping = new Dictionary<string, string>()
        {
            {"ID","ID"},
            {"name","NAME"}
        };

        public static readonly Dictionary<string, string> controlTypeMapping = new Dictionary<string, string>()
        {
            {"ID","ID"},
            {"component","NAME"},
            {"controlTypeGroupID","CONTROL_TYPE_GROUP_ID"},
            {"path","PATH"},
            {"group","GROUP_NAME"},
            {"description","DESCRIPTION"}
        };

        public static readonly Dictionary<string, string> controlTypeDependenciesMapping = new Dictionary<string, string>()
        {
            {"ID","ID"},
            {"controlTypeIDParent","CONTROL_TYPE_ID_PARENT"},
            {"controlTypeIDChild","CONTROL_TYPE_ID_CHILD"},
            {"child","NAME"}
        };

        #endregion

        #region Свойства

        public static readonly Dictionary<string, string> propertyTypeMapping = new Dictionary<string, string>()
        {
            {"ID","ID"},
            {"property","PROPERTY"},
            {"controlTypeID","CONTROL_TYPE_ID"},
            {"controlPropertyTypeID","CONTROL_PROPERTY_TYPE_ID"},
            {"logicValueTypeID","LOGIC_VALUE_TYPE_ID"},
            {"defaultValue","DEFAULT_VALUE"}
        };

        public static readonly Dictionary<string, string> idMapping = new Dictionary<string, string>()
        {
            {"ID","ID"}
        };

        public static readonly Dictionary<string, string> propertyMapping = new Dictionary<string, string>()
        {
            {"ID","ID"},
            {"controlID","CONTROL_ID"},
            {"controlPropertyTypeID","CONTROL_PROPERTY_TYPE_ID"},
            {"value","VALUE_"}
        };

        #endregion

        #endregion
    }
}
