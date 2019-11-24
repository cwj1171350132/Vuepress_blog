# koa框架的快速入门与使用

## 简介

Koa 是一个新的 web 框架，由 Express 幕后的原班人马打造， 致力于成为 web 应用和 API 开发领域中的一个更小、更富有表现力、更健壮的基石。通过利用 async 函数，Koa 帮你丢弃回调函数，并有力地增强错误处理。Koa 并没有捆绑任何中间件， 而是提供了一套优雅的方法，帮助您快速而愉快地编写服务端应用程序。

- 新
- 下一代， 超前
- 新的语法， es7
- 优雅

## 安装

```shell script
nvm install 7
npm i koa
```

## 基本用法

1. 架设http服务

只要三行代码，就可以用 Koa 架设一个 HTTP 服务。

```javascript
const Koa = require('koa');
const app = new Koa();
app.listen(3000);
```

2. context对象

Koa 提供一个 Context 对象，表示一次对话的上下文（包括 HTTP 请求和 HTTP 回复）。通过加工这个对象，就可以控制返回给用户的内容。

`Context.response.body`属性就是发送给用户的内容。

```javascript
const Koa = require('koa');
const app = new Koa();
const main = ctx => {
  ctx.response.body = 'Hello World';
};
app.use(main);
app.listen(3000);
```

上面代码中，main 函数用来设置 ctx.response.body。然后，使用 app.use 方法加载 main 函数。

你可能已经猜到了，ctx.response代表 HTTP Response。同样地，ctx.request 代表 HTTP Request。

3. http response类型

Koa 默认的返回类型是 text/plain，如果想返回其他类型的内容，可以先用 ctx.request.accepts 判断一下，客户端希望接受什么数据（根据 HTTP Request 的Accept字段），然后使用ctx.response.type指定返回类型。

```javascript
// demos/03.js
const main = ctx => {
 if (ctx.request.accepts('xml')) {
   ctx.response.type = 'xml';
   ctx.response.body = '<data>Hello World</data>';
} else if (ctx.request.accepts('json')) {
   ctx.response.type = 'json';
   ctx.response.body = { data: 'Hello World' };
} else if (ctx.request.accepts('html')) {
   ctx.response.type = 'html';
   ctx.response.body = '<p>Hello World</p>';
} else {
   ctx.response.type = 'text';
   ctx.response.body = 'Hello World';
}
};
```

4. 网页模板

实际开发中，返回给用户的网页往往都写成模板文件。我们可以让 Koa 先读取模板文件，然后将这个模板返回给用户。

```javascript
const Koa = require('koa');
const app = new Koa();
const fs = require('fs');
const path = require('path');
const main = (ctx) => {
   ctx.response.type = 'html';
   ctx.response.body = fs.createReadStream(path.resolve(path.join(__dirname, './demo.html')));
}
app.use(main);
app.listen(3000);
```

## 路由

1. 原生路由

网站一般都有多个页面。通过ctx.request.path可以获取用户请求的路径，由此实现简单的路由。

```javascript
const main = ctx => {
  if (ctx.request.path !== '/') {
    ctx.response.type = 'html';
    ctx.response.body = '<a href="/">Index Page</a>';
  } else {
    ctx.response.body = 'Hello World';
  }
};
```

2. koa-route模块

原生路由用起来不太方便，我们可以使用封装好的koa-route模块。

```javascript
const route = require('koa-route');
const about = ctx => {
  ctx.response.type = 'html';
  ctx.response.body = '<a href="/">Index Page</a>';
};

const main = ctx => {
  ctx.response.body = 'Hello World';
};

app.use(route.get('/', main));
app.use(route.get('/about', about));
```

3. 静态资源

如果网站提供静态资源（图片、字体、样式表、脚本......），为它们一个个写路由就很麻烦，也没必要。koa-static模块封装了这部分的请求。

```javascript
const path = require('path');
const serve = require('koa-static');

const main = serve(path.join(__dirname));
app.use(main);
```

4. 重定向

有些场合，服务器需要重定向（redirect）访问请求。比如，用户登陆以后，将他重定向到登陆前的页面。ctx.response.redirect() 方法可以发出一个302跳转，将用户导向另一个路由。

```javascript
const redirect = ctx => {
  ctx.response.redirect('/');
  ctx.response.body = '<a href="/">Index Page</a>';
};

app.use(route.get('/redirect', redirect));
```

## 中间件

1. logger

Koa 的最大特色，也是最重要的一个设计，就是中间件（middleware）。为了理解中间件，我们先看一下 Logger （打印日志）功能的实现。

最简单的写法就是在main函数里面增加一行。

```javascript
const main = ctx => {
  console.log(`${Date.now()} ${ctx.request.method} ${ctx.request.url}`);
  ctx.response.body = 'Hello World';
};
```

2. 中间件的概念

上一个例子里面的 Logger 功能，可以拆分成一个独立函数。

```javascript
const logger = (ctx, next) => {
  console.log(`${Date.now()} ${ctx.request.method} ${ctx.request.url}`);
  next();
}
app.use(logger);
```

3. 中间件执行顺序

```javascript
const one = (ctx, next) => {
  console.log('>> one');
  next();
  console.log('<< one');
}

const two = (ctx, next) => {
  console.log('>> two');
  next();
  console.log('<< two');
}

const three = (ctx, next) => {
  console.log('>> three');
  next();
  console.log('<< three');
}

app.use(one);
app.use(two);
app.use(three);
```

结果如下：

