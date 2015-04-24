PubMatic.JobAnalysisProduct.Functions.getPubMaticCronsPanel = function (panelId) {

	var panel = Ext.getCmp(panelId),
		cronsGridColumns,
		cronsStore,
		cronsGridPanel;

	Ext.define('Crons', {
	    extend: 'Ext.data.Model',
	    fields: [
	    	{name:'cronId', type:'int'},
	    	{name:'serverId', type:'int'},
	    	{name:'cronExpression', type:'string'},
	    	{name:'cronName', type:'string'},
	    	{name:'cronStatus', type:'string'},
	    	{name:'cronComment', type:'string'},
	        {name:'cronType', type:'string'}
	    ]
	});

	cronsGridColumns = [{
		text     : 'Comment',
		flex     : 1,
		sortable : true,
		dataIndex: 'cronComment',
		align: 'left'
	}, {
		text     : 'Status',
		flex     : 1,
		sortable : true,
		dataIndex: 'cronStatus',
		align: 'center'
	}];

	cronsStore = Ext.create('Ext.data.Store', {
        model: 'Crons',
        data : [],
        autoLoad: true
    });

	cronsGridPanel = Ext.create('Ext.grid.Panel', {
		id: 'cronsGridId', 
        store: cronsStore,
        columns: cronsGridColumns,
        border: false,
        autoScroll: true,
        title: "Crons",
        viewConfig: {
            stripeRows: true,
            enableTextSelection: true
        }
    });

    cronsGridPanel.on('cellClick', function(grid, tD, cellIndex, record, tR, rowIndex, event, eOpts) {
		var tabPanel = Ext.getCmp('jobAnalysisProductAnalysisDetailsTabPanelId');

		if(!tabPanel.queryById('jobAnalysisProductCronPanelId_' + record.data["cronId"])) {

			tabPanel.add({
	    		id: 'jobAnalysisProductCronPanelId_' + record.data["cronId"],
	    		xtype: 'panel',
	    		closable: true,
	    		layout: {
	    			type: 'vbox',
	    			align: 'stretch'
	    		},
	    		title: record.data["cronId"] + "_" + record.data["cronType"],
	    		items: [{
					id: 'cronRunTimeProfileStatisticsPanelId_' + record.data["cronId"],
					xtype: 'panel',
					border: false,
					flex: 0.4,
					layout: {
	        			type: 'hbox',
	        			align: 'stretch'
	        		},
	        		items: [{
						id: 'cronRuntimeHeatmapPanelId_' + record.data["cronId"],
						xtype: 'panel',
						flex: 0.5,
						layout: 'fit',
						title: 'Runtime Heatmap',
						titleAlign: 'center'
					}, {
						id: 'cronRuntimeForecastingPanelId_' + record.data["cronId"],
						xtype: 'panel',
						flex: 0.5,
						layout: 'fit',
						title: 'Forecasting',
						titleAlign: 'center'
					}]
				}, {
					id: 'cronRuntimeTimeseriesPanelId_' + record.data["cronId"],
					xtype: 'panel',
					flex: 0.6,
					layout: 'fit',
					title: 'Runtime Timeseries',
					titleAlign: 'center'
				}]
	    	});
		}

    	Ext.getCmp('jobAnalysisProductCronPanelId_' + record.data["cronId"]).show();

    	PubMatic.JobAnalysisProduct.Functions.getJobAnalysisRuntimeProfileTimeseriesPanel('cronRuntimeTimeseriesPanelId_' + record.data["cronId"], record.data["cronId"]);
    	PubMatic.JobAnalysisProduct.Functions.getJobAnalysisRuntimeProfileHeatmapPanel('cronRuntimeHeatmapPanelId_' + record.data["cronId"], record.data["cronId"]);
	});

	panel.add({
		id: 'cronsGridPanelId',
		xtype: 'panel',
		border: false,
		flex: 0.5,
		layout: 'fit',
		items: [cronsGridPanel]
	});

	panel.doLayout();
};

PubMatic.JobAnalysisProduct.Functions.loadCronsForThisServer = function (serverId, serverIp) {

	var readDataMask = new Ext.LoadMask(Ext.getCmp('cronsGridPanelId'), {msg:"Loading Crons"});
	readDataMask.show();

	d3.json(PubMatic.JobAnalysisProduct.FileNames.Cron + "/server/" + serverId)
	.get(function(error, cronData) {

		readDataMask.hide();

		Ext.getCmp('cronsGridId').setTitle("Crons@" + serverIp + " (" + cronData.length + ")");
		Ext.getCmp('cronsGridId').getStore().loadData(cronData);
	});
};