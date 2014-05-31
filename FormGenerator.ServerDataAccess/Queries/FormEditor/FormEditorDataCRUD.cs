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

        #region Сохранение

        /// <summary>
        /// Функция сохранения формы для редактора форм.
        /// </summary>
        /// <param name="request"></param>
        /// <param name="connectionID"></param>
        /// <returns></returns>
        public ResponsePackage SaveForm(RequestObjectPackage<FormModel> request, IDbConnection connectionID)
        {
            FormModel obj = request.requestData;
            string sql = string.Empty;

            if (obj.ID <= 0)
            {
                sql = string.Format(
                    " select id from forms where name = '{0}' ",
                    obj.name ?? ""
                );
                List<PropertyTypeListEntity> list = DBOrmUtils.OpenSqlList<PropertyTypeListEntity>(sql, FormEditorDataCRUD.idMapping, connectionID);
                if (list.Count > 0)
                {
                    throw new Exception("Форма с названием \"" + obj.name + "\" уже существует.");
                }
            }

            ResponsePackage result = new FormsRepository().SaveForm(request, connectionID);
            result.ThrowExceptionIfError();
            return result;
        }

        /// <summary>
        /// Функция сохранения свойства контрола формы по имени для редактора форм.
        /// </summary>
        /// <param name="request"></param>
        /// <param name="connectionID"></param>
        /// <returns></returns>
        public ResponsePackage SaveProperty(RequestObjectPackage<ControlPropertyViewModel> request, IDbConnection connectionID)
        {
            ControlPropertyModel obj = GetPropertyByName(request, connectionID).GetDataOrExceptionIfError();
            RequestObjectPackage<ControlPropertyModel> saveReq = new RequestObjectPackage<ControlPropertyModel>()
            {
                requestData = obj
            };
            ResponsePackage result = new ControlPropertiesRepository().SaveProperty(saveReq, connectionID);
            result.ThrowExceptionIfError();
            return result;
        }

        /// <summary>
        /// Получить объект ControlPropertyModel по объекту ControlPropertyViewModel. 
        /// Используется функцией SaveProperty для определения необходимых параметров объекта.
        /// </summary>
        /// <param name="request"></param>
        /// <param name="connectionID">Объект подключения к базе данных</param>
        /// <returns>Объект-оболочку ResponseObjectPackage, содержащий в поле resultData объект ControlPropertyModel, готовый для сохранения</returns>
        private ResponseObjectPackage<ControlPropertyModel> GetPropertyByName(RequestObjectPackage<ControlPropertyViewModel> request, IDbConnection connectionID)
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
            List<PropertyTypeListEntity> list = DBOrmUtils.OpenSqlList<PropertyTypeListEntity>(sql, FormEditorDataCRUD.idMapping, connectionID);
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
                List<PropertyTypeListEntity> props = DBOrmUtils.OpenSqlList<PropertyTypeListEntity>(sql, FormEditorDataCRUD.idMapping, connectionID);
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
