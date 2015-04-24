/*!
 * Ext JS Library 3.1.0
 * Copyright(c) 2006-2009 Ext JS, LLC
 * licensing@extjs.com
 * http://www.extjs.com/license
 */
Ext.define('Ext.app.Portlet',{
    extend : 'Ext.panel.Panel',
    alias : 'portlet',
    //layout is added on 9-nov-2012
    layout : 'fit',
    anchor : '100%',
    frame : false,
    collapsible : true,
    draggable: {
        moveOnDrag: false
    },
    cls : 'x-portlet'
});