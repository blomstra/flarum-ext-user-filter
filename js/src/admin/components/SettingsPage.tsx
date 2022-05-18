import app from 'flarum/admin/app';
import ExtensionPage from 'flarum/admin/components/ExtensionPage';

export default class SettingsPage extends ExtensionPage {
  content() {
    return (
      <div className="AuthorFilterSettingsPage">
        <div className="container">
          <p className="helpText">{app.translator.trans('blomstra-user-filter.admin.settings.intro')}</p>
          <div className="Form">
            {this.buildSettingComponent({
              label: app.translator.trans('blomstra-user-filter.admin.settings.min_length'),
              type: 'number',
              setting: 'blomstraUserFilter.minSearchLength',
              placeholder: 3,
            })}
            {this.buildSettingComponent({
              label: app.translator.trans('blomstra-user-filter.admin.settings.result_count'),
              type: 'number',
              setting: 'blomstraUserFilter.resultCount',
              placeholder: 5,
            })}
            {this.submitButton()}
          </div>
        </div>
      </div>
    );
  }
}
