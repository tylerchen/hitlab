调试环境搭建
==========

## 1. 配置调试环境

### 1.1. 使用 byebug/pry-byebug

安装 byebug 或 pry-byebug，

    gem install byebug
    gem install pry-byebug
    
异步调试（参考，都不是太方便）：

    https://github.com/Mon-Ouie/pry-remote
    https://blog.honeybadger.io/remote-debugging-with-byebug-rails-and-pow/
    https://stackoverflow.com/questions/22794176/how-to-use-byebug-with-a-remote-process-e-g-pow

## 2. 使用 RubyMine 开发调试

### 2.1. RubyMine 安装

    商业收费软件，请自行购买。

### 2.2. 配置调试

    Run -> Edit Configurations... -> [+] -> Ruby
    Name: hitlab
    Ruby script: $path-to/tchitlab/lib/run.rb
    Working directory: $path-to/tchitlab
    Environment variables: host=localhost;port=3000;relative_url_root=/
        -> Apply

### 2.3. 调试运行

    Run -> Debug 'hitlab'
