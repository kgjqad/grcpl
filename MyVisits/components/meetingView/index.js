'use strict';

app.MeetingView = kendo.observable({
    onShow: function () {},
    afterShow: function () {},
});

// START_CUSTOM_CODE_MeetingView
// END_CUSTOM_CODE_MeetingView
(function (parent) {
    var dataProvider = app.data.defaultProvider,
        flattenLocationProperties = function (dataItem) {
            var propName, propValue,
                isLocation = function (value) {
                    return propValue && typeof propValue === 'object' &&
                        propValue.longitude && propValue.latitude;
                };

            for (propName in dataItem) {
                if (dataItem.hasOwnProperty(propName)) {
                    propValue = dataItem[propName];
                    if (isLocation(propValue)) {
                        // Location type property
                        dataItem[propName] =
                            kendo.format('Latitude: {0}, Longitude: {1}',
                                propValue.latitude, propValue.longitude);
                    }
                }
            }
        },

        dataSourceOptions = {
            type: 'everlive',
            autoSync: true,
            transport: {
                typeName: 'Meeting',
                dataProvider: dataProvider
            },

            change: function (e) {
                var data = this.data();
                for (var i = 0; i < data.length; i++) {
                    var dataItem = data[i];

                    flattenLocationProperties(dataItem);
                }
            },

            schema: {
                model: {
                    fields: {
                        'Debtor_ID': {
                            field: 'Debtor_ID',
                            defaultValue: ''
                        },
                        'AltAddress': {
                            field: 'AltAddress',
                            defaultValue: ''
                        },
                        'MeetingDate': {
                            field: 'MeetingDate',
                            defaultValue: ''
                        },
                    }
                }
            },
        },
        dataSourceOptions1 = {
            type: 'everlive',
            autoSync: true,
            transport: {
                typeName: 'Debtor',
                dataProvider: dataProvider
            },

            change: function (e) {
                var data = this.data();
                for (var i = 0; i < data.length; i++) {
                    var dataItem = data[i];

                    flattenLocationProperties(dataItem);
                }
            },
            schema: {
                model: {
                    fields: {
                        'Debtor_ID': {
                            field: 'Debtor_ID',
                            defaultValue: ''
                        },
                        'DebtorCode': {
                            field: 'DebtorCode',
                            defaultValue: ''
                        },
                        'MeetingDate': {
                            field: 'Address',
                            defaultValue: ''
                        },
                    }
                }
            },
        },
        dataSource = new kendo.data.DataSource(dataSourceOptions),
        dataSource1 = new kendo.data.DataSource(dataSourceOptions1),
        MeetingViewModel = kendo.observable({
            dataSource: dataSource,

            itemClick: function (e) {
                app.mobileApp.navigate('#components/meetingView/details.html?uid=' + e.dataItem.uid);
            },
            detailsShow: function (e) {

                var item = e.view.params.uid,
                    dataSource = MeetingViewModel.get('dataSource'),
                    itemModel = dataSource.getByUid(item);
                if (!itemModel.Debtor_ID) {
                    itemModel.Debtor_ID = String.fromCharCode(160);
                }
                MeetingViewModel.set('currentItem', itemModel);


            },
            close: function () {
                $("#mdEdit").data("kendoMobileModalView").close();
            //    MeetingViewModel.set('currentItem', null)
           //     app.mobileApp.navigate("#:back");
            },
            delete: function () {
                var el = new Everlive('EWgzsVbIBodAFkjb');
                var data = el.data('Meeting');
                if (MeetingViewModel.get('currentItem.Id')) {
                    data.destroySingle({
                            Id: MeetingViewModel.get('currentItem.Id')
                        },
                        function () {
                            alert('Item successfully deleted.');
                        },
                        function (error) {
                            alert(JSON.stringify(error));
                        });
                } else {
                    alert("Item not found");
                }


                app.mobileApp.navigate('#components/meetingView/view.html');
            },

            currentItem: null,
            currentDebtor: null,
             checkAvailable: function () {
               if (!this.checkSimulator()) {
                   cordova.plugins.email.isAvailable(this.callback);
               }
           },

           composeEmail: function () {
               if (!this.checkSimulator()) {
                   cordova.plugins.email.open({
                       to: [MeetingViewModel.get('currentItem.Id.EMail')],
                       subject: 'Meeting today',
                       body: 'Hi! ',
                       isHtml: false
                   }, this.callback)
               }
           },

           callback: function (msg) {
               navigator.notification.alert(JSON.stringify(msg), null, 'EmailComposer callback', 'Close');
           },

           checkSimulator: function () {
               if (window.navigator.simulator === true) {
                   alert('This plugin is not available in the simulator.');
                   return true;
               } else if (window.cordova === undefined || window.cordova.plugins === undefined) {
                   alert('Plugin not found. Maybe you are running in AppBuilder Companion app which currently does not support this plugin.');
                   return true;
               } else {
                   return false;
               }
           }
            
        });

    parent.set('MeetingViewModel', MeetingViewModel);
})(app.MeetingView);

// START_CUSTOM_CODE_MeetingViewModel
// END_CUSTOM_CODE_MeetingViewModel
