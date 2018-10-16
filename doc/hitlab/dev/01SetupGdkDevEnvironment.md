GDK 开发环境搭建
==========

## 1. 通过 GDK 安装开发环境

### 1.1. 环境准备

MacOS 下建议采用 HomeBrew 安装软件，安装方法：https://gitlab.com/gitlab-org/gitlab-development-kit/blob/master/doc/prepare.md。

环境变量配置`~/.bash_profile`：

    export PATH="/usr/local/opt/node@8/bin:$PATH"
    export LDFLAGS="-L/usr/local/opt/node@8/lib"
    export CPPFLAGS="-I/usr/local/opt/node@8/include"
    export PATH="/usr/local/opt/postgresql@9.6/bin:$PATH"

### 1.2. 安装GDK

MacOS 下安装过程如下（参考https://gitlab.com/gitlab-org/gitlab-development-kit/blob/master/doc/set-up-gdk.md）：

    gem install gitlab-development-kit
    gdk init myhitlab

### 1.3. Fork Hitlab

先创建自已的 hitlab 分支，Fork https://github.com/hitchainrepo/hitlab（如https://github.com/tylerchen/hitlab.git），在 GDK 目录下检出自己的分支，并重新命名为 gitlab ：

    cd myhitlab
    git clone https://github.com/tylerchen/hitlab.git
    mv hitlab gitlab

### 1.4. 运行 PostgreSql

MacOS 下先确保数据库已经行：

    pg_ctl -D /usr/local/var/postgres -l /usr/local/var/postgres/server.log start
    pg_ctl -D /usr/local/var/postgres -l /usr/local/var/postgres/server.log status
    pg_ctl -D /usr/local/var/postgres -l /usr/local/var/postgres/server.log stop -s -m fast

### 1.6. 修改 Gemfile

把 Gemfile 中的 ruby 源指向国内：

     vi gitlab/Gemfile
     >>> source 'https://rubygems.org'
     vi gitlab/Gemfile.lock
     >>> remote: https://rubygems.org/   

### 1.5. 安装

运行下面的命令进行安装，（我的环境总会出点错，但最后不影响运行）：

    gdk install


### 1.6. 运行

    gdk run

### 1.7. 访问

    http://localhost:3000
    UserName: root
    Password: 5iveL!fe

## 2. 通过 Docker 安装开发环境

    Waiting......
