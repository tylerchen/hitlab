配置远程 Gitaly
===

## 1. 配置 Gitaly

### 1.1. Gitaly 服务端配置

    vi $path-to/tchitlab/gitaly/config.toml
    >>> listen_addr = "localhost:9999"
    >>> token = 'abc123secret'

### 1.2. Gitaly 客户端配置

    vi $path-to/tchitlab/gitlab/config/gitlab.yml
    remove gitaly.client_path: $path-to/tchitlab/gitaly/bin
    >>> gitaly.token: 'abc123secret'
    >>> repositories.storages.default.gitaly_address: tcp://localhost:9999


## 2. 启动

### 2.1. 启动 Gitaly 服务端

    cd $path-to/tchitlab/gitaly
    ./bin/gitaly config.toml

### 2.2. 启动 Gitaly 客户端

    GDK: gdk run
    RubyMine: Run -> Debug 'hitlab'

