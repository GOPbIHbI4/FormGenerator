Ext.define('FormGenerator.editor.Random', {
    singleton: true,
    usedNumbers: undefined,
    init:function(){
        this.usedNumbers = [];
    },
    get: function () {
        var num;
        while(true){
            num = getRandomInt();
            if (!Ext.Array.contains(this.usedNumbers, num)){
                this.add(num);
                break;
            }
        }
        return num;
    },
    add: function (num) {
        this.usedNumbers.push(num);
    },
    clear: function () {
        this.usedNumbers = [];
    }
});