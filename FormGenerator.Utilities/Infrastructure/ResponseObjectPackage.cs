using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.Utilities
{
    public class ResponseObjectPackage<T>:ResponsePackage
    {
        public T resultData { get; set; }
    }
}
