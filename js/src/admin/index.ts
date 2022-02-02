import app from 'flarum/admin/app';

app.initializers.add('blomstra/user-filter', () => {
  app.extensionData
    .for('blomstra-user-filter')
    .registerSetting({
      label: app.translator.trans('blomstra-user-filter.admin.settings.min_length'),
      type: 'number',
      setting: 'blomstraUserFilter.minSearchLength',
      placeholder: 3,
    })
    .registerSetting({
      label: app.translator.trans('blomstra-user-filter.admin.settings.result_count'),
      type: 'number',
      setting: 'blomstraUserFilter.resultCount',
      placeholder: 5,
    });
});
