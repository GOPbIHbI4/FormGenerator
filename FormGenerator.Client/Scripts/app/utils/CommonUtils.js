//Готовит объект для Post-запроса:
//поля со значением null, undefined становятся '',
//массивы и объекты обходятся рекурсивно,
//примитивные поля - кроме дат - становятся строками и тримятся
function preparePostParameter(object) {
    if (object == null || typeof object == 'undefined') {
        object = '';
    } else if (Object.prototype.toString.call(object) === '[object Array]') {
        object.forEach(function (item) {
            item = preparePostParameter(item);
        });
    } else if (Object.prototype.toString.call(object) === '[object Object]') {
        for (var fied in object) {
            object[fied] = preparePostParameter(object[fied]);
        }
    } else if (!(object instanceof Date)) {
        object = object.toString().trim();
    }
    return object;
}