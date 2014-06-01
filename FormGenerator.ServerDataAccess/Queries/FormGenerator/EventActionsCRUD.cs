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
    public class EventActionsCRUD
    {
        public ResponseObjectPackage<List<EventActionParameter>> GetActionParametersByActionsList(RequestObjectPackage<List<EventAction>> request, IDbConnection connectionID)
        {
            List<int> obj = (request.requestData ?? new List<EventAction>() {}).Select(e => e.ID).ToList();
            obj.Add(-1);
            Dictionary<string, string>  mappingDictionary = new Dictionary<string, string>()
            {
                {"ID","ID"},
                {"actionID","ACTION_ID"},
                {"actionParameterTypeID","ACTION_PARAMETER_TYPE_ID"},
                {"controlID","CONTROL_ID"},
                {"name","NAME"},
                {"domainValueTypeID","DOMAIN_VALUE_TYPE_ID"},
            };

            string sql = string.Format(
                "select ap.ID, ap.ACTION_ID, ap.ACTION_PARAMETER_TYPE_ID, ap.CONTROL_ID, apt.NAME, apt.DOMAIN_VALUE_TYPE_ID " + Environment.NewLine +
                "from ACTION_PARAMETERS ap " + Environment.NewLine +
                "inner join ACTION_PARAMETER_TYPES apt on apt.ID = ap.ACTION_PARAMETER_TYPE_ID " + Environment.NewLine +
                "where ap.ACTION_ID in ({0})",
                    string.Join(", ", obj)
            );

            List<EventActionParameter> list = DBOrmUtils.OpenSqlList<EventActionParameter>(sql, mappingDictionary, connectionID);
            return new ResponseObjectPackage<List<EventActionParameter>>() { resultData = list };
        }

        public ResponseObjectPackage<List<ActionTypeProperty>> GetActionTypePropertiesByActionsList(RequestObjectPackage<List<EventAction>> request, IDbConnection connectionID)
        {
            List<int> obj = (request.requestData ?? new List<EventAction>()).Select(e => e.actionTypeID).ToList();
            obj.Add(-1);
            Dictionary<string, string>  mappingDictionary = new Dictionary<string, string>()
            {
                {"ID","ID"},
                {"value","VALUE"},
                {"actionTypeID","ACTION_TYPE_ID"},
                {"actionKindPropertyID","ACTION_KIND_PROPERTY_ID"},
                {"name","NAME"},
            };

            string sql = string.Format(
                "select p.ID, p.\"VALUE\", p.ACTION_TYPE_ID, p.ACTION_KIND_PROPERTY_ID, akp.NAME " + Environment.NewLine +
                "from ACTION_TYPE_PROPERTIES p " + Environment.NewLine +
                "inner join ACTION_KIND_PROPERTIES akp on akp.ID = p.ACTION_KIND_PROPERTY_ID " + Environment.NewLine +
                "where p.ACTION_TYPE_ID in({0})",
                    string.Join(", ", obj)
            );

            List<ActionTypeProperty> list = DBOrmUtils.OpenSqlList<ActionTypeProperty>(sql, mappingDictionary, connectionID);
            return new ResponseObjectPackage<List<ActionTypeProperty>>() { resultData = list };
        }

        public ResponseObjectPackage<List<EventAction>> GetActionsByEventsList(RequestObjectPackage<List<EventModel>> request, IDbConnection connectionID)
        {
            List<int> obj = (request.requestData ?? new List<EventModel>()).Select(e => e.ID).ToList();
            obj.Add(-1);
            Dictionary<string, string> mappingDictionary = new Dictionary<string, string>()
            {
                {"ID","ID"},
                {"eventID","EVENT_ID"},
                {"orderNumber","ORDER_NUMBER"},
                {"actionTypeID","ACTION_TYPE_ID"},
                {"actionKindID","ACTION_KIND_ID"},
            };

            string sql = string.Format(
                "select a.ID, a.EVENT_ID, a.ORDER_NUMBER, a.ACTION_TYPE_ID, t.ACTION_KIND_ID " + Environment.NewLine +
                "from ACTIONS a " + Environment.NewLine +
                "inner join ACTION_TYPES t on t.ID = a.ACTION_TYPE_ID " + Environment.NewLine +
                "where a.EVENT_ID in({0});",
                    string.Join(", ", obj)
            );

            List<EventAction> list = DBOrmUtils.OpenSqlList<EventAction>(sql, mappingDictionary, connectionID);
            return new ResponseObjectPackage<List<EventAction>>() { resultData = list };
        }

    }
}
