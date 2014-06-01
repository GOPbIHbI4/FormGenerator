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
    public class EventActionsLogic
    {
        public ResponseObjectPackage<List<Control>> GetEventsbyControls(List<Control> controls)
        {
            List<Event> events = new List<Event>();
            RequestObjectPackage<List<Control>> eventsRequest = new RequestObjectPackage<List<Control>>() 
            {
                requestData = controls
            };
            List<EventModel> eventModels = new DBUtils().RunSqlAction(EventsRepository.GetByControlsList, eventsRequest).GetDataOrExceptionIfError();
            RequestObjectPackage<List<EventModel>> actionsRequest = new RequestObjectPackage<List<EventModel>>()
            {
                requestData = eventModels
            };
            List<EventAction> actions = new DBUtils().RunSqlAction(new EventActionsCRUD().GetActionsByEventsList, actionsRequest).GetDataOrExceptionIfError();
            RequestObjectPackage<List<EventAction>> paramsRequest = new RequestObjectPackage<List<EventAction>>()
            {
                requestData = actions
            };
            List<EventActionParameter> parameters = new DBUtils().RunSqlAction(new EventActionsCRUD().GetActionParametersByActionsList, paramsRequest).GetDataOrExceptionIfError();
            List<ActionTypeProperty> properties = new DBUtils().RunSqlAction(new EventActionsCRUD().GetActionTypePropertiesByActionsList, paramsRequest).GetDataOrExceptionIfError();

            foreach (EventAction action in actions)
            {
                action.parameters = parameters.Where(e => e.actionID == action.ID).ToList();
                action.properties = properties.Where(e => e.actionTypeID == action.actionTypeID).ToList();
            }

            foreach (EventModel model in eventModels)
            {
                Event newEvent = new Event();
                newEvent.ID = model.ID;
                newEvent.eventTypeID = model.eventTypeID;
                newEvent.controlID = model.controlID;
                newEvent.actions = actions.Where(e => e.eventID == model.ID).ToList();
                events.Add(newEvent);
            }

            foreach (Control control in controls)
            {
                control.events = events.Where(e => e.controlID == control.ID).ToList();
            }

            return new ResponseObjectPackage<List<Control>>() { resultData = controls };
        }
    }
}
