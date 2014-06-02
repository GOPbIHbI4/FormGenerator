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
    public class EventEditorDataCRUD
    {

        /// <summary>
        /// Получить список типов событий
        /// </summary>
        /// <param name="request"></param>
        /// <param name="connectionID"></param>
        /// <returns></returns>
        public ResponseObjectPackage<List<EventType>> GetEventTypeList(RequestPackage request, IDbConnection connectionID)
        {
            string sql = string.Format(
                 " select t.*, e.NAME " +
                 " from EVENT_TYPE_CONTROL_TYPE t " +
                 " left join EVENT_TYPES e on e.ID = t.EVENT_TYPE_ID "
             );
            List<EventType> list = DBOrmUtils.OpenSqlList<EventType>(sql, EventEditorDataCRUD.eventTypeMapping, connectionID);
            return new ResponseObjectPackage<List<EventType>>() { resultData = list };
        }

        /// <summary>
        /// Функция удаления всех событий формы
        /// </summary>
        /// <param name="request"></param>
        /// <param name="connectionID"></param>
        /// <returns></returns>
        public ResponsePackage DeleteAllEvents(RequestPackage request, IDbConnection connectionID, IDbTransaction transactionID)
        {
            int formID = request.requestID;
            string sql = string.Format(
                " delete from ACTION_PARAMETERS where ACTION_ID in ( " +
                "   select ID from ACTIONS where EVENT_ID in ( " +
                "     select ID from EVENTS where CONTROL_ID in ( "+
                "        select CONTROL_ID from CONTROLS where FORM_ID = {0} " +
                "       ) " +
                "   ) " +
                " )",
                formID
            );
            ResponseTablePackage res = DBUtils.ExecuteSQL(sql, connectionID, false, transactionID);
            res.ThrowExceptionIfError();

            sql = string.Format(
                " delete from ACTIONS where EVENT_ID in ( " +
                "    select ID from EVENTS where CONTROL_ID in ( " +
                "       select CONTROL_ID from CONTROLS where FORM_ID = {0} " +
                "    ) " +
                " )",
                formID
            );
            res = DBUtils.ExecuteSQL(sql, connectionID, false, transactionID);
            res.ThrowExceptionIfError();


            sql = string.Format(
                " delete from EVENTS where CONTROL_ID in (" +
                "   select CONTROL_ID from CONTROLS where FORM_ID = {0}" + 
                " ) ",
                formID
            );
            res = DBUtils.ExecuteSQL(sql, connectionID, false, transactionID);
            res.ThrowExceptionIfError();

            return new ResponsePackage();
        }
        // Перегрузка без транзакции
        public ResponsePackage DeleteAllEvents(RequestPackage request, IDbConnection connectionID)
        {
            return this.DeleteAllEvents(request, connectionID);
        }

        /// <summary>
        /// Функция, получающая по controlID события
        /// </summary>
        /// <param name="request"></param>
        /// <param name="connectionID"></param>
        /// <returns></returns>
        public ResponseObjectPackage<List<OpenEvent>> GetEventsByControlID(RequestPackage request, IDbConnection connectionID)
        {
            int controlID = request.requestID;
            string sql = string.Format(
                " select e.ID, et.NAME, e.EVENT_TYPE_ID, e.CONTROL_ID, p.VALUE_ as CONTROL_NAME, c.CONTROL_TYPE_ID " + Environment.NewLine +
                " from EVENTS e " + Environment.NewLine +
                " left join EVENT_TYPES et on e.EVENT_TYPE_ID = et.ID " + Environment.NewLine +
                " left join CONTROLS c on e.CONTROL_ID = c.ID " + Environment.NewLine +
                " left join CONTROL_PROPERTIES p on p.CONTROL_ID = c.ID " + Environment.NewLine +
                " left join CONTROL_TYPE_PROPERTY_TYPE pt on pt.ID = p.CONTROL_PROPERTY_TYPE_ID " + Environment.NewLine +
                " left join CONTROL_PROPERTY_TYPES cpt on cpt.ID = pt.CONTROL_PROPERTY_TYPE_ID " + Environment.NewLine +
                " where e.CONTROL_ID = {0} and cpt.NAME = 'name' ",
                controlID
            );
            List<OpenEvent> list = DBOrmUtils.OpenSqlList<OpenEvent>(sql, eventMapping, connectionID);
            foreach (OpenEvent _event in list)
            {
                sql = string.Format(
                    " select a.ID, a.ORDER_NUMBER, a.EVENT_ID, a.ACTION_TYPE_ID, t.NAME " + Environment.NewLine +
                    " from ACTIONS a " + Environment.NewLine +
                    " left join ACTION_TYPES t on a.ACTION_TYPE_ID = t.ID " + Environment.NewLine +
                    " where a.EVENT_ID = {0} ",
                    _event.ID
                );
                List<OpenAction> actions = DBOrmUtils.OpenSqlList<OpenAction>(sql, actionMapping, connectionID);
                _event.actions = actions;
                foreach (OpenAction action in actions)
                {
                    sql = string.Format(
                        " select a.ID, apt.NAME, a.ACTION_ID, a.ACTION_PARAMETER_TYPE_ID, a.CONTROL_ID, p.VALUE_ as CONTROL_NAME, null as \"VALUE\" " + Environment.NewLine +
                        " from ACTION_PARAMETERS a " + Environment.NewLine +
                        " left join ACTION_PARAMETER_TYPES apt on a.ACTION_PARAMETER_TYPE_ID = apt.ID " + Environment.NewLine +
                        " left join CONTROLS c on a.CONTROL_ID = c.ID " + Environment.NewLine +
                        " left join CONTROL_PROPERTIES p on p.CONTROL_ID = c.ID " + Environment.NewLine +
                        " left join CONTROL_TYPE_PROPERTY_TYPE pt on pt.ID = p.CONTROL_PROPERTY_TYPE_ID " + Environment.NewLine +
                        " left join CONTROL_PROPERTY_TYPES cpt on cpt.ID = pt.CONTROL_PROPERTY_TYPE_ID " + Environment.NewLine +
                        " where a.ACTION_ID = {0} and cpt.NAME = 'name' ",
                        action.ID
                    );
                    List<OpenActionParam> parameters = DBOrmUtils.OpenSqlList<OpenActionParam>(sql, paramsMapping, connectionID);
                    action.parameters = parameters;
                    foreach (OpenActionParam p in parameters)
                    {
                        sql = string.Format(
                            " select cpt.NAME, p.VALUE_ as \"VALUE\" " + Environment.NewLine +
                            " from CONTROL_PROPERTIES p " + Environment.NewLine +
                            " left join CONTROLS c on p.CONTROL_ID = c.ID " + Environment.NewLine +
                            " left join CONTROL_TYPE_PROPERTY_TYPE pt on pt.ID = p.CONTROL_PROPERTY_TYPE_ID " + Environment.NewLine +
                            " left join CONTROL_PROPERTY_TYPES cpt on cpt.ID = pt.CONTROL_PROPERTY_TYPE_ID " + Environment.NewLine +
                            " where p.CONTROL_ID = {0} and " +
                            "  cpt.NAME = 'name' or cpt.NAME = 'fieldLabel' or cpt.NAME = 'xtype' ",
                            p.controlID
                        );
                        List<NameValue> properties = DBOrmUtils.OpenSqlList<NameValue>(sql, nameValueMapping, connectionID);
                        string xtype = "", name = "", fieldLabel = "";
                        foreach (NameValue prop in properties)
                        {
                            if (prop.name == "name") name = prop.value;
                            if (prop.name == "xtype") xtype = prop.value;
                            if (prop.name == "fieldLabel") fieldLabel = prop.value;
                        }
                        p.value = xtype + "(label=\"" + fieldLabel + "\", name=\"" + name + "\", )";
                    }
                }
            }

            return new ResponseObjectPackage<List<OpenEvent>>() { resultData = list };
        }

        #region Маппинг

        public static readonly Dictionary<string, string> eventTypeMapping = new Dictionary<string, string>()
        {
            {"ID","ID"},
            {"name","NAME"},
            {"controlTypeID","CONTROL_TYPE_ID"},
            {"eventTypeID","EVENT_TYPE_ID"}
        };

        public static readonly Dictionary<string, string> eventMapping = new Dictionary<string, string>()
        {
            {"ID","ID"},
            {"eventTypeID","EVENT_TYPE_ID"},
            {"controlID","CONTROL_ID"},
            {"name","NAME"},
            {"controlTypeID","CONTROL_TYPE_ID"},
            {"controlName","CONTROL_NAME"}
        };

        public static readonly Dictionary<string, string> actionMapping = new Dictionary<string, string>()
        {
            {"ID","ID"},
            {"orderNumber","ORDER_NUMBER"},
            {"eventID","EVENT_ID"},
            {"name","NAME"},
            {"actionTypeID","ACTION_TYPE_ID"}
        };

        public static readonly Dictionary<string, string> paramsMapping = new Dictionary<string, string>()
        {
            {"ID","ID"},
            {"name","NAME"},
            {"value","VALUE"},
            {"actionID","ACTION_ID"},
            {"actionInParamTypeID","ACTION_PARAMETER_TYPE_ID"},
            {"controlName","CONTROL_NAME"},
            {"controlID","CONTROL_ID"}
        };

        public static readonly Dictionary<string, string> nameValueMapping = new Dictionary<string, string>()
        {
            {"name","NAME"},
            {"value","VALUE"}
        };

        class NameValue
        {
            public string name { get; set; }
            public string value { get; set; }
        }

        #endregion
    }
}
