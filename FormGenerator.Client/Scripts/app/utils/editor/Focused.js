Ext.define('FormGenerator.editor.Focused', {
    singleton: true,
    focusedCmp: undefined,
    getFocusedCmp: function () {
        return this.focusedCmp;
    },
    setFocusedCmp: function (cmp) {
        this.clearFocusedCmp();
        try {
            if (cmp) {
                this.focusedCmp = cmp;
                this.focusedCmp.addCls('z-focused-element');
            }
        } catch (ex) {
            console.log('Deleted focusedCmp is empty. Error: ' + ex + ' Focused component: ' + this.focusedCmp);
        }
    },
    clearFocusedCmp: function () {
        try {
            if (this.focusedCmp) {
                this.focusedCmp.removeCls('z-focused-element');
            }
        } catch (ex) {
            console.log('Deleted focusedCmp is empty. Error: ' + ex + ' Focused component: ' + this.focusedCmp);
        }
        this.focusedCmp = null;
    }
});