```
>> one
>> two
>> three
<< three
<< two
<< one
```

### 洋葱模型

其实就是想向我们表达，调用next的时候，中间件的代码执行顺序是什么

4. 异步中间件

迄今为止，所有例子的中间件都是同步的，不包含异步操作。如果有异步操作（比如读取数据库），中间件就必须写成 async 函数。请看

```javascript
const fs = require('fs.promised');
const Koa = require('koa');
const app = new Koa();

const main = async function (ctx, next) {
  ctx.response.type = 'html';
  ctx.response.body = await fs.readFile('./demos/template.html', 'utf8');
};

app.use(main);
app.listen(3000);
```

5. 中间件的合成

koa-compose 模块可以将多个中间件合成为一个。

```javascript
const compose = require('koa-compose');

const logger = (ctx, next) => {
  console.log(`${Date.now()} ${ctx.request.method} ${ctx.request.url}`);
  next();
}

const main = ctx => {
  ctx.response.body = 'Hello World';
};

const middlewares = compose([logger, main]);
app.use(middlewares);
```

### compose简单介绍

```javascript
var greeting = (firstName, lastName) => 'hello, ' + firstName + ' ' + lastName
var toUpper = str => str.toUpperCase()
var fn = compose(toUpper, greeting)
console.log(fn('jack', 'smith'))   // Hello Jack Smith
```

- compose 的参数是函数，返回的也是一个函数
- 因为除了第一个函数的接受参数，其他函数的接受参数都是上一个函数的返回值，所以初始函数的参数是多元的，而其他函数的接受值是一元的
- compsoe函数可以接受任意的参数，所有的参数都是函数，且执行方向是自右向左的，初始函数一定放到参数的最右面

## 错误处理

下面是常见的HTTP状态码：

- 200 - 请求成功
- 304 - 资源（网页等）被转移到其它URL，缓存
- 404 - 请求的资源（网页等）不存在。客户端错误
- 500 - 内部服务器错误

1. 500错误

如果代码运行过程中发生错误，我们需要把错误信息返回给用户。HTTP 协定约定这时要返回500状态码。Koa 提供了ctx.throw()方法，用来抛出错误，ctx.throw(500)就是抛出500错误。

```javascript
const main = ctx => {
  ctx.throw(500);
};
```

2. 404错误

```javascript
const main = ctx => {
  ctx.response.status = 404;
  ctx.response.body = 'Page Not Found';
};
```

3. 处理错误的中间件

为了方便处理错误，最好使用try...catch将其捕获。但是，为每个中间件都写try...catch太麻烦，我们可以让最外层的中间件，负责所有中间件的错误处理。

```javascript
const handler = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.response.status = err.statusCode || err.status || 500;
    ctx.response.body = {
      message: err.message
    };
  }
};

const main = ctx => {
  ctx.throw(500);
};

app.use(handler);
app.use(main);
```

4. error事件监听

运行过程中一旦出错，Koa 会触发一个error事件。监听这个事件，也可以处理错误。

```javascript
const main = ctx => {
  ctx.throw(500);
};

app.on('error', (err, ctx) =>
  console.error('server error', err);
);
```

5. 释放error事件

需要注意的是，如果错误被try...catch捕获，就不会触发error事件。这时，必须调用ctx.app.emit()，手动释放error事件，才能让监听函数生效。

```javascript
const handler = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.response.status = err.statusCode || err.status || 500;
    ctx.response.type = 'html';
    ctx.response.body = '<p>Something wrong, please contact administrator.</p>';
    ctx.app.emit('error', err, ctx);
  }
};

const main = ctx => {
  ctx.throw(500);
};

app.on('error', function(err) {
  console.log('logging error ', err.message);
  console.log(err);
});
```

说明app是继承自nodejs的EventEmitter对象。

## web app

1. request参数处理

Web 应用离不开处理表单。本质上，表单就是 POST 方法发送到服务器的键值对。koa-body模块可以用来从 POST 请求的数据体里面提取键值对。

```javascript
var koa = require('koa');
var app = new koa();
// var route = require('koa-route');

const main = (ctx) => {
    var dataArr = [];
    ctx.req.addListener('data', (data) => {
        dataArr.push(data);
    });
    ctx.req.addListener('end', () => {
        // console.log(jsonBodyparser(str));
        let data = Buffer.concat(dataArr).toString();
        console.log(data)
    });
    ctx.response.body = 'hello world';
}

app.use(route.post('/', main));  //  1. 路径 2. ctx函数
app.listen(3000);  // 起服务 ， 监听3000端口
```

2. 文件上传

koa-body 模块还可以用来处理文件上传。

```javascript
const os = require('os');
const path = require('path');
const koaBody = require('koa-body');
var route = require('koa-route');
var koa = require('koa');
var app = new koa();
var fs = require('fs');

const main = async function(ctx) {
  const tmpdir = os.tmpdir();
  const filePaths = [];  
  const files = ctx.request.files || {};

  for (let key in files) {
    const file = files[key];
    const filePath = path.join(tmpdir, file.name);
    const reader = fs.createReadStream(file.path);
    const writer = fs.createWriteStream(filePath);
    reader.pipe(writer);
    filePaths.push(filePath);
  }
//   console.log('xxxxxxxx', filePaths)
  ctx.body = filePaths;
};

app.use(koaBody({ multipart: true }));  // 代表我们上传的是文件
app.use(route.post('/upload', main));
app.listen(3000);  // 起服务 ， 监听3000端口
```