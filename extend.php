<?php

/*
 * This file is part of blomstra/user-filter.
 *
 * Copyright (c) 2022 Blomstra Ltd
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace Blomstra\UserFilter;

use Flarum\Extend;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__.'/js/dist/forum.js')
        ->css(__DIR__.'/less/forum.less'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__.'/js/dist/admin.js'),

    new Extend\Locales(__DIR__.'/locale'),

    (new Extend\Middleware('forum'))
        ->add(Middleware\AddUserFilter::class),

    (new Extend\Settings())
        ->serializeToForum('blomstraUserFilter.minSearchLength', 'blomstraUserFilter.minSearchLength', 'intval', 3)
        ->serializeToForum('blomstraUserFilter.resultCount', 'blomstraUserFilter.resultCount', 'intval', 5),
];
