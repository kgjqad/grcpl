'use strict';

app.clientList = kendo.observable({
    onShow: function () {},
    afterShow: function () {}
});

// START_CUSTOM_CODE_clientList
// END_CUSTOM_CODE_clientList
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
                        'DebtorCode': {
                            field: 'DebtorCode',
                            defaultValue: ''
                        },
                    }
                }
            },
            serverFiltering: true,
            serverSorting: true,
            serverPaging: true,
            pageSize: 50
        },
        dataSource = new kendo.data.DataSource(dataSourceOptions),
        clientListModel = kendo.observable({
            dataSource: dataSource,
            itemClick: function (e) {
                app.mobileApp.navigate('#components/clientList/details.html?uid=' + e.dataItem.uid);
            },
            detailsShow: function (e) {
                var item = e.view.params.uid,
                    dataSource = clientListModel.get('dataSource'),
                    itemModel = dataSource.getByUid(item);
                if (!itemModel.DebtorCode) {
                    itemModel.DebtorCode = String.fromCharCode(160);
                }
                clientListModel.set('currentItem', itemModel);
            },
            schedule: function (e) {
                app.mobileApp.navigate('#components/meetingView/view.html?uid=' + e.dataItem.uid);
            },
            create: function (e) {
                alert( this.date);
                       var el = new Everlive('EWgzsVbIBodAFkjb');
       var data = el.data('Meeting');
                data.create({
                    'Debtor_ID': clientListModel.get('currentItem.Debtor_ID'),
                        'MeetingDate': this.date
                    ,
                    function (data) {
                        alert(JSON.stringify(data));
                    },
                    function (error) {
                        alert(JSON.stringify(error));
                    }
                });
            },
            cancel: function (e) {},

            currentItem: null,
            date: null
        });

    parent.set('clientListModel', clientListModel);
})(app.clientList);

// START_CUSTOM_CODE_clientListModel
// END_CUSTOM_CODE_clientListModel