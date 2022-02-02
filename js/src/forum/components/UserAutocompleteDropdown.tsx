import Component from 'flarum/common/Component';
import Button from 'flarum/common/components/Button';
import Dropdown from 'flarum/common/components/Dropdown';
import Separator from 'flarum/common/components/Separator';
import username from 'flarum/common/helpers/username';
import avatar from 'flarum/common/helpers/avatar';
import User from 'flarum/common/models/User';
import extractText from 'flarum/common/utils/extractText';
import app from 'flarum/forum/app';

import type Mithril from 'mithril';
import Stream from 'flarum/common/utils/Stream';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';

interface IAttrs {}

interface IState {
  currentData: User[];
  searchQuery: Stream<string>;
  lastSearchedQuery: string;
  loading: boolean;
}

export default class UserAutocompleteDropdown extends Component<IAttrs, IState> {
  oninit(vnode: Mithril.Vnode<IAttrs, this>): void {
    super.oninit(vnode);

    this.state = {
      currentData: [],
      searchQuery: Stream(''),
      lastSearchedQuery: '',
      loading: false,
    };
  }

  view() {
    this.performSearch(this.state.searchQuery());

    let content = [];

    if (this.state.loading) {
      content.push(<LoadingIndicator />);
    } else if (this.state.searchQuery().length < this.minSearchLength()) {
      this.state.lastSearchedQuery = '';
      content.push(
        <span>
          {extractText(
            app.translator.trans(
              `blomstra-user-filter.forum.index_page.filter_user.${this.state.currentData.length === 0 ? 'start_typing' : 'keep_typing'}`
            )
          )}
        </span>
      );
    } else if (!this.state.currentData?.length) {
      content.push(<span>{extractText(app.translator.trans('blomstra-user-filter.forum.index_page.filter_user.no_results'))}</span>);
    } else {
      content.push(
        this.state.currentData?.map((user) => (
          <Button
            class="BlomstraUserFilter-item Button"
            onclick={() => {
              this.handleUserChange(user);
            }}
          >
            {avatar(user)} {username(user)}
          </Button>
        ))
      );
    }

    if (app.search.params().author) {
      // if author is set
      content.push(
        <Separator />,
        <Button class="Button" icon="fas fa-times" onclick={() => this.handleUserChange(null)}>
          {extractText(app.translator.trans('blomstra-user-filter.forum.index_page.filter_user.remove_filter'))}
        </Button>
      );
    }

    return (
      <Dropdown
        buttonClassName="Button"
        label={this.label}
        updateOnClose
        accessibleToggleLabel={app.translator.trans('blomstra-user-filter.forum.index_page.filter_user.accessible_label')}
      >
        <input
          type="text"
          class="FormControl"
          placeholder={extractText(app.translator.trans('blomstra-user-filter.forum.index_page.filter_user.search_label'))}
          bidi={this.state.searchQuery}
        />

        <Separator />

        {content}
      </Dropdown>
    );
  }

  protected minSearchLength(): number {
    const val = app.forum.attribute<number>('blomstraUserFilter.minSearchLength');

    return val > 0 ? val : 3;
  }

  protected maxResults(): number {
    const val = app.forum.attribute<number>('blomstraUserFilter.resultCount');

    return val > 0 ? val : 5;
  }

  async performSearch(query: string): Promise<void> {
    if (this.state.lastSearchedQuery === query) return;

    if (this.state.searchQuery().length < this.minSearchLength()) {
      this.state.currentData = [];
      return;
    }

    this.state.loading = true;
    this.state.lastSearchedQuery = query;
    m.redraw();

    const data = await app.store.find<User[]>('users', { filter: { q: query }, page: { limit: this.maxResults() } });

    // Prevent race conditions where a new search will finish before an old search
    if (this.state.searchQuery() !== query) return;

    this.state.currentData = data;

    this.state.loading = false;
    m.redraw();
  }

  handleUserChange(user: User | null) {
    const params = app.search.params();

    const old = params.author;

    if (!user) {
      params.author = undefined;
    } else {
      params.author = [user].map((user) => user?.slug()).join(',');
    }

    if (old !== params.author) {
      m.route.set(app.route(app.current.get('routeName'), { ...m.route.param(), ...params }));
    }
  }

  get label() {
    function wrapLabel(text: Mithril.Children) {
      return app.translator.trans('blomstra-user-filter.forum.index_page.filter_user.label', { text: <b>{text}</b> });
    }

    if (app.search.params().author) {
      const slug = app.search.params().author.split(',')[0];
      const count = app.search.params().author.split(',').length;

      const user = app.store.getBy<User>('users', 'slug', slug);

      if (!user) {
        this.handleUserChange(null);
      } else {
        return wrapLabel(user.displayName() + (count > 1 ? ` (+${count - 1})` : ''));
      }
    }

    return wrapLabel(app.translator.trans('blomstra-user-filter.forum.index_page.filter_user.all'));
  }
}
