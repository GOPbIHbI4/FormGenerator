using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.Utilities
{
    public class RequestObjectPackage<T>:RequestPackage
    {
        public T requestData { get; set; }
    }
}
