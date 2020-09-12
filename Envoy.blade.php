@servers(['extyl-dev' => 'ec@192.168.101.33'])

@setup
    $repository = 'git@gitlab.com:extyl-dev/expert-cable/frontend/frontend-site-operator.git';
    $releases_dir = $app_dir .'/releases';
    $release = date('YmdHis');
    $new_release_dir = $releases_dir .'/'. $release;
@endsetup


@story('deploy', ['on' => 'extyl-dev'])
    clone_repository
    update_symlinks
    run_yarn
    clean_old_releases
    update_release
    finish_deploy
@endstory


@task('clone_repository')
    echo 'Cloning repository'
    [ -d {{ $releases_dir }} ] || mkdir {{ $releases_dir }}
    git clone --depth 1 --single-branch -b {{ $branch }} {{ $repository }} {{ $new_release_dir }}
    cd {{ $new_release_dir }}
    git reset --hard {{ $commit }}
    echo 'Repository cloned'
@endtask

@task('run_composer')
    echo "Runing composer  ({{ $release }})"
    cd {{ $new_release_dir }}
    composer install --no-dev --prefer-dist --no-scripts -q -o
@endtask

@task('run_yarn')
    echo "Running npm ({{ $release }})"
    cd {{ $new_release_dir }}
    yarn
    yarn generate
@endtask

@task('update_symlinks')
    echo "Linking storage directory"
    rm -rf {{ $new_release_dir }}/storage
    ln -nfs {{ $app_dir }}/storage {{ $new_release_dir }}/storage

    echo 'Linking .env file'
    ln -nfs {{ $app_dir }}/.env {{ $new_release_dir }}/.env

@endtask

@task('clean_old_releases')
    echo '🚾  Cleaning up old releases...'
    cd {{ $releases_dir }};
    rm -rf $(ls -t | tail -n +6);
@endtask


@task('finish_deploy')
    echo '🚀  Application deployed!'
@endtask


@task('deployment_migrate')
    echo '🚾  deployment_migrate...'
    cd {{ $new_release_dir }}
    php artisan migrate --force --no-interaction
    php artisan cache:clear --quiet
@endtask

@task('deployment_cache')
    echo '🚾  deployment_cache...'
    cd {{ $new_release_dir }}
    php artisan storage:link
    php artisan optimize --quiet
    php artisan view:cache --quiet
    php artisan queue:restart
    echo "Cache created"
@endtask


@task('update_release')
    echo 'Linking current release'
    ln -nfs {{ $new_release_dir }} {{ $app_dir }}/current
@endtask