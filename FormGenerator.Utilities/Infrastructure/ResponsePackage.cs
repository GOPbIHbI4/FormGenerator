using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FormGenerator.Utilities
{
    /// <summary> Пакет с данными-результатами запроса
    /// </summary>
    public class ResponsePackage
    {
        public int resultCode { get; set; }
        public int resultID { get; set; }
        public string resultString { get; set; }
        public string resultMessage { get; set; }
        public DateTime resultDate { get; set; }

        public void ThrowExceptionIfError()
        {
            if (this.resultCode < 0)
            {
                throw new Exception(this.resultMessage);
            }
        }

        public string GetStringOrExceptionIfError()
        {
            this.ThrowExceptionIfError();
            return this.resultString;
        }

        public int GetIdOrExceptionIfError()
        {
            this.ThrowExceptionIfError();
            return this.resultID;
        }
    }
}
