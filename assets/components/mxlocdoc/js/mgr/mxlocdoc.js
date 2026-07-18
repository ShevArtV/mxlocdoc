var MxLocDoc = window.MxLocDoc || {};

Ext.onReady(function () {
    var target = Ext.get('mxlocdoc-app');

    if (!target) {
        return;
    }

    target.addCls('mxlocdoc-ready');
});
