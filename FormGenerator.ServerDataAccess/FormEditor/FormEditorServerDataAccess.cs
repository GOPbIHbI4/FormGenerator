using FirebirdSql.Data.FirebirdClient;
using FormGenerator.Utilities;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.ServerDataAccess
{
    public class FormEditorServerDataAccess
    {
        public ResponseObjectPackage<object> GetFormByID(RequestPackage request, IDbConnection connectionID)
        {
            string sql = string.Format(
                " select f.id, f.form, f.dictionary_id, d.dictionary " +
                " from form f " +
                " left join dictionary d on f.dictionary_id = d.id " +
                " where f.id = {0} ",
                request.requestID
            );

            ResponseObjectPackage<object> obj = new ResponseObjectPackage<object>()
            {
                resultData = new
                {
                    animCollapse = true,
                    autoScroll = false,
                    bodyPadding = "0 0 0 0",
                    collapsible = false,
                    closable = true,
                    constrain = true,
                    disabled = false,
                    draggable = true,
                    frame = true,
                    header = true,
                    hidden = false,
                    height = 300,
                    margin = "5 5 5 5",
                    maxWidth = 1000,
                    minWidth = 200,
                    maxHeight = 1000,
                    minHeight = 200,
                    maximizable = true,
                    minimizable = true,
                    modal = true,
                    name = "senchawin",
                    resizable = true,
                    title = "My Window",
                    width = 500,
                    xtype = "window",
                    items = new List<object>()
                            {
		                        new {
			                        allowBlank= true,
                                    anchor = "0",
			                        blankText= "Данное поле обязательно к заполнению",
			                        disabled= false,
			                        fieldLabel= "My TextField",
			                        hidden= false,
			                        invalidText= "Значение поля некорректно",
			                        labelSeparator= "",
			                        labelWidth= 100,
			                        margin= "5 5 0 5",
			                        maxWidth= 1000,
			                        minWidth= 100,
			                        name= "senchatextfield2451278",
			                        readOnly= false,
			                        width= 200,
			                        height= 22,
                                    xtype= "textfield"
		                        },
		                        new {
			                        allowDecimals= false,
                                    anchor = "0",
			                        allowExponential= false,
			                        allowBlank= true,
			                        blankText= "Данное поле обязательно к заполнению",
			                        disabled= false,
			                        decimalPrecision= 2,
			                        fieldLabel= "My NumberField",
			                        format= 0.00,
			                        hidden= false,
			                        invalidText= "Значение поля некорректно",
			                        labelSeparator= "",
			                        labelWidth= 100,
			                        margin= "5 5 0 5",
			                        maxWidth= 1000,
			                        minWidth= 95,
			                        maxValue= 1.7976931348623157e+308,
			                        minText= "Значение поля должно быть больше или равно {0}",
			                        maxText= "Значение поля должно быть меньше или равно {0}",
			                        mouseWheelEnabled= true,
			                        nanText= "Значение поля некорректно",
			                        name= "senchanumberfield2103395",
			                        step= 1,
			                        readOnly= false,
			                        width= 200,
			                        height= 22,
                                    xtype= "numberfield"
		                        },
		                        new {
                                    anchor = "0",
			                        constrain= false,
			                        collapsible= false,
			                        disabled= false,
			                        hidden= false,
			                        height= 100,
			                        margin= "5 5 5 5",
			                        maxWidth= 1000,
			                        minWidth= 20,
			                        maxHeight= 1000,
			                        minHeight= 20,
			                        name= "senchafieldset3763304",
			                        padding= "2 2 2 2",
			                        title = "My FieldSet",
			                        width = 200,
                                    xtype= "fieldset"
		                        }
                            }
                }
            };

            return new ResponseObjectPackage<object>() { resultData = obj };
        }
    }
}
