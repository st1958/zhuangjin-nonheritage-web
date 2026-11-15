锦韵壮乡 · 广西壮锦非遗文化数字展馆
25 大数据管理与应用 2 班　第九组

一、目录说明
　assets/　　　　　五页共用的图片素材（八款纹样图、主视觉织物照、网页图标）
　01-首页-任宏宇/　　　index1.html + common.js（公共脚本）+ page.js + style.css
　02-文化介绍-黄俊杰/　index2.html + page.js + style.css
　03-纹样展示-白高领/　index3.html + page.js + style.css
　04-互动留言-申涛/　　index4.html + page.js + style.css
　05-关于联系-周家豪/　index5.html + page.js + style.css

公共代码集中在首页文件夹的 common.js，五个页面都用 ../01-首页-任宏宇/common.js 引用；
各页自己的脚本 page.js 里只放这一页新增的交互，开头注明负责人姓名与学号；
样式每页一份，图片统一放 assets/，用相对路径 ../assets/ 引用。

二、各页交互
公共 common.js　汉堡菜单、阅读进度条、数字带滚动、卡片渐现、右下角返回顶部与返回首页
01 首页　　　首屏轮播（三张，6 秒自动，可手动切换）
02 文化介绍　　时间轴选中与详情、工序卡展开
03 纹样展示　　分类筛选、纹样详情抽屉、放大镜、收藏
04 互动留言　　留言校验、云端读写（Supabase）、长留言折叠
05 关于联系　　成员卡选中与分工详情、邮箱复制

三、技术说明
纯 HTML + CSS + 原生 JavaScript，无框架、无构建步骤。
留言数据存 Supabase（PostgreSQL）云端表 messages，通过 REST 接口读写；
接口地址与公开密钥写在 04 页脚本顶部，表结构与权限策略见同处注释。
部署于 GitHub Pages，直接打开 index 即可浏览，无需服务器。
