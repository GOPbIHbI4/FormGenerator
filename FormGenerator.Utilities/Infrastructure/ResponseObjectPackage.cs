using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.Utilities
{
    /// <summary> Сложный пакет с данными-результатами запроса
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class ResponseObjectPackage<T>:ResponsePackage
    {
        public T resultData { get; set; }

        public T GetDataOrExceptionIfError()
        {
            this.ThrowExceptionIfError();
            return this.resultData;
        }

        public new ResponseObjectPackage<T> GetSelfOrExceptionIfError()
        {
            this.ThrowExceptionIfError();
            return this;
        }
    }
}
