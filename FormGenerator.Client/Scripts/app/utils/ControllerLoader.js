Ext.define('FormGenerator.utils.ControllerLoader', {
    singleton: true,
    load: function (controller) {
        var application = FormGenerator.getApplication();
        var loadedController;
//        var alreadyCreated = false;
//        application.controllers.items.forEach(function (item) {
//            if (item.id == controller) {
//                alreadyCreated = true;
//            }
//        });
        loadedController = application.getController(controller);

//        if (!alreadyCreated) {
//            loadedController.init();
//        }

        return loadedController;
    }
});