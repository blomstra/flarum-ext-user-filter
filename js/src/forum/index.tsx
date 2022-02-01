import { extend } from 'flarum/common/extend';
import ItemList from 'flarum/common/utils/ItemList';
import app from 'flarum/forum/app';
import IndexPage from 'flarum/forum/components/IndexPage';
import DiscussionListState from 'flarum/forum/states/DiscussionListState';
import GlobalSearchState from 'flarum/forum/states/GlobalSearchState';

import UserAutocompleteDropdown from './components/UserAutocompleteDropdown';

import type Mithril from 'mithril';

app.initializers.add('blomstra/user-filter', () => {
  extend(IndexPage.prototype, 'viewItems', function (items: ItemList<Mithril.Children>) {
    if (app.current.data.routeName === 'byobuPrivate') return;

    items.add('userFilter', <UserAutocompleteDropdown />, -10);
  });

  extend(DiscussionListState.prototype, 'requestParams', function (this: DiscussionListState, params: Record<string, any>) {
    const author = app.search.params().author;

    if (!author) return;

    params.filter.author = author;

    const q = params.filter.q;
    if (q) {
      params.filter.q = `${q} author:${author}`;
    }
  });

  extend(GlobalSearchState.prototype, 'stickyParams', function (this: GlobalSearchState, params) {
    params.author = m.route.param('author');
  });
});
