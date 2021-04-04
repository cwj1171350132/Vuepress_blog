# git命令

## 创建版本库

* git init    初始化本地版本库
* git clone &lt;url&gt; 克隆远程版本库

## 配置信息

* git config --list  查看配置
* git config user.name "name"  配置用户名
* git config user.email "..@qq.com" 配置邮箱
* git config --global user.name "name"  配置全局用户名
* git config --global user.email "...@qq.com" 配置全局邮箱

## 添加文件进暂存创库

* git add "feat acticle"
* git add .  或者 git add -A  添加所有文件进暂存区

## 查看文件更新状态

* git status

## 添加文件进创库，注释是必须的

* git commit -m "注释"
* git commit -a -m "这是合并操作，添加所有暂存文件以及修改文件进创库,修改文件不是必须添加进暂存区。但对新建文件未添加进暂存区的文件无效"

## 如何忽略文件，对文件不进行备份等

1. 在当前目录下创建文件名为 .gitignore
2. 在文件里面添加要被忽略的文件
   * /temp.txt    #表示忽略根目录下的temp.txt文件
   * /js/*.js     #表示js目录下所有js文件
   * /.gitignore  #忽略本身文件，在这个文件里面#号表示注释

## git 日志

* git log   查看日志
* git log --online 以单行查看日志
* git reflog       查看所有日志，包括回退操作记录等
* git log -p [filename] 查看指定文件的提交历史
* git blame  [filename] 以列表方式查看指定文件的提交历史


## 回退操作

* git reset --hard Head~0 回退到最后一次的提交
* git reset --hard [版本号]  回退到指定版本号
* git checkout head [filename] 回退指定的修改未提交文件(在暂存区的也可以)

## 删除文件

* git rm [filename] 删除文件
* git rm -cached [filename] 删除仓库文件，但不删除本地文件，对于提交了的文件而又改变主意要忽略它，那么用此删除，就可以被忽略掉了

## 对比文件差异

* git diff [版本号1] [版本号2] [比较的文件路径]
* git diff   比较工作区与暂存区的差异

## 创建分支

* git branch   [分支名]

## 切换分支

* git checkout [分支名]

## 创建并切换分支

* git checkout -b [分支名]

## 合并分支

* git merge [分支名]  把分支合并到当前分支
* git rebase [分支名] 和merge不同的是，merge总是按时间轴来排序的，但rebase是基于主分支，然后将本分支版本克隆至主分支最新处

## 删除分支

* git branch -d [分支名]


## 创建变量

* git remote add origin [变量值]    origin为变量名字

## gitHub构建网站

1. 本地仓库创建分支：gh-pages
2. 同步分支
3. 上传命令：git push -f git@github.com:USERNAME/USERNAME.github.io.git gh-pages
4. https://USERNAME.github.io/REPO 访问
5. 访问格式说明：用户名.github.io/仓库名/文件名

## push注意事项

* 把代码push到服务器时需要先pull一下
* 把冲突处理完后再push上去

## pull代码到本地

* 如果本地没有.git目录，需要先初始化一下
* 命令：git pull [服务器地址] [远程的分支] (最后一个参数如果分支是master可省略)

## 使用ssh上传代码

* 公钥和私钥都是用户生成的

1. 命令：ssh-keygen -t rsa  生成的文件会在当前用户目录的.ssh目录下，此时会要求输入密码，可为空，rsa为秘钥类型
2. 将公钥的内容复制到gitHub的设置ssh里面，生成公钥
3. 在git里面上传项目，如果有密码会要求输入
 Login with GitHub
