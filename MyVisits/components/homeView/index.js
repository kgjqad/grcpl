'use strict';

app.homeView = kendo.observable({
    onShow: function () {
    },
    afterShow: function () {},
    date: null, 
});

// START_CUSTOM_CODE_homeView
// END_CUSTOM_CODE_homeView
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
            filter: {
                field: "MeetingDate",
                operator: "eq",
                value: app.homeView.get("date")
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
        homeViewModel = kendo.observable({
            dataSource: dataSource,

            itemClick: function (e) {
                app.mobileApp.navigate('#components/homeView/details.html?uid=' + e.dataItem.uid);
            },
            detailsShow: function (e) {

                var item = e.view.params.uid,
                    dataSource = homeViewModel.get('dataSource'),
                    itemModel = dataSource.getByUid(item);
                if (!itemModel.Debtor_ID) {
                    itemModel.Debtor_ID = String.fromCharCode(160);
                }
                homeViewModel.set('currentItem', itemModel);


            },
            close: function () {
                $("#mdEdit").data("kendoMobileModalView").close();
                homeViewModel.set('currentItem', null)
                app.mobileApp.navigate("#:back");
            },
            delete: function () {
                var el = new Everlive('EWgzsVbIBodAFkjb');
                var data = el.data('Meeting');
                if (homeViewModel.get('currentItem.Id')) {
                    data.destroySingle({
                            Id: homeViewModel.get('currentItem.Id')
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


                app.mobileApp.navigate('#components/homeView/view.html');
            },

            currentItem: null,
            currentDebtor: null
        });

    parent.set('homeViewModel', homeViewModel);
})(app.homeView);

// START_CUSTOM_CODE_homeViewModel
// END_CUSTOM_CODE_homeViewModel