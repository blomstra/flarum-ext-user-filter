import app from 'flarum/admin/app';
import SettingsPage from './components/SettingsPage';

app.initializers.add('blomstra/user-filter', () => {
  app.extensionData.for('blomstra-user-filter').registerPage(SettingsPage);
});
