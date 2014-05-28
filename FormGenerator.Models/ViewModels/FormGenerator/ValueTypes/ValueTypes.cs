using FormGenerator.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FormGenerator.Utilities;

namespace FormGenerator.Models
{
    public abstract class AValueType
    {
        public object value { get; protected set; }
        public bool isInitialized { get; set; }
        public void Initialize(string fromClient, bool initialized)
        {
            this.isInitialized = initialized;
            this.Init(fromClient);
        }

        protected abstract void Init(string fromClient);
        public abstract string ToSQL();
        public abstract string Serialize();
        public abstract bool IsNotDefault();
    }

    public class StringValueType:AValueType
    {
        protected override void Init(string fromClient)
        {
            value = fromClient;
        }
        public override string ToSQL()
        {
            return value == null ? "NULL" : "'{0}'".FormatString(value);
        }
        public override string Serialize()
        {
            return (string)value;
        }
        public override bool IsNotDefault()
        {
            return !string.IsNullOrEmpty((string)value);
        }
    }

    public class IntValueType:AValueType
    {
        protected override void Init(string fromClient)
        {
            int temp = 0;
            this.value = Int32.TryParse(fromClient, out temp) ? temp : (int?)null;
        }
        public override string ToSQL()
        {
            return value == null ? "NULL" : "{0}".FormatString(value);
        }
        public override string Serialize()
        {
            return value != null ? value.ToString() : null;
        }
        public override bool IsNotDefault()
        {
            return value != null && (int)value > 0;
        }
    }

    public class DoubleValueType:AValueType
    {
        protected override void Init(string fromClient)
        {
            double temp = 0;
            this.value = double.TryParse(fromClient, out temp) ? temp : (double?)null;
        }
        public override string ToSQL()
        {
            return value == null ? "NULL" : "{0}".FormatString(value);
        }
        public override string Serialize()
        {
            return value != null ? value.ToString() : null;
        }
        public override bool IsNotDefault()
        {
            return value != null && (double)value > 0;
        }
    }

    public class DateValueType:AValueType
    {
        protected override void Init(string fromClient)
        {
            value = Convert.ToDateTime(fromClient);
            if ((DateTime?)value == DateTime.MinValue)
            {
                value = null;
            }
        }
        public override string ToSQL()
        {
            return value == null ? "NULL" : "'{0}'".FormatString(((DateTime?)value).ToDMY());
        }
        public override string Serialize()
        {
            return value != null ? ((DateTime?)value).ToDMY() : null;
        }
        public override bool IsNotDefault()
        {
            return value != null && (DateTime?)value != DateTime.MinValue;
        }
    }
    public class LogicValueType:AValueType
    {
        protected override void Init(string fromClient)
        {
            if (fromClient == null)
            {
                value = null;
            }
            else if (fromClient.Trim().ToLower() == "true")
            {
                value = true;
            }
            else if (fromClient.Trim().ToLower() == "false")
            {
                value = false;
            }
            value = null;
        }
        public override string ToSQL()
        {
            return value == null ? "NULL" : ((bool)value ? "true" : "false");
        }
        public override string Serialize()
        {
            return value != null ? null : ((bool)value ? "true" : "false");
        }
        public override bool IsNotDefault()
        {
            return value != null;
        }
    }
}
